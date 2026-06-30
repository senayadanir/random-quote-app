"use server";

import { auth0 } from "@/lib/auth0";
import { getDb, Collections } from "@/lib/db";
import {
  TAddNewQuoteState,
  TQuoteCategory,
  newQuoteSchema,
} from "@/types/quotes";
import { ObjectId } from "mongodb";
import * as z from "zod";

export default async function editQuoteAction(
  _currentState: TAddNewQuoteState,
  formData: FormData,
): Promise<TAddNewQuoteState> {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!session || !user) {
    return { success: false, message: "Please log in to edit a quote." };
  }

  const quoteId = String(formData.get("quoteId") ?? "");
  if (!quoteId || !ObjectId.isValid(quoteId)) {
    return { success: false, message: "Invalid or missing Quote ID." };
  }

  const rawData = {
    author: String(formData.get("author") ?? ""),
    quote: String(formData.get("quote") ?? ""),
    category: (formData.get("category")?.toString() ?? "") as
      | TQuoteCategory
      | "",
  };

  const validationOutput = newQuoteSchema.safeParse(rawData);

  if (!validationOutput.success) {
    const validationErrors = z.flattenError(validationOutput.error);
    return {
      success: false,
      errors: validationErrors,
      message: "Please fix the errors below.",
      data: rawData,
    };
  }

  try {
    const db = await getDb();
    const col = db.collection(Collections.quotes);
    const result = await col.updateOne(
      {
        _id: new ObjectId(quoteId),
        createdBy: user.sub,
      },
      {
        $set: {
          quote: validationOutput.data.quote,
          author: validationOutput.data.author,
          category: validationOutput.data.category,
          adminApproved: false,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        message: "Quote not found or you are not authorized.",
      };
    }

    return {
      success: true,
      message: "Quote updated successfully and sent for admin review!",
    };
  } catch (error) {
    console.error("Edit quote action error:", error);
    return { success: false, message: "Internal server error occurred." };
  }
}
