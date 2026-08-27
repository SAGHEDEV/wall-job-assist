import { NextRequest, NextResponse } from "next/server";
import { getProfile, saveProfile } from "@/app/lib/memory";
import type { ProfileData } from "@/app/types";

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json({
      success: true,
      profile,
      hasProfile: Boolean(profile),
    });
  } catch {
    return NextResponse.json({
      success: false,
      profile: null,
      hasProfile: false,
      error: "Couldn't reach your professional memory.",
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data: ProfileData = await req.json();
    const result = await saveProfile(data);

    if (!result.success) {
      return NextResponse.json(
        { success: false, savedSections: [], error: result.error ?? "Couldn't save your profile." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      savedSections: result.savedSections,
    });
  } catch (error) {
    console.error("Profile save failed:", error);
    return NextResponse.json(
      { success: false, savedSections: [], error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
