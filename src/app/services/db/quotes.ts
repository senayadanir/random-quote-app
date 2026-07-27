import { getDb, Collections } from "@/lib/db";
import {
  GetMyQuotesParams,
  TQuote,
  QuoteQueryParams,
  TQuoteCategory,
} from "@/types/quotes";
import { ObjectId, UpdateFilter } from "mongodb";

async function fetchPaginatedQuotes(
  baseQuery: any,
  { search = "", sort = "createdAt", page = "1" }: QuoteQueryParams,
) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const col = db.collection<TQuote>(Collections.quotes); // 1. Tanımlama (Başka yok)
  const query = { ...baseQuery };

  if (search) {
    query.$or = [
      { quote: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
    ];
  }

  const sortObj: any = {};
  if (sort === "createdAt") {
    sortObj.createdAt = -1;
  } else {
    sortObj[sort] = 1;
  }

  const limit = 5;
  const pageNum = parseInt(page, 10) || 1;
  const skip = (pageNum - 1) * limit;

  const totalCount = await col.countDocuments(query);
  const rawQuotes = await col
    .find(query)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .toArray();

  const quotes = rawQuotes.map((quote) => ({
    ...quote,
    _id: String(quote._id),
  }));

  return {
    quotes,
    pagination: {
      totalPages: Math.ceil(totalCount / limit) || 1,
      currentPage: pageNum,
      totalCount,
    },
  };
}

export async function getApprovedQuotes() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database connection could not be established.");
  }

  const col = db.collection<TQuote>(Collections.quotes);
  const query = { adminApproved: true };
  const rawQuotes = await col.find(query).toArray();

  return rawQuotes.map((quote) => ({
    ...quote,
    _id: quote._id ? String(quote._id) : null,
  }));
}

export async function toggleQuoteLike(quoteId: string, userId: string) {
  if (!ObjectId.isValid(quoteId)) {
    return null;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const col = db.collection(Collections.quotes);
  const objId = new ObjectId(quoteId);

  const quote = await col.findOne({ _id: objId });
  if (!quote) {
    return null;
  }

  const likedBy: string[] = quote.likedBy || [];
  const isCurrentlyLiked = likedBy.includes(userId);

  const updateQuery: any = isCurrentlyLiked
    ? ({ $pull: { likedBy: userId } } as unknown as UpdateFilter<any>)
    : ({ $addToSet: { likedBy: userId } } as unknown as UpdateFilter<any>);

  await col.updateOne({ _id: objId }, updateQuery);

  return {
    success: true,
    isLiked: !isCurrentlyLiked,
  };
}

export async function getQuoteForEdit(quoteId: string, userId: string) {
  if (!ObjectId.isValid(quoteId)) {
    return null;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const collection = db.collection(Collections.quotes); // İsmi tamamen farklı
  const quoteDoc = await collection.findOne({
    _id: new ObjectId(quoteId),
    createdBy: userId,
  });

  if (!quoteDoc) {
    return null;
  }

  return {
    _id: String(quoteDoc._id),
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
  return fetchPaginatedQuotes({ likedBy: userId }, restParams);
}

export async function updateQuote(
  quoteId: string,
  userId: string,
  updateData: { quote: string; author: string; category: TQuoteCategory },
) {
  if (!ObjectId.isValid(quoteId)) {
    throw new Error("Invalid Quote ID format");
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const col = db.collection(Collections.quotes);
  return await col.updateOne(
    { _id: new ObjectId(quoteId), createdBy: userId },
    {
      $set: {
        ...updateData,
        adminApproved: false,
        updatedAt: new Date().toISOString(),
      },
    },
  );
}

export async function deleteQuote(quoteId: string, userId: string) {
  if (!ObjectId.isValid(quoteId)) {
    return null;
  }

  const db = await getDb();
  if (!db) throw new Error("Database connection failed");

  const col = db.collection(Collections.quotes);

  return await col.deleteOne({
    _id: new ObjectId(quoteId),
    createdBy: userId,
  });
}
