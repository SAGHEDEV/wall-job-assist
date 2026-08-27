import { NextRequest, NextResponse } from "next/server";
import { getApplications, saveApplication } from "@/app/lib/memory";

export async function GET() {
  try {
    const applications = await getApplications();
    return NextResponse.json({ success: true, applications });
  } catch {
    return NextResponse.json({ success: true, applications: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const application = body?.application ?? body;

    if (!application?.company || !application?.role || !application?.jobDescription || !application?.coverLetter) {
      return NextResponse.json(
        { success: false, error: "Company, role, job description, and cover letter are required." },
        { status: 400 }
      );
    }

    await saveApplication({
      company: String(application.company),
      role: String(application.role),
      jobDescription: String(application.jobDescription),
      coverLetter: String(application.coverLetter),
      memoriesUsed: Array.isArray(application.memoriesUsed) ? application.memoriesUsed : [],
      createdAt: application.createdAt ?? new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
