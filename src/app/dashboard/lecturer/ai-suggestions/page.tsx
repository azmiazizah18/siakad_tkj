import { PageHeader } from "@/components/page-header";
import { AiSuggestionForm } from "@/components/ai-suggestion-form";

export default function AiSuggestionsPage() {
  return (
    <div className="container mx-auto py-4">
      <PageHeader
        title="AI Study Suggestion"
        description="Leverage AI to make your study materials more relevant and up-to-date."
      />
      <div className="max-w-4xl mx-auto">
        <AiSuggestionForm />
      </div>
    </div>
  );
}
