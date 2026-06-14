"use server";

import { auth0 } from "@/lib/auth0";
import { AddNewQuoteState } from "./page";
// import { redirect } from "next/navigation";
// import { NextResponse } from "next/server";
import * as z from "zod";

const NewQuote = z.object({
  author: z
    .string()
    .trim()
    .min(2, "Author name should be at least 2 characters long")
    .max(
      50,
      "Author name should be less than 50 characters long. Please try a shorter name.",
    ),
  quote: z
    .string()
    .trim()
    .min(5, "Quote should be at least 5 characters long")
    .max(
      300,
      "Quote should be less than 300 characters long. Please try a shorter one.",
    ),
});

export default async function addNewQuote(
  currentState: AddNewQuoteState,
  formData: FormData,
) {
  console.log("Action received in addNewQuote:", formData);
  const session = await auth0.getSession();

  if (!session) {
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return {
      success: false,
      message: "Please log in to add a quote.",
      quote: formData,
    };
  }

  // console.log(
  //   "Quote data to be added. Form Data:",
  //   formData,
  //   formData.get("author"),
  //   formData.get("quote"),
  // );

  const rawData = {
    author: formData.get("author"),
    quote: formData.get("quote"),
  };

  const validationOutput = NewQuote.safeParse(rawData);

  console.log("Validation output:", validationOutput);

  if (!validationOutput.success) {
    const validationErrors = z.flattenError(validationOutput.error);
    console.log("Validation errors:", validationErrors);

    return {
      success: false,
      errors: validationErrors,
      data: rawData,
    };
  } else {
    // Return the updated state or any relevant information
    return {
      success: true,
      data: validationOutput,
    };
  }
}
