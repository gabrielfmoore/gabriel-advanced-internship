"use client";

import { BsStar } from "react-icons/bs";
import { RxBookmark, RxBookmarkFilled } from "react-icons/rx";
import { IoMdTime } from "react-icons/io";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBook } from "@/lib/useBook";
import { PiBookOpenText } from "react-icons/pi";
import { TiMicrophoneOutline } from "react-icons/ti";
import { TbBulb } from "react-icons/tb";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import BookDuration from "@/components/BookDuration";
import AuthModal from "@/components/AuthModal";
import {
  addBookToLibrary,
  isBookSaved,
  removeBookFromLibrary,
} from "@/lib/supabase/library";

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

function BookPageSkeleton() {
  return (
    <div className="inner__book--skeleton">
      <div className="inner__book--skeleton-content">
        <Skeleton width="70%" height="32px" marginBottom="16px" />
        <Skeleton width="40%" height="32px" marginBottom="16px" />
        <Skeleton width="100%" height="32px" marginBottom="16px" />
        <Skeleton width="45%" height="64px" marginBottom="16px" />
        <Skeleton width="50%" height="32px" marginBottom="16px" />
        <Skeleton width="20%" height="32px" marginBottom="16px" />
        <Skeleton width="50%" height="64px" marginBottom="16px" />
        <Skeleton width="80%" height="180px" marginBottom="16px" />
        <Skeleton width="80%" height="268px" />
      </div>
      <div className="inner__book--skeleton-img">
        <Skeleton width="300px" height="300px" marginBottom="16px" />
      </div>
    </div>
  );
}

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const { book, isLoading, error } = useBook(id);
  const { user } = useAppSelector((state) => state.auth);
  const [saved, setSaved] = useState(false);
  const [modalActive, setModalActive] = useState(false);

  const playerHref = book?.subscriptionRequired
    ? "/choose-plan"
    : `/player/${id}`;

  useEffect(() => {
    if (!user || !book) return;

    isBookSaved(user.id, book.id).then(({ saved }) => {
      setSaved(saved);
    });
  }, [user, book]);

  async function handleBookmarkClick() {
    if (!user || !book) return;

    if (saved) {
      const { error } = await removeBookFromLibrary(user.id, book.id);
      if (!error) setSaved(false);
    } else {
      const { error } = await addBookToLibrary(user.id, book.id);
      if (!error) setSaved(true);
    }
  }

  return (
    <div className="wrapper main__wrapper">
      <div className="row">
        <div className="container">
          {(!book && !error) || isLoading ? (
            <BookPageSkeleton />
          ) : error ? (
            <div className="inner-book__title">{error}</div>
          ) : (
          <div className="inner__wrapper">
            <div className="inner__book">
              <div className="inner-book__title">{book?.title}</div>
              <div className="inner-book__author">{book?.author}</div>
              <div className="inner-book__sub--title">{book?.subTitle}</div>

              <div className="inner-book__wrapper">
                <div className="inner-book__description--wrapper">
                  <div className="inner-book__description">
                    <div className="inner-book__icon">
                      <BsStar style={{ width: "20px", height: "20px" }} />
                    </div>
                    <div className="inner-book__overall--rating">
                      {book?.averageRating} ({book?.totalRating} ratings)
                    </div>
                  </div>
                  <div className="inner-book__description">
                    <div className="inner-book__icon">
                      <IoMdTime />
                    </div>
                    {book && (
                      <BookDuration
                        audioLink={book.audioLink}
                        className="inner-book__duration"
                      />
                    )}
                  </div>
                  <div className="inner-book__description">
                    <div className="inner-book__icon">
                      <TiMicrophoneOutline />
                    </div>
                    <div className="inner-book__type">Audio & Text</div>
                  </div>
                  <div className="inner-book__description">
                    <div className="inner-book__icon">
                      <TbBulb />
                    </div>
                    <div className="inner-book__key--ideas">
                      {book?.keyIdeas} Key ideas
                    </div>
                  </div>
                </div>
              </div>

              <div className="inner-book__read--btn-wrapper">
                {user ? (
                  <Link href={playerHref} className="inner-book__read--btn">
                    <div className="inner-book__read--icon">
                      <PiBookOpenText />
                    </div>
                    <div className="inner-book__read--text">Read</div>
                  </Link>
                ) : (
                  <div
                    onClick={() => setModalActive(true)}
                    className="inner-book__read--btn"
                  >
                    <div className="inner-book__read--icon">
                      <PiBookOpenText />
                    </div>
                    <div className="inner-book__read--text">Read</div>
                  </div>
                )}

                {user ? (
                  <Link href={playerHref} className="inner-book__read--btn">
                    <div className="inner-book__read--icon">
                      <TiMicrophoneOutline />
                    </div>
                    <div className="inner-book__read--text">Listen</div>
                  </Link>
                ) : (
                  <div
                    onClick={() => setModalActive(true)}
                    className="inner-book__read--btn"
                  >
                    <div className="inner-book__read--icon">
                      <TiMicrophoneOutline />
                    </div>
                    <div className="inner-book__read--text">Listen</div>
                  </div>
                )}
              </div>

              <div
                onClick={handleBookmarkClick}
                className="inner-book__bookmark"
              >
                <div className="inner-book__bookmark--icon">
                  {saved ? <RxBookmarkFilled /> : <RxBookmark />}
                </div>
                <div className="inner-book__bookmark--text">
                  {saved ? "Saved in My Library" : "Add title to My Library"}
                </div>
              </div>

              <div className="inner-book__secondary--title">
                What's it about?
              </div>
              <div className="inner-book__tags--wrapper">
                {book?.tags?.map((tag) => (
                  <div key={tag} className="inner-book__tag">
                    {tag}
                  </div>
                ))}
              </div>
              <div className="inner-book__book--description">
                {book?.bookDescription}
              </div>

              <h2 className="inner-book__secondary--title">About the author</h2>
              <div className="inner-book__author--description">
                {book?.authorDescription}
              </div>
            </div>

            <div className="inner-book--img-wrapper">
              <img className="inner-book__img" src={book?.imageLink} alt="" />
            </div>
          </div>
          )}
        </div>
      </div>
      {modalActive && <AuthModal onClose={() => setModalActive(false)} />}
    </div>
  );
}
