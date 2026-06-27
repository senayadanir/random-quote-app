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
import addNewQuote from "@/app/user/quotes/new/action";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { redirect, RedirectType } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TAddNewQuoteState,
  NewQuoteInput,
  newQuoteSchema,
} from "@/types/quotes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import z from "zod";

const initialAddNewQuoteState: TAddNewQuoteState = {
  success: false,
};

export default function CreateQuotePage() {
  const [state, dispatchAction, isPending] = useActionState<
    TAddNewQuoteState,
    FormData
  >(addNewQuote, initialAddNewQuoteState);

  const {
    register,
    formState: { errors: clientSideErrors },
  } = useForm<z.infer<typeof newQuoteSchema>>({
    mode: "onBlur",
    resolver: zodResolver(newQuoteSchema),
  });

  const categoryErrors = state.errors?.fieldErrors?.category;
  const categoryFieldKey = [
    state.data?.category ?? "",
    categoryErrors?.join("|") ?? "",
    state.message ?? "",
  ].join(":");

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
          className="w-full max-w-md bg-background border rounded-2xl mt-6 p-10 shadow-md"
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
                    defaultValue={state.data?.author || ""}
                    {...register(
                      "author",
                      //   {
                      //   required: "Author name is required",
                      //   minLength: {
                      //     value: 2,
                      //     message:
                      //       "Author name should be at least 2 characters long.",
                      //   },
                      //   maxLength: {
                      //     value: 50,
                      //     message:
                      //       "Author name should be less than 50 characters long. Please try a shorter name.",
                      //   },
                      // } //Form validation without zod
                    )}
                  />
                  {clientSideErrors.author ? (
                    <FieldError
                      id="client-author-error"
                      errors={clientSideErrors.author.message}
                      aria-live="polite"
                    >
                      {clientSideErrors.author.message}
                    </FieldError>
                  ) : state.errors?.fieldErrors?.author ? (
                    <FieldError
                      id="server-author-error"
                      errors={state.errors?.fieldErrors?.author}
                      aria-live="polite"
                    >
                      {state.errors?.fieldErrors?.author}
                    </FieldError>
                  ) : null}
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
                    {...register("quote")}
                    defaultValue={state.data?.quote || ""}
                  />
                  {clientSideErrors.quote ? (
                    <FieldError
                      id="client-quote-error"
                      errors={clientSideErrors.quote.message}
                      aria-live="polite"
                    >
                      {clientSideErrors.quote.message}
                    </FieldError>
                  ) : state.errors?.fieldErrors?.quote ? (
                    <FieldError
                      id="server-quote-error"
                      errors={state.errors?.fieldErrors?.quote}
                      aria-live="polite"
                    >
                      {state.errors?.fieldErrors?.quote}
                    </FieldError>
                  ) : null}
                </Field>
                <Field>
                  <FieldLabel htmlFor="category">Category</FieldLabel>
                  <Select
                    key={categoryFieldKey}
                    name="category"
                    defaultValue={state.data?.category || undefined}
                  >
                    <SelectTrigger
                      id="category"
                      aria-invalid={
                        !!categoryErrors?.length || !!clientSideErrors.category
                      }
                      aria-describedby={
                        clientSideErrors.category
                          ? "client-category-error"
                          : categoryErrors?.length
                            ? "server-category-error"
                            : undefined
                      }
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="action-success">
                          Action & Success
                        </SelectItem>
                        <SelectItem value="resilience-failure">
                          Resilience & Failure
                        </SelectItem>
                        <SelectItem value="mindset-belief">
                          Mindset & Belief
                        </SelectItem>
                        <SelectItem value="life-happiness">
                          Life & Happiness
                        </SelectItem>
                        <SelectItem value="identity-kindness">
                          Identity & Kindness
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {clientSideErrors.category ? (
                    <FieldError
                      id="client-category-error"
                      errors={clientSideErrors.category.message}
                      aria-live="polite"
                    >
                      {clientSideErrors.category.message}
                    </FieldError>
                  ) : categoryErrors?.length ? (
                    <FieldError
                      id="server-category-error"
                      errors={categoryErrors}
                      aria-live="polite"
                    >
                      {categoryErrors[0]}
                    </FieldError>
                  ) : null}
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
          className={`my-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium shadow-sm transition-all animate-in fade-in slide-in-from-top-2 max-w-md w-full ${
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
