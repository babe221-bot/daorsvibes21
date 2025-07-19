import { Header } from "@/components/header";
import { Tuner } from "@/components/tuner";
import { Metronome } from "@/components/metronome";
import { RadioPlayer } from "@/components/radio-player";
import { ChordSearch } from "@/components/chord-search";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Gauge,
  Timer,
  Radio,
  Music,
  BookOpen,
} from "lucide-react";
import ChordProViewer from "@/components/chord-pro-viewer";

const sampleChordPro = `{title: Wonderwall}
{artist: Oasis}

[Intro]
[Em7] [G] [Dsus4] [A7sus4] (x4)

[Verse 1]
[Em7]Today is gonna be the day that they're gonna throw it back to [G]you
[Dsus4]By now you should've somehow realised what you gotta [A7sus4]do
I don't believe that [Em7]anybody feels the way I [G]do
About you [Dsus4]now [A7sus4]

[Verse 2]
[Em7]Backbeat, the word is on the street that the fire in your heart is [G]out
[Dsus4]I'm sure you've heard it all before but you never really had a [A7sus4]doubt
I don't believe that [Em7]anybody feels the way I [G]do
About you [Dsus4]now [A7sus4]

[Pre-Chorus]
And [C]all the roads we have to walk are [Dsus4]winding
And [C]all the lights that lead us there are [Dsus4]blinding
[C]There are many things that I would [Dsus4]like to say to you
But I don't know [G]how [A7sus4]

[Chorus]
Because [C]maybe, [Em7]you're gonna be the one that [G]saves me
And [C]after [Em7]all, you're my [G]wonder[C]wall[Em7] [G] [Dsus4] [A7sus4]`;

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <Tabs defaultValue="tuner" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-4">
            <TabsTrigger value="tuner"><Gauge className="mr-2" />Tuner</TabsTrigger>
            <TabsTrigger value="metronome"><Timer className="mr-2" />Metronome</TabsTrigger>
            <TabsTrigger value="radio"><Radio className="mr-2" />Radio</TabsTrigger>
            <TabsTrigger value="chord-search"><Music className="mr-2" />Chord Search</TabsTrigger>
            <TabsTrigger value="viewer"><BookOpen className="mr-2" />Songbook</TabsTrigger>
          </TabsList>
          
          <Card className="border-0 shadow-lg bg-card/50">
            <CardContent className="p-2 md:p-6 min-h-[60vh] flex items-center justify-center">
              <TabsContent value="tuner" className="w-full">
                <Tuner />
              </TabsContent>
              <TabsContent value="metronome" className="w-full">
                <Metronome />
              </TabsContent>
              <TabsContent value="radio" className="w-full">
                <RadioPlayer />
              </TabsContent>
              <TabsContent value="chord-search" className="w-full">
                <ChordSearch />
              </TabsContent>
               <TabsContent value="viewer" className="w-full">
                <ChordProViewer content={sampleChordPro} />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </main>
    </div>
  );
}
