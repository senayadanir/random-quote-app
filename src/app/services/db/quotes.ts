import { getDb, Collections } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import {
  GetMyQuotesParams,
  QuoteQueryParams,
  TQuoteCategory,
} from "@/types/quotes";

async function fetchPaginatedQuotes(
  baseQuery: any,
  { search = "", sort = "createdAt", page = "1" }: QuoteQueryParams,
) {
  const limit = 5;
  const pageNum = parseInt(page, 10) || 1;
  const skip = (pageNum - 1) * limit;

  const where: any = {
    ...baseQuery,
    ...(search
      ? {
          OR: [
            { quote: { contains: search, mode: "insensitive" } },
            { author: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "createdAt"
      ? { createdAt: "desc" as const }
      : { [sort]: "asc" as const };

  const [rawQuotes, totalCount] = await Promise.all([
    prisma.quote.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.quote.count({ where }),
  ]);

  return {
    quotes: rawQuotes,
    pagination: {
      totalPages: Math.ceil(totalCount / limit) || 1,
      currentPage: pageNum,
      totalCount,
    },
  };
}

export async function getApprovedQuotes() {
  return await prisma.quote.findMany({
    where: { adminApproved: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleQuoteLike(quoteId: string, userId: string) {
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
  });

  if (!quote) return null;

  const likedBy: string[] = quote.likedBy || [];
  const isCurrentlyLiked = likedBy.includes(userId);

  const updatedLikedBy: any = isCurrentlyLiked
    ? likedBy.filter((id) => id !== userId)
    : [...likedBy, userId];

  await prisma.quote.update({
    where: { id: quoteId },
    data: { likedBy: updatedLikedBy },
  });

  return {
    success: true,
    isLiked: !isCurrentlyLiked,
  };
}

export async function getQuoteForEdit(quoteId: string, userId: string) {
  const quoteDoc = await prisma.quote.findFirst({
    where: {
      id: quoteId,
      createdBy: userId,
    },
  });

  if (!quoteDoc) {
    return null;
  }

  return {
    _id: quoteDoc.id,
    quote: quoteDoc.quote,
    author: quoteDoc.author,
    category: quoteDoc.category,
  };
}

export async function getMyQuotes({
  userId,
  ...restParams
}: GetMyQuotesParams) {
  return fetchPaginatedQuotes({ createdBy: userId }, restParams);
}

export async function getLikedQuotes({
  userId,
  ...restParams
}: GetMyQuotesParams) {
  return fetchPaginatedQuotes({ likedBy: { has: userId } }, restParams);
}

export async function updateQuote(
  quoteId: string,
  userId: string,
  updateData: { quote: string; author: string; category: TQuoteCategory },
) {
  return await prisma.quote.updateMany({
    where: { id: quoteId, createdBy: userId },
    data: {
      ...updateData,
      adminApproved: false,
    },
  });
}

export async function deleteQuote(quoteId: string, userId: string) {
  return await prisma.quote.deleteMany({
    where: {
      _id: quoteId,
      createdBy: userId,
    },
  });
}
