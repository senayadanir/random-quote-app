import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { H3 } from "../components/typography/H3";
import { H6 } from "../components/typography/H6";
import { ActionButton } from "../components/ActionButton";
import { Heart, Copy, Check, Quote, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { TQuote, categoryLabels } from "@/types/quotes";
import { useState } from "react";

interface QuoteCardProps {
  quoteItem: TQuote;
  quoteIndex: number;
  userSub?: string;
  handleToggleLike: (index: number) => void;
  handleQuoteIndexUpdate: () => void;
}

export function QuoteCard({
  quoteItem,
  quoteIndex,
  userSub,
  handleToggleLike,
  handleQuoteIndexUpdate,
}: QuoteCardProps) {
  const [copied, setCopied] = useState(false);
  const totalLikes = quoteItem.likedBy?.length ?? 0;
  const isLikedByMe = quoteItem.likedBy?.includes(userSub ?? "") ?? false;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `"${quoteItem.quote}" — ${quoteItem.author}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  const categoryName = categoryLabels[quoteItem.category] || quoteItem.category;
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4 sm:gap-5 px-4 sm:px-0">
      {quoteItem.category && (
        <span
          aria-label={`Category: ${categoryName}`}
          className={cn(
            "px-4 py-1.5 text-xs font-semibold rounded-full border shadow-sm transition-all duration-300 uppercase tracking-wide",
            `pill-${quoteItem.category}`,
          )}
        >
          {categoryName}
        </span>
      )}

      <Card
        size="lg"
        className="mx-auto w-full max-w-xl border-l-0 border-r-0 border-b-0 border-t-[4px] sm:border-t-[5px] border-primary rounded-xl shadow-lg overflow-hidden transition-all duration-300"
      >
        <CardContent
          className={"flex flex-col gap-2 sm:px-8 py-2 sm:py-4 relative"}
        >
          <div className="flex justify-end items-center pb-2 sm:pb-4 md:pb-8">
            <div
              className="absolute top-3 left-6 sm:top-4 sm:left-6 opacity-10 dark:opacity-20 text-primary pointer-events-none"
              aria-hidden="true"
            >
              <Quote className="w-10 h-10 sm:w-14 sm:h-14 rotate-180 fill-current" />
            </div>
            <ActionButton
              symbol={
                <Heart
                  className={cn(
                    "w-5 h-5 transition-colors duration-300 justify-center cursor-pointer",
                    isLikedByMe
                      ? "fill-destructive text-destructive  "
                      : "text-muted-foreground ",
                  )}
                />
              }
              counter={totalLikes}
              onClick={() => handleToggleLike(quoteIndex)}
              aria-label={
                isLikedByMe
                  ? `Unlike this quote. Total likes: ${totalLikes}`
                  : `Like this quote. Total likes: ${totalLikes}`
              }
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              aria-label={
                copied
                  ? "Quote successfully copied to clipboard"
                  : "Copy quote text to clipboard"
              }
              className="h-9 gap-2 font-bold text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer justify-center"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:block">
                    Copy
                  </span>
                </>
              )}
            </Button>
          </div>
          <H3 element="h3">{quoteItem.quote}</H3>
          <H6 element="h6"> {`- ${quoteItem.author}`} </H6>
          <div className="flex flex-col mt-6">
            <Button
              size="sm"
              className="w-full border-none py-5 font-bold transform hover:scale-102 hover:bg-chart-3 hover:shadow-md rounded-lg transition-all ease-out duration-300 cursor-pointer"
              onClick={handleQuoteIndexUpdate}
              aria-label="Show next quote"
            >
              <span>Next Quote</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
