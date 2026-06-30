import { NextRequest, NextResponse } from "next/server";
import { getDb, Collections } from "@/lib/db";
import { auth0 } from "@/lib/auth0";
import { ObjectId, Sort } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!session || !user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.sub;
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sort") || "createdAt";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 5;
    const skip = (page - 1) * limit;

    const db = await getDb();
    const collection = db.collection(Collections.quotes);

    const query: any = { createdBy: userId };

    if (search) {
      query.$or = [
        { quote: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions: Sort = {};
    if (sortBy === "author") {
      sortOptions = { author: 1 };
    } else if (sortBy === "category") {
      sortOptions = { category: 1 };
    } else {
      sortOptions = { createdAt: -1 };
    }

    const [quotes, totalCount] = await Promise.all([
      collection
        .find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      quotes,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("[API_USER_QUOTES_MY_GET_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!session || !user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get("quoteId");

    if (!quoteId || !ObjectId.isValid(quoteId)) {
      return NextResponse.json(
        { error: "Invalid or missing Quote ID" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const collection = db.collection(Collections.quotes);
    const result = await collection.deleteOne({
      _id: new ObjectId(quoteId),
      createdBy: user.sub,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Quote not found or you are not authorized to delete it" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quote deleted successfully",
    });
  } catch (error) {
    console.error("[API_USER_QUOTES_MY_DELETE_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
