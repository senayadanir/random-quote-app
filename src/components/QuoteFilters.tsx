"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Search, ArrowUpDown, SlidersHorizontal, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function QuoteFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "createdAt";

  // Debounce
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== currentSearch) {
        updateQueryParams("search", searchTerm);
      }
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const sortOptions = [
    { key: "createdAt", label: "Date Added" },
    { key: "author", label: "Author (A-Z)" },
    { key: "category", label: "Category" },
  ];

  return (
    <div className="w-full max-w-xl mx-auto mb-6 flex flex-col sm:flex-row gap-3 px-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
        <Input
          type="text"
          placeholder="Search quotes or authors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-10 rounded-xl bg-background border shadow-sm w-full"
        />
        {isPending && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground animate-pulse font-medium bg-muted px-1.5 py-0.5 rounded">
            Syncing...
          </span>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-xl border shadow-sm font-semibold text-sm px-4 shrink-0 w-full sm:w-auto justify-center"
          >
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span>Filters</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-xl shadow-lg mt-1 backdrop-blur-md bg-background/95"
        >
          <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground py-2">
            Sort Options
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.key}
              onClick={() => updateQueryParams("sort", option.key)}
              className="flex items-center justify-between py-2 rounded-lg text-sm cursor-pointer"
            >
              <span
                className={
                  currentSort === option.key
                    ? "font-bold text-primary"
                    : "font-medium"
                }
              >
                {option.label}
              </span>
              {currentSort === option.key && (
                <Check className="w-4 h-4 text-primary shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
