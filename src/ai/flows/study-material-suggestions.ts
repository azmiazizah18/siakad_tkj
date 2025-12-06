'use server';

/**
 * @fileOverview This file implements the AI tool for suggesting improvements in study material creation based on current affairs.
 *
 * - `getStudyMaterialSuggestions` - A function that takes in the existing study material and returns suggestions for improvement based on current affairs.
 * - `StudyMaterialSuggestionsInput` - The input type for the `getStudyMaterialSuggestions` function.
 * - `StudyMaterialSuggestionsOutput` - The return type for the `getStudyMaterialSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyMaterialSuggestionsInputSchema = z.object({
  studyMaterial: z
    .string()
    .describe('The existing study material to be improved.'),
});
export type StudyMaterialSuggestionsInput = z.infer<
  typeof StudyMaterialSuggestionsInputSchema
>;

const StudyMaterialSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'Suggestions for improving the study material based on current affairs.'
    ),
});
export type StudyMaterialSuggestionsOutput = z.infer<
  typeof StudyMaterialSuggestionsOutputSchema
>;

export async function getStudyMaterialSuggestions(
  input: StudyMaterialSuggestionsInput
): Promise<StudyMaterialSuggestionsOutput> {
  return studyMaterialSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studyMaterialSuggestionsPrompt',
  input: {schema: StudyMaterialSuggestionsInputSchema},
  output: {schema: StudyMaterialSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to help improve study material based on current affairs.

  Given the following study material, suggest improvements based on recent current affairs to make the material more relevant and up-to-date.

  Study Material:
  {{studyMaterial}}

  Improvements:`,
});

const studyMaterialSuggestionsFlow = ai.defineFlow(
  {
    name: 'studyMaterialSuggestionsFlow',
    inputSchema: StudyMaterialSuggestionsInputSchema,
    outputSchema: StudyMaterialSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
