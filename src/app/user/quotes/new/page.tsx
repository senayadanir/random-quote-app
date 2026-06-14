"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import addNewQuote from "./action";
import { Quote } from "@/quotes";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { redirect, RedirectType } from "next/navigation";

export type AddNewQuoteState = {
  success: boolean;
  errors?: any;
  message?: string;
  quote?: Partial<Quote>;
  data?: any;
};

const initialAddQuoteState: AddNewQuoteState = {
  success: false,
};

export default function CreateQuotePage() {
  const [state, dispatchAction, isPending] = useActionState(
    addNewQuote,
    initialAddQuoteState,
  );

  if (isPending) {
    return <div>Loading...</div>;
  }

  const handleAddNewQuote = () => {
    redirect("./new", RedirectType.replace);
  };

  console.log("Current state after action:", state);

  return (
    <main className=" min-h-[calc(100vh-64px)] flex-col justify-items-center align-items ">
      {state.success ? (
        <div className="w-full max-w-md border border-primary/20 rounded-2xl mt-14 p-10 shadow-md bg-primary/10 text-primary items-center">
          <h1>
            {" "}
            Thank you adding a new quote. It's now sent to administator for
            review.{" "}
          </h1>
          <p className="mt-8">
            Click{" "}
            <Button onClick={handleAddNewQuote} className="mt-10 ">
              here
            </Button>
            to add another quote.
          </p>
        </div>
      ) : (
        <form
          className="w-full max-w-md bg-background border rounded-2xl mt-10 p-10 shadow-md"
          action={dispatchAction}
        >
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Add New Quote</FieldLegend>
              <FieldDescription>
                Share your favorite insights with the community.
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="author">Author</FieldLabel>
                  <Input
                    type="text"
                    id="author"
                    name="author"
                    placeholder="Enter the author's name"
                    required
                    aria-invalid={!!state.errors?.fieldErrors?.author}
                    aria-describedby={
                      !!state.errors?.fieldErrors?.author && "author-error"
                    }
                    value={state.data?.author}
                  />
                  {state.errors?.fieldErrors?.author && (
                    <FieldError
                      id="author-error"
                      errors="state.errors?.fieldErrors?.author"
                      aria-live="assertive"
                    >
                      {state.errors?.fieldErrors?.author}
                    </FieldError>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="quote">Quote</FieldLabel>
                  <Textarea
                    id="quote"
                    name="quote"
                    placeholder="Add your quote here..."
                    className="resize-none"
                    required
                    aria-describedby={
                      state.errors?.fieldErrors?.quote && "quote-error"
                    }
                    aria-invalid={!!state.errors?.fieldErrors?.quote}
                    value={state.data?.quote}
                  />
                  {state.errors?.fieldErrors?.quote && (
                    <FieldError
                      id="quote-error"
                      errors="state.errors?.fieldErrors?.quote"
                      aria-live="assertive"
                    >
                      {state.errors?.fieldErrors?.quote}
                    </FieldError>
                  )}
                </Field>
              </FieldGroup>
            </FieldSet>
            <Field
              orientation="horizontal"
              className="flex justify-end gap-3 pt-4"
            >
              <Button type="submit">Create</Button>
              <Button variant="outline" type="reset">
                Clear
              </Button>
            </Field>
          </FieldGroup>
        </form>
      )}

      {state.message && (
        <div
          className={`mt-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium shadow-sm transition-all animate-in fade-in slide-in-from-top-2 max-w-md w-full ${
            state.success
              ? "bg-primary/10 border-primary/20 text-primary"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}
        >
          {state.success ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
          )}
          <p className="leading-relaxed">{state.message}</p>
        </div>
      )}
    </main>
  );
}
