import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { H3 } from "../components/typography/H3.js";
import { H6 } from "../components/typography/H6.js";
import { EmojiButton } from "../components/EmojiButton";
import { Heart, HeartOff } from "lucide-react";
import { cn } from "../lib/utils";

export function QuoteCard({
  quote,
  author,
  likeCount,
  unlikeCount,
  handleLikeQuote,
  handleUnlikeQuote,
  handleQuoteIndexUpdate,
}) {
  return (
    <Card size="lg" className="mx-auto w-full max-w-xl">
      <CardContent className={"flex flex-col gap-2"}>
        <div className="flex justify-end">
          <EmojiButton
            symbol={
              <HeartOff
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  unlikeCount > 0
                    ? "fill-amber-600 text-amber-600 scale-110"
                    : "text-slate-400 hover:text-amber-500",
                )}
              />
            }
            counter={unlikeCount}
            onClick={handleUnlikeQuote}
          />

          <EmojiButton
            symbol={
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  likeCount > 0
                    ? "fill-red-500 text-red-500"
                    : "text-slate-400",
                )}
              />
            }
            counter={likeCount}
            onClick={handleLikeQuote}
          />
        </div>
        <H3 element="h3" className="text-current dark:text-white">
          {quote}
        </H3>
        <H6 className="text-current dark:text-white"> {`- ${author}`} </H6>
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
  );
}
