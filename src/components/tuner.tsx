"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Gauge } from 'lucide-react';

export function Tuner() {
  const [pitchOffset, setPitchOffset] = useState(0);
  const [note, setNote] = useState('E');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // In a real app, you would use Web Audio API here to get mic input and analyze pitch.
    // For this demo, we'll simulate a fluctuating pitch.
    const interval = setInterval(() => {
      setPitchOffset(Math.random() * 60 - 30);
      const notes = ['E', 'A', 'D', 'G', 'B', 'E'];
      setNote(notes[Math.floor(Math.random() * notes.length)]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  const needleRotation = (pitchOffset / 50) * 45; // Max 45 degrees
  const isInTune = Math.abs(pitchOffset) < 5;

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
    >
        <Card className="w-full max-w-sm mx-auto text-center bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
                    <Gauge className="text-primary"/> Precision Tuner
                </CardTitle>
                <CardDescription>Tune your instrument. Standard EADGBe.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-8 pb-8">
                <div className="relative w-64 h-32">
                    <div className="absolute bottom-0 left-1/2 w-[2px] h-32 bg-border origin-bottom" style={{transform: 'translateX(-50%) rotate(-45deg)'}}></div>
                    <div className="absolute bottom-0 left-1/2 w-[2px] h-32 bg-border origin-bottom" style={{transform: 'translateX(-50%) rotate(45deg)'}}></div>
                    <div className="absolute bottom-0 left-1/2 w-[2px] h-32 bg-primary origin-bottom" style={{transform: 'translateX(-50%)'}}></div>
                    
                    {/* Needle */}
                    <motion.div 
                        className="absolute bottom-0 left-1/2 w-1 h-28 bg-foreground origin-bottom rounded-t-full"
                        animate={{ rotate: needleRotation }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        style={{transform: 'translateX(-50%)'}}
                    />
                    <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-foreground rounded-full transform -translate-x-1/2 translate-y-1/2 border-4 border-background" />
                </div>
                
                <div className="flex flex-col items-center">
                    <p className="text-sm text-muted-foreground">
                        {pitchOffset < -5 ? 'Too flat' : pitchOffset > 5 ? 'Too sharp' : 'In Tune'}
                    </p>
                    <motion.p 
                        key={note}
                        className={cn(
                            "text-8xl font-bold font-mono transition-colors",
                            isInTune ? 'text-primary' : 'text-foreground'
                        )}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {note}
                    </motion.p>
                </div>
            </CardContent>
        </Card>
    </motion.div>
  );
}
