import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { QuoteFilters } from "@/components/QuoteFilters";
import { QuotePagination } from "@/components/QuotePagination";
import { H1 } from "../../../../../components/typography/H1";
import { H3 } from "../../../../../components/typography/H3";
import { H6 } from "../../../../../components/typography/H6";
import { Card, CardContent } from "../../../../../components/ui/card";
import { Calendar, Heart } from "lucide-react";
import { TQuote, PageProps, categoryLabels } from "@/types/quotes";
import { LikedQuoteRow } from "./LikedQuoteRow";

export default async function LikedQuotesPage({ searchParams }: PageProps) {
  const session = await auth0.getSession();
  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const sort = resolvedParams.sort || "createdAt";
  const page = resolvedParams.page || "1";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let favoritedQuotes: TQuote[] = [];
  let pagination = { totalPages: 1, currentPage: 1, totalCount: 0 };
  let errorMsg = "";

  try {
    const cookieStore = await cookies();
    const res = await fetch(
      `${baseUrl}/api/user/quotes/liked?search=${encodeURIComponent(search)}&sort=${sort}&page=${page}`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
        cache: "no-store",
      },
    );

    if (res.ok) {
      const data = await res.json();
      favoritedQuotes = data.quotes || [];
      pagination = data.pagination || pagination;
    } else {
      errorMsg = "Failed to load your favorite quotes.";
    }
  } catch (error) {
    console.error("[LIKED_QUOTES_PAGE_ERROR]:", error);
    errorMsg = "An unexpected error occurred.";
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-12 px-4">
      <div className="mb-10 text-center">
        <H1 element="h1">Favorites</H1>
        <p className="text-slate-500 mt-2 font-medium">
          Your curated collection of favorite insights.
        </p>
      </div>

      <QuoteFilters />

      <section className="flex flex-col gap-6 w-full items-center max-w-xl mt-4">
        {errorMsg ? (
          <p className="text-sm text-destructive text-center py-6 bg-destructive/10 rounded-xl font-medium w-full">
            {errorMsg}
          </p>
        ) : favoritedQuotes.length > 0 ? (
          favoritedQuotes.map((quoteObj) => {
            // ✨ BUG 1 & 2 ÇÖZÜMÜ: Tarih dönüşümünü tam olarak kartın maplendiği bu alanda yapıyoruz.
            const formattedDate = new Date(
              quoteObj.createdAt,
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            return (
              <Card
                key={String(quoteObj._id)}
                className="w-full shadow-md border-l-4 border-red-500/40 rounded-xl overflow-hidden" // 🎯 size="lg" kaldırıldı, Tailwind eklendi
              >
                <CardContent className="flex flex-col gap-2 p-6">
                  <div className="flex justify-end">
                    <div className="flex items-center gap-1 text-red-500 bg-red-50 px-3 py-2 dark:bg-red-50/10 rounded-full">
                      <Heart className="w-4 h-4 fill-current" />
                    </div>
                  </div>

                  <H3 element="h3">“{quoteObj.quote}”</H3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground opacity-75">
                    <H6 element="italic">{`- ${quoteObj.author}`}</H6>

                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created at {formattedDate}</span>
                  </div>
                  <div className="flex flex-col mt-6">
                    <LikedQuoteRow
                      quoteId={String(quoteObj._id)}
                      currentCountOnPage={favoritedQuotes.length}
                      currentPage={pagination.currentPage}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-20 opacity-60">
            <p className="text-slate-500 italic text-lg">
              No favorites curated yet. <br />
              Start exploring to fill your collection!
            </p>
          </div>
        )}
      </section>

      <QuotePagination
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
      />
    </main>
  );
}
