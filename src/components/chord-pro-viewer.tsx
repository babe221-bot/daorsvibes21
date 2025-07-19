"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Play, Pause, FastForward } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ChordProViewerProps {
  content: string;
}

const ChordProViewer = ({ content }: ChordProViewerProps) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();

  const parsedContent = useMemo(() => {
    let title = "Untitled";
    let artist = "Unknown Artist";

    const titleMatch = content.match(/\{title:\s*(.*)\}/);
    if (titleMatch) title = titleMatch[1];
    const artistMatch = content.match(/\{artist:\s*(.*)\}/);
    if (artistMatch) artist = artistMatch[1];

    const lines = content
      .split("\n")
      .filter(line => !line.startsWith("{")) // Filter out metadata lines
      .map((line, index) => {
        if (line.trim() === "") return <br key={index} />;

        const parts = line.split(/(\[.*?\])/g).filter(Boolean);
        return (
          <p key={index} className="relative mb-4 leading-loose">
            {parts.map((part, partIndex) => {
              const chordMatch = part.match(/\[(.*?)\]/);
              if (chordMatch) {
                return (
                  <span key={partIndex} className="relative inline-block w-0">
                    <span className="absolute bottom-full left-0 font-bold text-primary">
                      {chordMatch[1]}
                    </span>
                  </span>
                );
              }
              return <span key={partIndex}>{part}</span>;
            })}
          </p>
        );
      });

    return { title, artist, lyrics: lines };
  }, [content]);

  useEffect(() => {
    const scroll = () => {
      if (containerRef.current && viewportRef.current) {
        const container = viewportRef.current.children[0] as HTMLDivElement;
        if(container){
            container.scrollTop += scrollSpeed / 10;
        }
      }
      animationFrameId.current = requestAnimationFrame(scroll);
    };

    if (isScrolling) {
      animationFrameId.current = requestAnimationFrame(scroll);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isScrolling, scrollSpeed]);

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
    >
        <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">{parsedContent.title}</CardTitle>
                <p className="text-muted-foreground">{parsedContent.artist}</p>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
                <ScrollArea ref={viewportRef} className="h-[40vh] w-full">
                <div ref={containerRef} className="p-6 font-code text-base whitespace-pre-wrap">
                    {parsedContent.lyrics}
                </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
                <Button onClick={() => setIsScrolling(!isScrolling)} variant="outline" className="w-full sm:w-auto">
                {isScrolling ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                {isScrolling ? "Pause" : "Auto-Scroll"}
                </Button>
                <div className="flex items-center gap-4 w-full sm:w-1/2">
                <FastForward className="text-muted-foreground" />
                <Slider
                    value={[scrollSpeed]}
                    onValueChange={(value) => setScrollSpeed(value[0])}
                    min={0.5}
                    max={10}
                    step={0.5}
                    disabled={isScrolling}
                />
                </div>
            </CardFooter>
        </Card>
    </motion.div>
  );
};

export default ChordProViewer;
