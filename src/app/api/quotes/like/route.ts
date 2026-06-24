import { getDb, Collections } from "@/lib/db";
import { auth0 } from "@/lib/auth0";
import { ObjectId, UpdateFilter } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!session || !user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quoteId } = await request.json();
    if (!quoteId) {
      return NextResponse.json(
        { error: "Quote ID is required" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const col = db.collection(Collections.quotes);

    // 1. İlgili alıntıyı bul
    const quote = await col.findOne({ _id: new ObjectId(quoteId) });
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const likedBy: string[] = quote.likedBy || [];
    const userId = user.sub;

    let updateQuery = likedBy.includes(userId)
      ? ({ $pull: { likedBy: userId } } as unknown as UpdateFilter<any>)
      : ({ $addToSet: { likedBy: userId } } as unknown as UpdateFilter<any>);

    // 2. MongoDB'yi güncelle
    await col.updateOne({ _id: new ObjectId(quoteId) }, updateQuery);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("LIKE API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
