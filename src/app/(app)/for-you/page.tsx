"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IoMdTime } from "react-icons/io";
import { BsStarFill } from "react-icons/bs";
import { IoPlay } from "react-icons/io5";
import {
  fetchRecommendedBooks,
  fetchSelectedBook,
  fetchSuggestedBooks,
  type Book,
} from "@/lib/features/books/booksSlice";
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
  return (
    <div className="skeleton" style={{ width, height, marginBottom }} />
  );
}

function RecommendedBookSkeleton() {
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

function RecommendedBooksSkeletonRow() {
  return (
    <div className="recommended__books--skeleton-wrapper">
      {Array.from({ length: 6 }).map((_, i) => (
        <RecommendedBookSkeleton key={i} />
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
                <IoMdTime />
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

export default function ForYouPage() {
  const dispatch = useAppDispatch();
  const {
    selected,
    selectedLoading,
    selectedError,
    recommended,
    recommendedLoading,
    recommendedError,
    suggested,
    suggestedLoading,
    suggestedError,
  } = useAppSelector((state) => state.books);

  useEffect(() => {
    if (!selected && !selectedLoading) {
      dispatch(fetchSelectedBook());
    }
  }, [dispatch, selected, selectedLoading]);

  useEffect(() => {
    if (recommended.length === 0 && !recommendedLoading) {
      dispatch(fetchRecommendedBooks());
    }
  }, [dispatch, recommended.length, recommendedLoading]);

  useEffect(() => {
    if (suggested.length === 0 && !suggestedLoading) {
      dispatch(fetchSuggestedBooks());
    }
  }, [dispatch, suggested.length, suggestedLoading]);

  const showSelectedSkeleton =
    selectedLoading || (!selected && !selectedError);
  const showRecommendedSkeleton =
    recommendedLoading || (recommended.length === 0 && !recommendedError);
  const showSuggestedSkeleton =
    suggestedLoading || (suggested.length === 0 && !suggestedError);

  return (
    <div className="wrapper main__wrapper">
      <div className="row">
        <div className="container">
          <div className="for-you__wrapper">
            <div className="for-you__title">Selected just for you</div>
            {showSelectedSkeleton && (
              <div className="selected__book--skeleton" />
            )}
            {selectedError && (
              <div className="selected__book selected__book--error">
                {selectedError}
              </div>
            )}
            {selected && (
              <Link href={`/book/${selected.id}`} className="selected__book">
                <div className="selected__book--sub-title">
                  {selected.subTitle}
                </div>
                <div className="selected__book--line"></div>
                <div className="selected__book--content">
                  <BookCoverImage
                    src={selected.imageLink}
                    alt={selected.title}
                    maskClassName="selected__img--mask"
                    imgClassName="selected__img"
                    skeletonClassName="selected__book--img-skeleton"
                  />
                  <div className="selected__book--text">
                    <div className="selected__book--title">
                      {selected.title}
                    </div>
                    <div className="selected__book--author">
                      {selected.author}
                    </div>
                    <div className="selected__book--duration-wrapper">
                      <div className="selected__book--icon">
                        <IoPlay />
                      </div>
                      <BookDuration
                        audioLink={selected.audioLink}
                        className="selected__book--duration"
                        variant="long"
                        fallback="0 mins 0 secs"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            <div>
              <div className="for-you__title">Recommended For You</div>
              <div className="for-you__sub--title">
                We think you&apos;ll like these
              </div>
              {showRecommendedSkeleton && <RecommendedBooksSkeletonRow />}
              {recommendedError && <div>{recommendedError}</div>}
              {!showRecommendedSkeleton && recommended.length > 0 && (
                <BooksRow books={recommended} />
              )}
            </div>

            <div>
              <div className="for-you__title">Suggested Books</div>
              <div className="for-you__sub--title">Browse those books</div>
              {showSuggestedSkeleton && <RecommendedBooksSkeletonRow />}
              {suggestedError && <div>{suggestedError}</div>}
              {!showSuggestedSkeleton && suggested.length > 0 && (
                <BooksRow books={suggested} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
