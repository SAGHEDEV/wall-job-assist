import { NextResponse } from "next/server";
import { memwal } from "@/app/lib/memwal";

export async function GET() {
    try {
        const queries = [
            "What experience does this candidate have working on AI products?",
            "What technical skills does this candidate have?",
            "What are the candidate's writing preferences?",
            "What experience does this candidate have with travel products?",
        ];

        const results = [];

        for (const query of queries) {
            const recalled = await memwal.recall({
                query,
                limit: 3,
            });

            results.push({
                query,
                memories: recalled.results,
            });
        }

        return NextResponse.json({
            success: true,
            results,
        });
    } catch (error) {
        console.error("Recall failed:", error);

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}