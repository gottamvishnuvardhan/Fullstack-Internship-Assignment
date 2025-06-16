// src/ai/flows/query-document.ts
'use server';
/**
 * @fileOverview A document querying AI agent.
 *
 * - queryDocument - A function that handles the document querying process.
 * - QueryDocumentInput - The input type for the queryDocument function.
 * - QueryDocumentOutput - The return type for the queryDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QueryDocumentInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question to ask about the document.'),
});
export type QueryDocumentInput = z.infer<typeof QueryDocumentInputSchema>;

const QueryDocumentOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type QueryDocumentOutput = z.infer<typeof QueryDocumentOutputSchema>;

export async function queryDocument(input: QueryDocumentInput): Promise<QueryDocumentOutput> {
  return queryDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'queryDocumentPrompt',
  input: {schema: QueryDocumentInputSchema},
  output: {schema: QueryDocumentOutputSchema},
  prompt: `You are an expert at answering questions about PDF documents.

  You will be given a PDF document and a question.
  You will answer the question based on the content of the PDF document.

  PDF Document: {{media url=pdfDataUri}}
  Question: {{{question}}}
  `, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  }
});

const queryDocumentFlow = ai.defineFlow(
  {
    name: 'queryDocumentFlow',
    inputSchema: QueryDocumentInputSchema,
    outputSchema: QueryDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
