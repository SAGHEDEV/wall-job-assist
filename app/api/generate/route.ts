import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { withMemWal } from "@mysten-incubation/memwal/ai";
import { openai } from "@ai-sdk/openai";
import { memwal } from "@/app/lib/memwal";
import type { MemoryUsedItem } from "@/app/types";

const model = withMemWal(openai("gpt-4o"), {
  key: process.env.MEMWAL_PRIVATE_KEY!,
  accountId: process.env.MEMWAL_ACCOUNT_ID!,
  serverUrl: process.env.MEMWAL_SERVER_URL ?? "https://relayer-staging.memory.walrus.xyz",
  namespace: "waljob-assist-v1",
});

function toMemoryUsedItems(results: Array<{ text?: string }>, fallbackLabel = "Professional memory"): MemoryUsedItem[] {
  const seen = new Set<string>();
  const memories: MemoryUsedItem[] = [];

  results.forEach((result, index) => {
    const text = result?.text?.trim();
    if (!text || seen.has(text)) return;

    seen.add(text);
    memories.push({
      id: `mem-${index}-${Math.random().toString(36).slice(2, 8)}`,
      label: index === 0 ? "Relevant experience" : fallbackLabel,
      excerpt: text.length > 140 ? `${text.slice(0, 140)}…` : text,
      category: index === 0 ? "experience" : "memory",
    });
  });

  return memories;
}

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, company, role } = await req.json();

    if (!jobDescription?.trim()) {
      return NextResponse.json(
        { success: false, coverLetter: "", memoriesUsed: [], error: "Job description is required" },
        { status: 400 }
      );
    }

    const recallQueries = [
      `Relevant professional experience for: ${jobDescription.slice(0, 300)}`,
      `Technical skills and project experience relevant to: ${jobDescription.slice(0, 300)}`,
      `Writing tone, personal preferences, and career goals relevant to this job: ${jobDescription.slice(0, 300)}`,
    ];

    const recallResults = await Promise.all(
      recallQueries.map((query) => memwal.recall({ query, limit: 3 }))
    );

    const memories: MemoryUsedItem[] = [];
    const seenTexts = new Set<string>();

    recallResults.forEach((result) => {
      result.results?.forEach((entry) => {
        const text = entry?.text?.trim();
        if (!text || seenTexts.has(text)) return;
        seenTexts.add(text);
        memories.push({
          id: `mem-${memories.length}-${Math.random().toString(36).slice(2, 8)}`,
          label: memories.length === 0 ? "Relevant experience" : "Professional memory",
          excerpt: text.length > 140 ? `${text.slice(0, 140)}…` : text,
          category: memories.length === 0 ? "experience" : "memory",
        });
      });
    });

    const result = await generateText({
      model,
      messages: [
        {
          role: "user",
          content: `
            You are WalJob Assist, an AI career assistant with access
            to the candidate's persistent professional memory.

            Create a personalized cover letter for this job.

            JOB DESCRIPTION:
            ${jobDescription}

            COMPANY:
            ${company || "Not specified"}

            ROLE:
            ${role || "Not specified"}

            Instructions:
            - Use the candidate's professional memory.
            - Select experience relevant to this job.
            - Only use facts available in memory.
            - Never invent experience.
            - Never exaggerate.
            - Respect the candidate's writing preferences.
            - Keep the letter concise.
            - Make it professional, confident and human.
            - Avoid generic corporate buzzwords.
            - Return only the finished cover letter.
          `,
        },
      ],
    });

    const coverLetter = result.text.trim();

    const applicationMemory = `
[APPLICATION]
Company: ${company || "Not specified"}
Role: ${role || "Not specified"}
Created: ${new Date().toISOString()}

JOB DESCRIPTION:
${jobDescription.trim()}

COVER LETTER:
${coverLetter}

MEMORIES USED:
${memories.map((memory) => `- ${memory.excerpt}`).join("\n")}
`;

    const saveResult = await memwal.remember(applicationMemory);
    await memwal.waitForRememberJob(saveResult.job_id);

    return NextResponse.json({
      success: true,
      coverLetter,
      memoriesUsed: memories,
      role,
      company,
    });
  } catch (error) {
    console.error("Generation failed:", error);
    return NextResponse.json(
      {
        success: false,
        coverLetter: "",
        memoriesUsed: [],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
