"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Volume2, VolumeX, Loader2, Radio } from "lucide-react";
import { Slider } from "./ui/slider";

const stations = [
  { name: "Lofi Girl", url: "https://play.streamafrica.net/lofiradio" },
  { name: "Jazz Radio", url: "https://www.jazzradio.fr/radio/webradio/jazz-radio" },
  { name: "Classical FM", url: "https://media-ssl.musicradio.com/ClassicFM" },
  { name: "Rock Antenne", url: "https://mp3.rockantenne.de/rockantenne/stream/mp3" },
];

export function RadioPlayer() {
  const [currentStation, setCurrentStation] = useState(stations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    const handlePlaying = () => setIsLoading(false);
    const handleWaiting = () => setIsLoading(true);
    const handleError = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    if (audio) {
      audio.addEventListener('playing', handlePlaying);
      audio.addEventListener('waiting', handleWaiting);
      audio.addEventListener('error', handleError);
    }
    
    return () => {
      if (audio) {
        audio.removeEventListener('playing', handlePlaying);
        audio.removeEventListener('waiting', handleWaiting);
        audio.removeEventListener('error', handleError);
      }
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      audioRef.current?.load();
      audioRef.current?.play().catch(() => {
        // Autoplay was prevented
        setIsLoading(false);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handleStationChange = (url: string) => {
    const newStation = stations.find(s => s.url === url);
    if (newStation) {
      setCurrentStation(newStation);
      if (isPlaying) {
        setIsLoading(true);
        // Let useEffect handle play
      }
    }
  };
  
  useEffect(() => {
    if (isPlaying && audioRef.current) {
        audioRef.current.src = currentStation.url;
        audioRef.current.load();
        audioRef.current.play().catch(() => {
            setIsLoading(false);
            setIsPlaying(false);
        });
    } else if (audioRef.current) {
        audioRef.current.src = currentStation.url;
    }
  }, [currentStation, isPlaying]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
            <Radio className="text-primary" /> Internet Radio
          </CardTitle>
          <CardDescription>Tune in to your favorite streams.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <audio ref={audioRef} src={currentStation.url} preload="none" />
          <Select value={currentStation.url} onValueChange={handleStationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a station" />
            </SelectTrigger>
            <SelectContent>
              {stations.map(station => (
                <SelectItem key={station.name} value={station.url}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center justify-center">
            <Button onClick={togglePlay} size="lg" className="rounded-full h-16 w-16">
              {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setVolume(v => v > 0 ? 0 : 0.5)}>
              {volume > 0 ? <Volume2 className="text-muted-foreground hover:text-foreground" /> : <VolumeX className="text-muted-foreground hover:text-foreground" />}
            </button>
            <Slider value={[volume]} onValueChange={(v) => setVolume(v[0])} max={1} step={0.05} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
