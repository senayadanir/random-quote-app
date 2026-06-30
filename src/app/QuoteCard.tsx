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
        <span className="px-4 py-1.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm transition-all duration-300">
          {categoryLabels[quoteItem.category] || quoteItem.category}
        </span>
      )}

      <Card size="lg" className="mx-auto w-full max-w-xl">
        <CardContent className={"flex flex-col gap-2"}>
          <div className="flex justify-end">
            <ActionButton
              symbol={
                <Heart
                  className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    isLikedByMe
                      ? "fill-destructive text-destructive"
                      : "text-muted-foreground ",
                  )}
                />
              }
              counter={totalLikes}
              onClick={() => handleToggleLike(quoteIndex)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-9 gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-xs font-medium">Copy</span>
                </>
              )}
            </Button>
          </div>
          <H3 element="h3">{quoteItem.quote}</H3>
          <H6 element="h6"> {`- ${quoteItem.author}`} </H6>
          <div className="flex flex-col mt-6">
            <Button
              size="sm"
              className="w-full border-none py-5 font-bold transform hover:scale-102 hover:bg-chart-3 hover:shadow-md rounded-lg transition-all ease-out duration-300"
              onClick={handleQuoteIndexUpdate}
            >
              Next Quote
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
