import { memwal } from "@/app/lib/memwal";
import { NextResponse } from "next/server";

const memories = [
    "I have over 2 years of professional frontend development experience, primarily building web applications with React, Next.js, and TypeScript.",

    "I worked on an AI-powered platform where I integrated third-party APIs and built reusable frontend components.",

    "I worked on a travel marketplace that involved integrating flight provider APIs and building user-facing booking interfaces.",

    "I have experience leading frontend development and collaborating with backend developers and other engineers.",

    "I prefer cover letters that are professional, confident, concise, and human. I do not want exaggerated claims or generic corporate buzzwords.",

    "My strongest technical skills are React, Next.js, TypeScript, Tailwind CSS, API integration, and component architecture.",
];

export async function POST() {
    try {
        const jobs = [];

        for (const memory of memories) {
            const job = await memwal.remember(memory);
            jobs.push(job);
        }

        const stored = [];

        for (const job of jobs) {
            stored.push(await memwal.waitForRememberJob(job.job_id));
        }

        return NextResponse.json({
            success: true,
            stored,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}