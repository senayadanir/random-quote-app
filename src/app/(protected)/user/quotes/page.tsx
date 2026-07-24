import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { QuoteFilters } from "@/components/QuoteFilters";
import { QuotePagination } from "@/components/QuotePagination";
import { Card, CardContent } from "@/components/ui/card";
import { H3 } from "@/components/typography/H3";
import { H6 } from "@/components/typography/H6";
import { TQuote, PageProps } from "@/types/quotes";

export default async function MyQuotesPage({ searchParams }: PageProps) {
  const session = await auth0.getSession();
  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const sort = resolvedParams.sort || "createdAt";
  const page = resolvedParams.page || "1";

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000" ||
    "http://localhost:3001";

  let quotes: TQuote[] = [];
  let pagination = { totalPages: 1, currentPage: 1, totalCount: 0 };
  let errorMsg = "";

  try {
    const res = await fetch(
      `${baseUrl}/api/user/quotes?search=${encodeURIComponent(search)}&sort=${sort}&page=${page}`,
      {
        headers: {
          Cookie: (await import("next/headers")).cookies().toString(),
        },
        cache: "no-store",
      },
    );

    if (res.ok) {
      const data = await res.json();
      quotes = data.quotes || [];
      pagination = data.pagination || pagination;
    } else {
      errorMsg = "Failed to load your quotes. Please try again later.";
    }
  } catch (error) {
    console.error("[MY_QUOTES_PAGE_FETCH_ERROR]:", error);
    errorMsg = "An unexpected error occurred.";
  }

  return (
    <main className="min-h-[calc(100vh-130px)] py-10 flex flex-col items-center">
      <div className="text-center mb-8 px-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
          Management Console
        </p>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          My Quotes
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
          Review, filter, and manage all the inspiration you have contributed to
          the platform.
        </p>
      </div>

      <QuoteFilters />

      <div className="w-full max-w-xl px-4 flex flex-col gap-4 mt-2">
        {errorMsg ? (
          <p className="text-sm text-destructive text-center py-8 bg-destructive/10 rounded-xl font-medium">
            {errorMsg}
          </p>
        ) : quotes.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-2xl bg-muted/20">
            <p className="text-sm text-muted-foreground font-medium">
              No quotes found matching your criteria.
            </p>
          </div>
        ) : (
          quotes.map((quoteItem) => (
            <Card
              key={String(quoteItem._id)}
              className="w-full shadow-sm rounded-xl border"
            >
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-md">
                    {quoteItem.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {new Date(quoteItem.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <H3
                  element="h3"
                  className="text-base sm:text-lg font-medium leading-relaxed mt-1"
                >
                  “{quoteItem.quote}”
                </H3>

                <H6 element="h6">— {quoteItem.author}</H6>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <QuotePagination
        totalPages={pagination.totalPages}
        currentPage={pagination.currentPage}
      />
    </main>
  );
}
