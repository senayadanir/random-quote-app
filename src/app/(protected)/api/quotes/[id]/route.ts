import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";
import { toggleQuoteLike, updateQuote } from "@/app/services/db/quotes";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!session || !user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const quoteId = resolvedParams.id;

    if (!quoteId) {
      return NextResponse.json(
        { error: "Invalid or missing Quote ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { quote, author, category } = body;

    if (!quote || !author || !category) {
      return NextResponse.json(
        { error: "All fields (quote, author, category) are required" },
        { status: 400 },
      );
    }

    // 4. Veritabanı işini servis katmanına devrediyoruz (MongoDB importları temizlendi)
    const result = await updateQuote(quoteId, user.sub, {
      quote,
      author,
      category,
    });

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
  } catch (error: any) {
    console.error("[API_USER_QUOTES_EDIT_PUT_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!session || !user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const quoteId = resolvedParams.id;

    if (!quoteId) {
      return NextResponse.json(
        { error: "Invalid or missing Quote ID" },
        { status: 400 },
      );
    }

    const result = await toggleQuoteLike(quoteId, user.sub);

    if (!result) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("LIKE API ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth0.getSession();
    const user = session?.user;

    if (!session || !user?.sub) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const quoteId = resolvedParams.id;

    if (!quoteId) {
      return NextResponse.json(
        { error: "Invalid or missing Quote ID" },
        { status: 400 },
      );
    }

    const result = await deleteQuote(quoteId, user.sub);

    if (!result || result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Quote not found or you are not authorized" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quote deleted successfully",
    });
  } catch (error: any) {
    console.error("[API_QUOTE_DELETE_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
function deleteQuote(quoteId: string, sub: string) {
  throw new Error("Function not implemented.");
}
