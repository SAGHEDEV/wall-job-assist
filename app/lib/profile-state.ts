"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProfileData } from "@/app/types";

export type ProfileStatus = "checking" | "no-profile" | "profile-exists" | "error";

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>("checking");

  const refreshProfile = useCallback(async () => {
    try {
      setProfileStatus("checking");
      const response = await fetch("/api/profile", { cache: "no-store" });
      const json = await response.json();

      if (!response.ok || !json?.success) {
        setProfile(null);
        setProfileStatus("error");
        return;
      }

      if (json.profile) {
        setProfile(json.profile);
        setProfileStatus("profile-exists");
        return;
      }

      setProfile(null);
      setProfileStatus("no-profile");
    } catch {
      setProfile(null);
      setProfileStatus("error");
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  return {
    profile,
    profileStatus,
    hasProfile: profileStatus === "profile-exists",
    refreshProfile,
  };
}
