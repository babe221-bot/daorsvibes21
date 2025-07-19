"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { chordSearch, type ChordSearchInput } from "@/ai/flows/chord-search";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Link as LinkIcon, AlertTriangle } from "lucide-react";

const formSchema = z.object({
  songTitle: z.string().min(2, "Song title must be at least 2 characters."),
  artistName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ChordSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      songTitle: "",
      artistName: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const searchResult = await chordSearch(data as ChordSearchInput);
      if (searchResult?.chordUrl) {
        setResult(searchResult.chordUrl);
      } else {
        throw new Error("Could not find chords for this song.");
      }
    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
    >
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Search className="text-primary"/>
            Find Song Chords
          </CardTitle>
          <CardDescription>Use AI to find a chord sheet for any song.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="songTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Song Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Wonderwall" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="artistName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Oasis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <AnimatePresence>
            {(result || error) && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <CardFooter className="flex flex-col pt-6">
                        {result && (
                            <Card className="w-full bg-green-500/10 border-green-500/50">
                                <CardHeader>
                                    <CardTitle className="text-lg text-green-300">Result Found</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <a href={result} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline break-all">
                                        <LinkIcon className="h-4 w-4 flex-shrink-0" />
                                        <span>{result}</span>
                                    </a>
                                </CardContent>
                            </Card>
                        )}
                        {error && (
                            <Card className="w-full bg-red-500/10 border-red-500/50">
                                 <CardHeader>
                                    <CardTitle className="text-lg text-red-400 flex items-center gap-2"><AlertTriangle/> Error</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-red-400/80">{error}</p>
                                </CardContent>
                            </Card>
                        )}
                    </CardFooter>
                </motion.div>
            )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
