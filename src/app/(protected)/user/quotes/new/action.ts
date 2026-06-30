"use server";
import { auth0 } from "@/lib/auth0";
import { getDb, Collections } from "@/lib/db";
import {
  TAddNewQuoteState,
  TQuoteCategory,
  newQuoteSchema,
} from "@/types/quotes";
import * as z from "zod";

export default async function addNewQuote(
  _currentState: TAddNewQuoteState,
  formData: FormData,
): Promise<TAddNewQuoteState> {
  // console.log("Action received in addNewQuote:", formData);
  const session = await auth0.getSession();
  const user = session?.user;
  console.log("user", user);

  if (!session || !user) {
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return {
      success: false,
      message: "Please log in to add a quote.",
    };
  }

  // console.log(
  //   "Quote data to be added. Form Data:",
  //   formData,
  //   formData.get("author"),
  //   formData.get("quote"),
  // );

  const rawData = {
    author: String(formData.get("author") ?? ""),
    quote: String(formData.get("quote") ?? ""),
    category: (formData.get("category")?.toString() ?? "") as
      | TQuoteCategory
      | "",
  };

  const validationOutput = newQuoteSchema.safeParse(rawData);

  // console.log("Validation output:", validationOutput);

  if (!validationOutput.success) {
    const validationErrors = z.flattenError(validationOutput.error);
    console.log("Validation errors:", validationErrors);

    return {
      success: false,
      errors: validationErrors,
      message: " Please fix the errors below.",
      data: rawData,
    };
  } else {
    const db = await getDb();
    const col = db.collection(Collections.quotes);
    const currentDate = new Date();

    const newQuote = {
      quote: validationOutput.data.quote,
      author: validationOutput.data.author,
      category: validationOutput.data.category,
      createdBy: user.sub,
      likedBy: [],
      adminApproved: false,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    const newDoc = await col.insertOne(newQuote);
    console.log("newDoc", newDoc);

    return {
      success: true,
      data: validationOutput.data,
      message: "Quote added successfully!",
    };
  }
}
