import { NextRequest, NextResponse } from "next/server";
import { getDb, Collections } from "@/lib/db";
import { auth0 } from "@/lib/auth0";
import { ObjectId } from "mongodb";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!session || !user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { quoteId, quote, author, category } = body;

    if (!quoteId || !quote || !author || !category) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (!ObjectId.isValid(quoteId)) {
      return NextResponse.json(
        { error: "Invalid Quote ID format" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const col = db.collection(Collections.quotes);
    const result = await col.updateOne(
      {
        _id: new ObjectId(quoteId),
        createdBy: user.sub,
      },
      {
        $set: {
          quote,
          author,
          category,
          adminApproved: false,
          updatedAt: new Date().toISOString(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          error: "Quote not found or you are not authorized to edit this quote",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quote updated successfully and sent for admin review.",
    });
  } catch (error) {
    console.error("[API_USER_QUOTES_EDIT_PUT_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
