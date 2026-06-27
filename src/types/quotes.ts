import * as z from "zod";

export const newQuoteSchema = z.object({
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
  category: z.enum(
    [
      "action-success",
      "resilience-failure",
      "mindset-belief",
      "life-happiness",
      "identity-kindness",
    ],
    {
      message: "Please select a valid category from the list.",
    },
  ),
});

export type TAddNewQuoteState = {
  success: boolean;
  errors?: {
    formErrors: string[];
    fieldErrors: {
      author?: string[];
      quote?: string[];
      category?: string[];
      [key: string]: string[] | undefined;
    };
  };
  message?: string;
  quote?: Partial<TQuote>;
  data?: NewQuoteInput;
};

export type TQuoteCategory =
  | "action-success"
  | "resilience-failure"
  | "mindset-belief"
  | "life-happiness"
  | "identity-kindness";

export interface NewQuoteInput {
  author: string;
  quote: string;
  category: TQuoteCategory | "";
}

export interface TQuote {
  quote: string;
  author: string;
  category: TQuoteCategory;
  likedBy?: string[];
}
