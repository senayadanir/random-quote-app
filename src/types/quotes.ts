import * as z from "zod";
import { Quote as PrismaQuote } from "@prisma/client";

export interface RandomNumberBounds {
  min: number;
  max: number;
}

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
      "philosophy-wisdom",
      "growth-patience",
      "courage-strength",
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
  | "identity-kindness"
  | "philosophy-wisdom"
  | "growth-patience"
  | "courage-strength";

export interface NewQuoteInput {
  author: string;
  quote: string;
  category: TQuoteCategory | "";
}

export type TQuote = Omit<
  PrismaQuote,
  "createdAt" | "updatedAt" | "category" | "id"
> & {
  _id?: string;
  id: string;
  category: TQuoteCategory;
  createdAt: string;
  updatedAt: string;
};

export interface QuotesContextInterface {
  quotes: TQuote[];
  quoteIndex: number;
  isLoading: boolean;
  error: string | null;
  handleQuoteIndexUpdate: () => void;
  handleToggleLike: (targetIndex: number) => void;
  handleDeleteQuote: (targetIndex: number) => Promise<boolean>;
  handleEditQuote: (
    targetIndex: number,
    newQuote: string,
    newAuthor: string,
    newCategory: string,
  ) => Promise<boolean>;
  likedQuotes: TQuote[];
}
export interface QuoteQueryParams {
  search?: string;
  sort?: string;
  page?: string;
}

export interface PageProps {
  searchParams: Promise<QuoteQueryParams>;
}

export interface GetMyQuotesParams {
  userId: string;
  search?: string;
  sort?: string;
  page?: string;
}

export const categoryLabels: Record<string, string> = {
  "action-success": "Action & Success",
  "resilience-failure": "Resilience & Failure",
  "mindset-belief": "Mindset & Belief",
  "life-happiness": "Life & Happiness",
  "identity-kindness": "Identity & Kindness",
  "philosophy-wisdom": "Philosophy & Wisdom",
  "growth-patience": "Growth & Patience",
  "courage-strength": "Courage & Strength",
};
