"use client";

import { useParams } from "next/navigation";
import { useBook } from "@/lib/useBook";
import { ImSpinner2 } from "react-icons/im";

export default function PlayerPage() {
  const { id } = useParams<{ id: string }>();
  const { book, isLoading, error } = useBook(id);

  if ((!book && !error) || isLoading) return (
    <div className="wrapper">
      <div className="player-page__spinner--wrapper">
        <ImSpinner2 className="spinner" />
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="wrapper">
        <p className="player-page__status">{error}</p>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="player-page">
        <h1 className="player-page__title">{book?.title}</h1>
        <div className="player-page__summary">{book?.summary}</div>
      </div>
    </div>
  );
}
