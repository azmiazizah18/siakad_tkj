"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { getSuggestionsAction } from "@/app/dashboard/lecturer/ai-suggestions/actions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Loader2, Sparkles } from "lucide-react";

const initialState = {
  suggestions: undefined,
  error: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Get Suggestions
        </>
      )}
    </Button>
  );
}

export function AiSuggestionForm() {
  const [state, formAction] = useActionState(getSuggestionsAction, initialState);

  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
                <BrainCircuit className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle>AI-Powered Study Material Assistant</CardTitle>
                <CardDescription>
                Enhance your course content with insights from current affairs.
                </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-2">
            <Textarea
              name="studyMaterial"
              placeholder="Paste your study material here..."
              rows={10}
              required
            />
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
      {state?.suggestions && (
        <CardContent className="mt-4 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent-foreground" />
            Here are some suggestions:
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted rounded-md whitespace-pre-wrap font-sans">
            {state.suggestions}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
