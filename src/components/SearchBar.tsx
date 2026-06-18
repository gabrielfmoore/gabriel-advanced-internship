"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { HiMenu } from "react-icons/hi";
import { IoMdTime } from "react-icons/io";
import {
  clearSearchResults,
  searchBooks,
} from "@/lib/features/books/booksSlice";
import { usePathname } from "next/navigation";
import Link from "next/link";
import BookDuration from "./BookDuration";

export default function SearchBar({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void;
}) {
  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();
  const { searchResults, searchResultsLoading } = useAppSelector(
    (state) => state.books,
  );
  const pathname = usePathname();
  useEffect(() => {
    if (!query.trim()) {
      dispatch(clearSearchResults());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(searchBooks(query.trim()));
    }, 300);

    return () => clearTimeout(timer);
  }, [query, dispatch]);

  useEffect(() => {
    setQuery("");
    dispatch(clearSearchResults());
  }, [pathname, dispatch]);

  return (
    <div className="search__background">
      <div className="search__wrapper">
        <div className="search__content">
          <div className="search">
            <div className="search__input--wrapper">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search__input"
                type="text"
                placeholder="Search for books"
              />
              <button
                onClick={() => {
                  setQuery("");
                  dispatch(clearSearchResults());
                }}
                className="search__icon"
              >
                {query.length > 0 ? (
                  <AiOutlineClose style={{ width: "24px", height: "24px" }} />
                ) : (
                  <AiOutlineSearch style={{ width: "24px", height: "24px" }} />
                )}
              </button>
            </div>
          </div>
          <button
            type="button"
            className="sidebar__toggle--btn"
            onClick={onToggleSidebar}
            aria-label="Toggle menu"
          >
            <HiMenu style={{ width: "24px", height: "24px" }} />
          </button>
        </div>
        {query && (
          <div className="search__books--wrapper">
            {searchResultsLoading ? (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="skeleton"
                    style={{
                      width: "100%",
                      height: "120px",
                      marginBottom: "8px",
                    }}
                  />
                ))}
              </>
            ) : searchResults.length > 0 ? (
              searchResults.map((book) => (
                <Link
                  key={book.id}
                  href={`/book/${book.id}`}
                  className="search__book--link"
                >
                  <figure className="search__book--image">
                    <img className="book__image" src={book.imageLink} alt="" />
                  </figure>
                  <div>
                    <div className="search__book--title">{book.title}</div>
                    <div className="search__book--author">{book.author}</div>
                    <div className="search__book--duration">
                      <div className="recommended__book--details">
                        <div className="recommended__book--details-icon">
                          <IoMdTime />
                        </div>
                        <BookDuration
                          audioLink={book.audioLink}
                          className="recommended__book--details-text"
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
