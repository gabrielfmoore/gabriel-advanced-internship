"use client";

import { useEffect, useState } from "react";
import { formatDurationLong, formatTime } from "@/lib/formatTime";

type BookDurationProps = {
  audioLink: string;
  className?: string;
  variant?: "short" | "long";
  fallback?: string;
};

export default function BookDuration({
  audioLink,
  className,
  variant = "short",
  fallback = "--:--",
}: BookDurationProps) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setDuration(0);
  }, [audioLink]);

  const handleMetadata = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const value = e.currentTarget.duration;
    if (Number.isFinite(value) && value > 0) {
      setDuration(value);
    }
  };

  const label =
    duration > 0
      ? variant === "long"
        ? formatDurationLong(duration)
        : formatTime(duration)
      : fallback;

  return (
    <>
      <audio
        hidden
        preload="metadata"
        src={audioLink}
        onLoadedMetadata={handleMetadata}
        onDurationChange={handleMetadata}
      />
      <span className={className}>{label}</span>
    </>
  );
}
