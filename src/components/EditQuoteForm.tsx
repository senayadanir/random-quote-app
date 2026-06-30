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
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import editQuoteAction from "@/app/(protected)/user/quotes/edit/[id]/action";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TAddNewQuoteState, newQuoteSchema } from "@/types/quotes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import z from "zod";

interface EditQuoteFormProps {
  initialData: {
    _id: string;
    quote: string;
    author: string;
    category: string;
  };
}

const initialAddNewQuoteState: TAddNewQuoteState = {
  success: false,
};

export default function EditQuoteForm({ initialData }: EditQuoteFormProps) {
  const [resetCounter, setResetCounter] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const [state, dispatchAction, isPending] = useActionState<
    TAddNewQuoteState,
    FormData
  >(editQuoteAction, initialAddNewQuoteState);

  const {
    register,
    reset,
    trigger,
    formState: { errors: clientSideErrors },
  } = useForm<z.infer<typeof newQuoteSchema>>({
    mode: "onBlur",
    resolver: zodResolver(newQuoteSchema),
    defaultValues: {
      author: initialData.author,
      quote: initialData.quote,
      category: initialData.category as any,
    },
  });

  useEffect(() => {
    if (state.success) {
      router.push("/user/quotes/my");
      router.refresh();
    }
  }, [state.success, router]);

  const handleClientValidation = async (formData: FormData) => {
    const isValid = await trigger();
    if (!isValid) return;

    startTransition(() => {
      dispatchAction(formData);
    });
  };

  const categoryErrors = state.errors?.fieldErrors?.category;
  // State'de veri varsa state'dekini, yoksa veritabanından gelen ilk değeri (initialData) baz alıyoruz
  const currentCategory = state.data?.category || initialData.category;
  const currentAuthor = state.data?.author || initialData.author;
  const currentQuote = state.data?.quote || initialData.quote;

  const categoryFieldKey = [
    currentCategory,
    categoryErrors?.join("|") ?? "",
    state.message ?? "",
    resetCounter,
  ].join(":");

  if (isPending) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[250px] space-y-4"
        role="status"
      >
        <div className="relative flex items-center justify-center w-12 h-12">
          <div className="w-8 h-8 rounded-full border-4 border-t-primary border-r-primary border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        <span className="text-sm font-medium tracking-wide text-muted-foreground animate-pulse">
          Saving changes...
        </span>
      </div>
    );
  }

  const handleClearForm = () => {
    reset({
      author: initialData.author,
      quote: initialData.quote,
      category: initialData.category as any,
    });
    setResetCounter((prev) => prev + 1);
    if (state) {
      state.data = undefined;
      state.errors = undefined;
      state.message = undefined;
    }
  };

  return (
    <main className="min-h-[calc(100vh-130px)] flex flex-col justify-center items-center">
      {state.message && !state.success && (
        <div className="my-6 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium shadow-sm max-w-md w-full bg-destructive/10 border-destructive/20 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
          <p className="leading-relaxed">{state.message}</p>
        </div>
      )}

      <form
        ref={formRef}
        className="w-full max-w-md bg-background border rounded-2xl p-10 shadow-md"
        action={handleClientValidation}
      >
        {/* 🎯 Krtik Input: MongoDB ID'sini action'a gizlice taşır */}
        <input type="hidden" name="quoteId" value={initialData._id} />

        <FieldGroup>
          <FieldSet>
            <FieldLegend>Edit Quote</FieldLegend>
            <FieldDescription>
              Update your quote details. It will be re-reviewed by admins.
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
                  defaultValue={currentAuthor}
                  {...register("author")}
                />
                {clientSideErrors.author ? (
                  <FieldError errors={clientSideErrors.author.message}>
                    {clientSideErrors.author.message}
                  </FieldError>
                ) : state.errors?.fieldErrors?.author ? (
                  <FieldError errors={state.errors?.fieldErrors?.author}>
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
                  defaultValue={currentQuote}
                  {...register("quote")}
                />
                {clientSideErrors.quote ? (
                  <FieldError errors={clientSideErrors.quote.message}>
                    {clientSideErrors.quote.message}
                  </FieldError>
                ) : state.errors?.fieldErrors?.quote ? (
                  <FieldError errors={state.errors?.fieldErrors?.quote}>
                    {state.errors?.fieldErrors?.quote}
                  </FieldError>
                ) : null}
              </Field>

              <Field>
                <FieldLabel htmlFor="category">Category</FieldLabel>
                <Select
                  key={categoryFieldKey}
                  name="category"
                  defaultValue={currentCategory || undefined}
                  onValueChange={(value) => {
                    register("category").onChange({
                      target: { name: "category", value },
                    });
                  }}
                >
                  <SelectTrigger id="category">
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
                      <SelectItem value="philosophy-wisdom">
                        Philosophy & Wisdom
                      </SelectItem>
                      <SelectItem value="growth-patience">
                        Growth & Patience
                      </SelectItem>
                      <SelectItem value="courage-strength">
                        Courage & Strength
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {clientSideErrors.category ? (
                  <FieldError errors={clientSideErrors.category.message}>
                    {clientSideErrors.category.message}
                  </FieldError>
                ) : categoryErrors?.length ? (
                  <FieldError errors={categoryErrors}>
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
            <Button type="submit">Save Changes</Button>
            <Button variant="outline" type="button" onClick={handleClearForm}>
              Reset to Original
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </main>
  );
}
