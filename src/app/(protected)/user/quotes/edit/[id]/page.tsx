import { auth0 } from "@/lib/auth0";
import { notFound } from "next/navigation";
import EditQuoteForm from "@/components/EditQuoteForm";
import { getQuoteForEdit } from "@/app/services/db/quotes";

interface EditQuotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditQuotePage({ params }: EditQuotePageProps) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!user?.sub) {
    return notFound();
  }

  const resolvedParams = await params;
  const quoteId = resolvedParams.id;
  const serializedQuote = await getQuoteForEdit(quoteId, user.sub);

  if (!serializedQuote) {
    return notFound();
  }

  return <EditQuoteForm initialData={serializedQuote} />;
}
