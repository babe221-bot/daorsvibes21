'use server';

/**
 * @fileOverview A chord search AI agent.
 *
 * - chordSearch - A function that handles the chord search process.
 * - ChordSearchInput - The input type for the chordSearch function.
 * - ChordSearchOutput - The return type for the chordSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChordSearchInputSchema = z.object({
  songTitle: z.string().describe('The title of the song to find chords for.'),
  artistName: z.string().optional().describe('The name of the artist of the song.'),
});
export type ChordSearchInput = z.infer<typeof ChordSearchInputSchema>;

const ChordSearchOutputSchema = z.object({
  chordUrl: z.string().describe('The URL of the chord sheet for the song.'),
});
export type ChordSearchOutput = z.infer<typeof ChordSearchOutputSchema>;

export async function chordSearch(input: ChordSearchInput): Promise<ChordSearchOutput> {
  return chordSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chordSearchPrompt',
  input: {schema: ChordSearchInputSchema},
  output: {schema: ChordSearchOutputSchema},
  prompt: `You are a helpful assistant that helps musicians find chords for songs.

You will be given a song title and artist name (if available), and you will find the URL of the chord sheet for the song.

Song Title: {{{songTitle}}}
Artist Name: {{{artistName}}}

Return only the URL of the chord sheet. Do not include any other text.`,
});

const chordSearchFlow = ai.defineFlow(
  {
    name: 'chordSearchFlow',
    inputSchema: ChordSearchInputSchema,
    outputSchema: ChordSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {chordUrl: output!};
  }
);
