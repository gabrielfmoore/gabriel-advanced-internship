import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchRecommendedBooks,
  fetchSelectedBook,
  fetchSuggestedBooks,
  type Book,
} from "@/lib/features/books/booksSlice";

export function useBook(id: string | undefined): {
  book: Book | undefined;
  isLoading: boolean;
  error: string | null;
} {
  const dispatch = useAppDispatch();
  const {
    selected,
    recommended,
    suggested,
    recommendedLoading,
    suggestedLoading,
    selectedLoading,
    recommendedError,
    suggestedError,
    selectedError,
  } = useAppSelector((state) => state.books);

  const book = id
    ? [...recommended, ...suggested, ...(selected ? [selected] : [])].find(
        (b) => b.id === id,
      )
    : undefined;

  useEffect(() => {
    if (!id || book) return;

    if (recommended.length === 0 && !recommendedLoading) {
      dispatch(fetchRecommendedBooks());
    }
    if (suggested.length === 0 && !suggestedLoading) {
      dispatch(fetchSuggestedBooks());
    }
    if (!selected && !selectedLoading) {
      dispatch(fetchSelectedBook());
    }
  }, [
    dispatch,
    id,
    book,
    recommended.length,
    suggested.length,
    selected,
    recommendedLoading,
    suggestedLoading,
    selectedLoading,
  ]);

  const isLoading =
    !book &&
    (recommendedLoading || suggestedLoading || selectedLoading);

  const error = recommendedError ?? suggestedError ?? selectedError;

  return {
    book,
    isLoading,
    error,
  };
}
