import { auth0 } from "@/lib/auth0";
import {
  getApprovedQuotes,
  getLikedQuotes,
  getMyQuotes,
} from "@/app/services/db/quotes";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const userIdParam = searchParams.get("userId");
    const isLiked = searchParams.get("liked") === "true";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "createdAt";
    const page = searchParams.get("page") || "1";

    const session = await auth0.getSession();
    const currentUserId = session?.user?.sub;

    if (isLiked) {
      if (!session || !currentUserId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const likedQuotesData = await getLikedQuotes({
        userId: currentUserId,
        search,
        sort,
        page,
      });

      return NextResponse.json(likedQuotesData, { status: 200 });
    }

    const targetUserId =
      userIdParam || (searchParams.has("my") ? currentUserId : null);

    if (targetUserId) {
      const myQuotesData = await getMyQuotes({
        userId: targetUserId,
        search,
        sort,
        page,
      });

      return NextResponse.json(myQuotesData, { status: 200 });
    }
    const approvedQuotes = await getApprovedQuotes();
    return NextResponse.json(approvedQuotes, { status: 200 });
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
