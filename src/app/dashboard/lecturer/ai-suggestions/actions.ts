"use server";

import { getStudyMaterialSuggestions } from "@/ai/flows/study-material-suggestions";
import { z } from "zod";

const schema = z.object({
  studyMaterial: z.string().min(10, { message: "Study material must be at least 10 characters." }),
});

type State = {
  suggestions?: string;
  error?: string;
}

export async function getSuggestionsAction(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = schema.safeParse({
    studyMaterial: formData.get("studyMaterial"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.studyMaterial?.[0],
    };
  }

  try {
    const result = await getStudyMaterialSuggestions({
      studyMaterial: validatedFields.data.studyMaterial,
    });
    return { suggestions: result.suggestions };
  } catch (e) {
    return { error: "Failed to get suggestions. Please try again." };
  }
}
