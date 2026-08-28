"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProfileData } from "@/app/types";

export type ProfileStatus = "checking" | "no-profile" | "profile-exists" | "error";

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>("checking");

  const refreshProfile = useCallback(async () => {
    const previousProfile = profile;

    try {
      setProfileStatus("checking");
      const response = await fetch("/api/profile", { cache: "no-store" });
      const json = await response.json();

      if (!response.ok || !json?.success) {
        if (previousProfile) {
          setProfile(previousProfile);
          setProfileStatus("profile-exists");
          return;
        }

        setProfile(null);
        setProfileStatus("error");
        return;
      }

      if (json.profile) {
        setProfile(json.profile);
        setProfileStatus("profile-exists");
        return;
      }

      if (previousProfile) {
        setProfile(previousProfile);
        setProfileStatus("profile-exists");
        return;
      }

      setProfile(null);
      setProfileStatus("no-profile");
    } catch {
      if (previousProfile) {
        setProfile(previousProfile);
        setProfileStatus("profile-exists");
        return;
      }

      setProfile(null);
      setProfileStatus("error");
    }
  }, [profile]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshProfile();
  }, [refreshProfile]);

  return {
    profile,
    profileStatus,
    hasProfile: profileStatus === "profile-exists",
    refreshProfile,
  };
}
