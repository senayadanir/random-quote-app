"use server";
import { auth0 } from "@/lib/auth0";
import {
  NewQuoteInput,
  TAddNewQuoteState,
  newQuoteSchema,
} from "@/types/quotes";
// import { redirect } from "next/navigation";
// import { NextResponse } from "next/server";
import * as z from "zod";

export default async function addNewQuote(
  _currentState: TAddNewQuoteState,
  formData: FormData,
): Promise<TAddNewQuoteState> {
  console.log("Action received in addNewQuote:", formData);
  const session = await auth0.getSession();

  if (!session) {
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
    author: formData.get("author")?.toString() ?? "",
    quote: formData.get("quote")?.toString() ?? "",
    category: formData.get("category")?.toString() ?? "",
  };

  const validationOutput = newQuoteSchema.safeParse(rawData);

  console.log("Validation output:", validationOutput);

  if (!validationOutput.success) {
    const validationErrors = z.flattenError(validationOutput.error);
    console.log("Validation errors:", validationErrors);

    return {
      success: false,
      errors: validationErrors,
      message: " Please fix the errors above.",
      data: {
        author: rawData.author,
        quote: rawData.quote,
        category: rawData.category,
      } as NewQuoteInput,
    };
  } else {
    // Return the updated state or any relevant information
    return {
      success: true,
      data: validationOutput.data,
      message: "Quote added successfully!",
    };
  }
}
