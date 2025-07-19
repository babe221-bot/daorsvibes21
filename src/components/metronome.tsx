"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Plus, Minus, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

export function Metronome() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [timeSignature, setTimeSignature] = useState("4/4");
  const [beat, setBeat] = useState(0);

  const beatsPerMeasure = parseInt(timeSignature.split("/")[0], 10);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setBeat(0);
  }, []);

  const start = useCallback(() => {
    stop();
    const interval = (60 / bpm) * 1000;
    timerRef.current = setInterval(() => {
      setBeat(prev => (prev + 1) % beatsPerMeasure);
    }, interval);
  }, [bpm, beatsPerMeasure, stop]);

  useEffect(() => {
    if (isPlaying) {
      start();
    } else {
      stop();
    }
    return stop;
  }, [isPlaying, bpm, timeSignature, start, stop]);
  
  const handleBpmChange = (value: number[]) => {
    const newBpm = value[0];
    if (newBpm >= 40 && newBpm <= 240) {
      setBpm(newBpm);
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
    >
      <Card className="w-full max-w-md mx-auto text-center bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
            <Timer className="text-primary"/> Metronome
          </CardTitle>
          <CardDescription>Practice your timing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="relative">
            <p className="text-7xl font-bold font-mono text-primary select-none">{bpm}</p>
            <p className="text-muted-foreground">BPM</p>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            {Array.from({ length: beatsPerMeasure }).map((_, i) => (
                <motion.div
                    key={i}
                    className={cn("h-4 w-4 rounded-full bg-muted-foreground transition-colors", isPlaying && beat === i && "bg-primary")}
                    animate={ isPlaying && beat === i ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                    transition={{ duration: 0.15, ease: 'easeInOut' }}
                />
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleBpmChange([bpm - 1])}><Minus /></Button>
                <Slider value={[bpm]} onValueChange={handleBpmChange} min={40} max={240} step={1} />
                <Button variant="outline" size="icon" onClick={() => handleBpmChange([bpm + 1])}><Plus /></Button>
            </div>
            
            <div className="flex justify-between items-center gap-4">
                <Button onClick={() => setIsPlaying(!isPlaying)} className="w-full">
                    {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                    {isPlaying ? "Stop" : "Start"}
                </Button>
                <Select value={timeSignature} onValueChange={setTimeSignature}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Time Sig" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2/4">2/4</SelectItem>
                        <SelectItem value="3/4">3/4</SelectItem>
                        <SelectItem value="4/4">4/4</SelectItem>
                        <SelectItem value="6/8">6/8</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
