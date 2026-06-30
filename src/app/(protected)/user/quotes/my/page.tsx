import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { QuoteFilters } from "@/components/QuoteFilters";
import { QuotePagination } from "@/components/QuotePagination";
import { H1 } from "@/components/typography/H1";
import { H3 } from "@/components/typography/H3";
import { H6 } from "@/components/typography/H6";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { TQuote, PageProps, categoryLabels } from "@/types/quotes";
import Link from "next/link";
import { MyQuoteDeleteButton } from "@/components/MyQuoteDeleteButton";

export default async function MyQuotesPage({ searchParams }: PageProps) {
  const session = await auth0.getSession();
  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const resolvedParams = await searchParams;
  const search = resolvedParams.search || "";
  const sort = resolvedParams.sort || "createdAt";
  const page = resolvedParams.page || "1";

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let myQuotes: TQuote[] = [];
  let pagination = { totalPages: 1, currentPage: 1, totalCount: 0 };
  let errorMsg = "";

  try {
    const cookieStore = await cookies();
    const res = await fetch(
      `${baseUrl}/api/user/quotes/my?search=${encodeURIComponent(search)}&sort=${sort}&page=${page}`,
      {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch your quotes");
    }

    const data = await res.json();
    if (data.success) {
      myQuotes = data.quotes;
      pagination = data.pagination;
    }
  } catch (error) {
    errorMsg = "Failed to load your quotes. Please try again later.";
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <H1 element={"p"}>My Quotes</H1>
        <QuoteFilters />
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm">
          {errorMsg}
        </div>
      )}

      <section className="grid gap-6 mb-8">
        {myQuotes.length > 0 ? (
          myQuotes.map((quoteObj) => {
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
                className="w-full shadow-md border-l-4 border-primary/40 rounded-xl overflow-hidden"
              >
                <CardContent className="flex flex-col gap-2 p-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border border-pink-200/50 bg-pink-50 text-pink-600/50 dark:bg-pink-950/20 dark:border-pink-900/50 dark:text-pink-400/50 shadow-sm">
                      {categoryLabels[quoteObj.category] || quoteObj.category}
                    </span>
                    {quoteObj.adminApproved ? (
                      <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full dark:bg-green-50/10">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Approved
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full dark:bg-amber-50/10">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Pending Approval
                      </div>
                    )}
                  </div>

                  <H3 element="h3">“{quoteObj.quote}”</H3>
                  <H6 element="italic">{`- ${quoteObj.author}`}</H6>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground opacity-75">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Created at {formattedDate}</span>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="gap-1"
                      >
                        <Link href={`/user/quotes/edit/${quoteObj._id}`}>
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                      </Button>

                      <MyQuoteDeleteButton quoteId={String(quoteObj._id)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-20 opacity-60">
            <p className="text-slate-500 italic text-lg">
              You haven&apos;t created any quotes yet. <br />
              <Link
                href="/user/quotes/new"
                className="text-primary underline not-italic font-medium"
              >
                Create your first quote now!
              </Link>
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
