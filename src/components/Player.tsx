"use client";

import { useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useBook } from "@/lib/useBook";
import type { Book } from "@/lib/features/books/booksSlice";
import { formatTime } from "@/lib/formatTime";
import { IoPlaySharp, IoPause } from "react-icons/io5";
import { GrBackTen, GrForwardTen } from "react-icons/gr";

type PlayerProps = {
  book?: Book;
};

const PROGRESS_PLAYED = "rgb(43, 217, 124)";
const PROGRESS_REMAINING = "rgb(109, 120, 125)";

function progressGradient(percent: number): string {
  return `linear-gradient(to right, ${PROGRESS_PLAYED} ${percent}%, ${PROGRESS_REMAINING} ${percent}%)`;
}

export default function Player({ book: bookProp }: PlayerProps) {
  const pathname = usePathname();
  const { id } = useParams<{ id?: string }>();
  const { book: bookFromRoute } = useBook(id);
  const book = bookProp ?? bookFromRoute;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!pathname.startsWith("/player") || !book) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (value: number) => {
    setCurrentTime(value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play();
    } else {
      audio.pause();
    }
  };

  const skipSeconds = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const max = Number.isFinite(audio.duration) ? audio.duration : duration;
    handleSeek(Math.min(max, Math.max(0, audio.currentTime + seconds)));
  };

  return (
    <div className="player">
      <audio
        ref={audioRef}
        className="player__audio"
        src={book.audioLink}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="player__element player__track--wrapper">
        <figure className="player__track--image-mask">
          <figure className="book__image--wrapper">
            <img
              className="book__image"
              src={book.imageLink}
              alt={book.title}
            />
          </figure>
        </figure>
        <div className="player__track--details-wrapper">
          <div className="player__track--title">{book.title}</div>
          <div className="player__track--author">{book.author}</div>
        </div>
      </div>
      <div className="player__element player__controls--wrapper">
        <div className="player__controls">
          <button
            type="button"
            className="player__controls--btn"
            aria-label="Rewind 10 seconds"
            onClick={() => skipSeconds(-10)}
          >
            <GrBackTen stroke="#fff" strokeWidth={0} size={28} />
          </button>

          <button
            type="button"
            className="player__controls--btn player__controls--btn-play"
            aria-label="Play"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <IoPause size={28} />
            ) : (
              <IoPlaySharp className="player__controls--play-icon" size={28} />
            )}
          </button>
          <button
            type="button"
            className="player__controls--btn"
            aria-label="Forward 10 seconds"
            onClick={() => skipSeconds(10)}
          >
            <GrForwardTen stroke="#fff" strokeWidth={0} size={28} />
          </button>
        </div>
      </div>
      <div className="player__element player__progress--wrapper">
        <div className="player__time">{formatTime(currentTime)}</div>
        <input
          className="player__progress--bar"
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          step="any"
          onChange={(e) => handleSeek(Number(e.target.value))}
          onInput={(e) => handleSeek(Number(e.currentTarget.value))}
          style={{
            background: `${progressGradient(progressPercent)} center / 100% 4px no-repeat`,
            ["--range-progress" as string]: `${progressPercent}%`,
          }}
        />
        <div className="player__time">{formatTime(duration)}</div>
      </div>
    </div>
  );
}
