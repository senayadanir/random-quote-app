"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface LikedQuoteRowProps {
  quoteId: string;
  currentCountOnPage: number;
  currentPage: number;
}

export function LikedQuoteRow({
  quoteId,
  currentCountOnPage,
  currentPage,
}: LikedQuoteRowProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleRemoveLike = async () => {
    try {
      const response = await fetch("/api/quotes/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId }),
      });

      if (response.ok) {
        startTransition(() => {
          if (currentCountOnPage === 1 && currentPage > 1) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", (currentPage - 1).toString());
            router.push(`${pathname}?${params.toString()}`);
          } else {
            router.refresh();
          }
        });
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  return (
    <Button
      size="sm"
      variant="destructive"
      disabled={isPending}
      className="w-full py-5 font-bold rounded-lg shadow-sm transition-all duration-200"
      onClick={handleRemoveLike}
    >
      <Trash2 className="w-4 h-4 mr-2" />
      {isPending ? "Removing..." : "Remove from Favorites"}
    </Button>
  );
}
