"use server";
import { prisma } from "@/lib/prisma";
import { auth0 } from "@/lib/auth0";
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

  if (!session || !user || !user.sub) {
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return {
      success: false,
      message: "Please log in to add a quote.",
    };
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
    //console.log("Validation errors:", validationErrors);

    return {
      success: false,
      errors: validationErrors,
      message: " Please fix the errors below.",
      data: rawData,
    };
  }
  try {
    await prisma.quote.create({
      data: {
        quote: validationOutput.data.quote,
        author: validationOutput.data.author,
        category: validationOutput.data.category,
        createdBy: user.sub,
        adminApproved: false,
      },
    });

    return {
      success: true,
      data: validationOutput.data,
      message: "Quote added successfully!",
    };
  } catch (error) {
    console.error("Edit quote action error:", error);
    return { success: false, message: "Internal server error occurred." };
  }
}
