import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { H3 } from "../components/typography/H3";
import { H6 } from "../components/typography/H6";
import { ActionButton } from "../components/ActionButton";
import { Heart } from "lucide-react";
import { cn } from "../lib/utils";


interface QuoteCardProps {
  quote: string,
  author: string,
  isLiked: boolean,
  handleToggleLike: () => void,
  handleQuoteIndexUpdate: () => void
} 

export function QuoteCard({
  quote,
  author,
  isLiked,
  handleToggleLike,
  handleQuoteIndexUpdate,
}: QuoteCardProps) {
  return (
    <Card size="lg" className="mx-auto w-full max-w-xl">
      <CardContent className={"flex flex-col gap-2"}>
        <div className="flex justify-end">
          <ActionButton
            symbol={
              <Heart
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  isLiked //
                    ? "fill-red-500 text-red-500"
                    : "text-slate-400",
                )}
              />
            }
            counter={isLiked ? 1 : 0}
            onClick={() => handleToggleLike()}
          />
        </div>
        <H3 element="h3" >
          {quote}
        </H3>
        <H6 element='h6'> {`- ${author}`} </H6>
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
