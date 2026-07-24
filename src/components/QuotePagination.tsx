"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuotePaginationProps {
  totalPages: number;
  currentPage: number;
}

export function QuotePagination({
  totalPages,
  currentPage,
}: QuotePaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8 mb-12 select-none">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1 || isPending}
        onClick={() => handlePageChange(currentPage - 1)}
        className="h-9 gap-1 rounded-xl shadow-sm font-semibold"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Previous</span>
      </Button>

      <div className="text-xs font-bold text-muted-foreground tracking-wider uppercase bg-muted/60 px-3 py-1.5 rounded-lg border">
        Page{" "}
        <span className="text-foreground font-extrabold">{currentPage}</span> of{" "}
        <span className="text-foreground font-extrabold">{totalPages}</span>
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages || isPending}
        onClick={() => handlePageChange(currentPage + 1)}
        className="h-9 gap-1 rounded-xl shadow-sm font-semibold"
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
