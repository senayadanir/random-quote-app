import { getDb, Collections } from "@/lib/db";
import { TQuote } from "@/types/quotes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        {
          error:
            "Internal Server Error: Database connection could not be established.",
          message: "Database connection could not be established.",
        },
        { status: 500 },
      );
    }
    const col = db.collection<TQuote>(Collections.quotes);
    const query = { adminApproved: true };
    const rawQuotes = await col.find(query).toArray();
    const quotes = rawQuotes.map((quote) => ({
      ...quote,
      _id: quote._id ? String(quote._id) : null,
    }));
    return NextResponse.json({ quotes: quotes }, { status: 200 });
  } catch (error: any) {
    console.error("CRITICAL API FAILURE [GET /api/quotes]:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message:
          error?.message || "An unexpected error occurred on the server.",
      },
      { status: 500 },
    );
  }
}
