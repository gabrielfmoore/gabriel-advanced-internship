"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiFillAudio } from "react-icons/ai";
import { BsStarFill } from "react-icons/bs";
import { getSavedBookIds } from "@/lib/supabase/library";
import { fetchAllBooks, type Book } from "@/lib/features/books/booksSlice";
import BookDuration from "@/components/BookDuration";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

function BookCoverImage({
  src,
  alt,
  maskClassName,
  imgClassName,
  skeletonClassName,
}: {
  src: string;
  alt: string;
  maskClassName: string;
  imgClassName: string;
  skeletonClassName: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setLoaded(false);
    if (imgRef.current?.complete) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <figure className={maskClassName}>
      {!loaded && (
        <div className={`skeleton ${skeletonClassName}`} aria-hidden="true" />
      )}
      <img
        ref={imgRef}
        className={imgClassName}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </figure>
  );
}

function Skeleton({
  width,
  height,
  marginBottom,
}: {
  width: string;
  height: string;
  marginBottom?: string;
}) {
  return <div className="skeleton" style={{ width, height, marginBottom }} />;
}

function SavedBookSkeleton() {
  return (
    <div className="recommended__books--skeleton">
      <Skeleton width="100%" height="240px" marginBottom="8px" />
      <Skeleton width="100%" height="20px" marginBottom="8px" />
      <Skeleton width="90%" height="16px" marginBottom="8px" />
      <Skeleton width="80%" height="32px" marginBottom="8px" />
      <Skeleton width="90%" height="16px" />
    </div>
  );
}

function SavedBooksSkeletonRow() {
  return (
    <div className="recommended__books--skeleton-wrapper">
      {Array.from({ length: 6 }).map((_, i) => (
        <SavedBookSkeleton key={i} />
      ))}
    </div>
  );
}

function BooksRow({ books }: { books: Book[] }) {
  return (
    <div className="for-you__recommended--books">
      {books.map((book) => (
        <Link
          key={book.id}
          href={`/book/${book.id}`}
          className="for-you__recommended--books-link"
        >
          {book.subscriptionRequired && (
            <div className="book__pill">Premium</div>
          )}
          <BookCoverImage
            src={book.imageLink}
            alt={book.title}
            maskClassName="recommended__book--img-mask"
            imgClassName="recommended__book--img"
            skeletonClassName="recommended__book--img-skeleton"
          />
          <div className="recommended__book--title">{book.title}</div>
          <div className="recommended__book--author">{book.author}</div>
          <div className="recommended__book--sub-title">{book.subTitle}</div>
          <div className="recommended__book--details-wrapper">
            <div className="recommended__book--details">
              <div className="recommended__book--details-icon">
                <AiFillAudio />
              </div>
              <BookDuration
                audioLink={book.audioLink}
                className="recommended__book--details-text"
              />
            </div>
            <div className="recommended__book--details">
              <div className="recommended__book--details-icon">
                <BsStarFill />
              </div>
              <div className="recommended__book--details-text">
                {book.averageRating}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function Library() {
  const dispatch = useAppDispatch();
  const { user, isLoading: authLoading } = useAppSelector(
    (state) => state.auth,
  );
  const { allBooks, allBooksLoading } = useAppSelector((state) => state.books);

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [libraryError, setLibraryError] = useState<string | null>(null);

  useEffect(() => {
    if (allBooks.length === 0 && !allBooksLoading) {
      dispatch(fetchAllBooks());
    }
  }, [dispatch, allBooks.length, allBooksLoading]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setSavedIds([]);
      setLibraryLoading(false);
      return;
    }

    setLibraryLoading(true);
    setLibraryError(null);

    getSavedBookIds(user.id).then(({ data, error }) => {
      if (error) setLibraryError(error.message);
      else setSavedIds(data ?? []);
      setLibraryLoading(false);
    });
  }, [user, authLoading]);

  const savedBooks = savedIds
    .map((id) => allBooks.find((book) => book.id === id))
    .filter((book): book is Book => !!book);

  const showSavedSkeleton =
    authLoading ||
    libraryLoading ||
    allBooksLoading ||
    (user !== null && savedIds.length > 0 && savedBooks.length === 0);

  const showFinishedSkeleton =
    authLoading || libraryLoading || allBooksLoading;

  return (
    <div className="wrapper main__wrapper">
      <div className="row">
        <div className="container">
          <div className="for-you__title">Saved Books</div>

          {!authLoading && !user && (
            <div className="settings__login--wrapper">
              <img src="/login.png" alt="login" />
              <div className="settings__login--text">
                Log in to your account to see your library.
              </div>
              <Link href="/" className="btn settings__login--btn">
                Login
              </Link>
            </div>
          )}

          {user && (
            <>
              {!showSavedSkeleton && (
                <div className="for-you__sub--title">
                  {savedBooks.length} item{savedBooks.length === 1 ? "" : "s"}
                </div>
              )}
              {showSavedSkeleton && <SavedBooksSkeletonRow />}
              {libraryError && <div>{libraryError}</div>}
              {!showSavedSkeleton && savedBooks.length > 0 && (
                <BooksRow books={savedBooks} />
              )}
              {!showSavedSkeleton &&
                savedBooks.length === 0 &&
                !libraryError && (
                  <div className="finished__books--block-wrapper">
                    <div className="finished__books--title">
                      Save your favorite books!
                    </div>
                    <div className="finished__books--sub-title">
                      When you save a book, it will appear here.
                    </div>
                  </div>
                )}

              <div className="for-you__title">Finished</div>
              {showFinishedSkeleton ? (
                <>
                  <div className="for-you__sub--title">
                    <Skeleton width="100px" height="20px" marginBottom="24px" />
                  </div>
                  <SavedBooksSkeletonRow />
                </>
              ) : (
                <>
                  <div className="for-you__sub--title">0 items</div>
                  <div className="finished__books--block-wrapper">
                    <div className="finished__books--title">Done and dusted!</div>
                    <div className="finished__books--sub-title">
                      When you finish a book, you can find it here later.
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
