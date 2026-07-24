import { auth0 } from "@/lib/auth0";
import { redirect, RedirectType } from "next/navigation";
import { ReactNode } from "react";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth0.getSession();

  if (!session || !session.user) redirect("/auth/login", RedirectType.replace);

  const { user, error, loading } = session;

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[250px] space-y-4"
        role="status"
        aria-label="Loading"
      >
        <div className="relative flex items-center justify-center w-12 h-12">
          <div className="w-8 h-8 rounded-full border-4 border-t-(--chart-3) border-r-(--chart-3) border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <span className="text-sm font-medium tracking-wide text-(--muted-foreground) animate-pulse">
          Loading...
        </span>
      </div>
    );
  }
  if (error) {
    return (
      <p>
        An error occured, try to refresh the page and{" "}
        <a href="/auth/login">log in</a> again{" "}
      </p>
    );
  }

  return !!user ? <div>{children}</div> : <></>;
}
