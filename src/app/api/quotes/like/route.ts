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
    if (!quoteId || !ObjectId.isValid(quoteId)) {
      return NextResponse.json(
        { error: "Invalid or missing Quote ID" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const col = db.collection(Collections.quotes);
    const objId = new ObjectId(quoteId);

    const quote = await col.findOne({ _id: objId });
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }
    const userId = user.sub;
    const likedBy: string[] = quote.likedBy || [];
    const isCurrentlyLiked = likedBy.includes(userId);

    let updateQuery: any = isCurrentlyLiked
      ? ({ $pull: { likedBy: userId } } as unknown as UpdateFilter<any>)
      : ({ $addToSet: { likedBy: userId } } as unknown as UpdateFilter<any>);

    // 2. MongoDB'yi güncelle
    await col.updateOne({ _id: objId }, updateQuery);

    return NextResponse.json({ success: true, isLiked: !isCurrentlyLiked });
  } catch (error) {
    console.error("LIKE API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
