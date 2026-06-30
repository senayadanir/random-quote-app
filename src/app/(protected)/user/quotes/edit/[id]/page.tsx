import { getDb, Collections } from "@/lib/db";
import { auth0 } from "@/lib/auth0";
import { ObjectId } from "mongodb";
import { redirect, notFound } from "next/navigation";
import EditQuoteForm from "@/components/EditQuoteForm";

interface EditQuotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditQuotePage({ params }: EditQuotePageProps) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (!session || !user) {
    redirect("/auth/login");
  }

  const resolvedParams = await params;
  const quoteId = resolvedParams.id;

  if (!ObjectId.isValid(quoteId)) {
    return notFound();
  }

  const db = await getDb();
  const collection = db.collection(Collections.quotes);
  const quoteDoc = await collection.findOne({
    _id: new ObjectId(quoteId),
    createdBy: user.sub,
  });

  if (!quoteDoc) {
    return notFound();
  }

  const serializedQuote = {
    _id: String(quoteDoc._id),
    quote: quoteDoc.quote,
    author: quoteDoc.author,
    category: quoteDoc.category,
  };

  return <EditQuoteForm initialData={serializedQuote} />;
}
