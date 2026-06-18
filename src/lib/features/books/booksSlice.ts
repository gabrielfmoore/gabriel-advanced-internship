import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "https://us-central1-summaristt.cloudfunctions.net/getBooks";

export type Book = {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number;
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
};

export const fetchSelectedBook = createAsyncThunk(
  "books/fetchSelectedBook",
  async () => {
    const res = await fetch(`${API_URL}?status=selected`);
    if (!res.ok) throw new Error("Failed to fetch selected book");
    const data: Book[] = await res.json();
    return data[0] ?? null;
  },
);

export const fetchRecommendedBooks = createAsyncThunk(
  "books/fetchRecommendedBooks",
  async () => {
    const res = await fetch(`${API_URL}?status=recommended`);
    if (!res.ok) throw new Error("Failed to fetch recommended books");
    const data: Book[] = await res.json();
    return data;
  },
);

export const fetchSuggestedBooks = createAsyncThunk(
  "books/fetchSuggestedBooks",
  async () => {
    const res = await fetch(`${API_URL}?status=suggested`);
    if (!res.ok) throw new Error("Failed to fetch suggested books");
    const data: Book[] = await res.json();
    return data;
  },
);

export const fetchAllBooks = createAsyncThunk(
  "books/fetchAllBooks",
  async () => {
    const statuses = ["recommended", "suggested", "selected"] as const;
    const lists = await Promise.all(
      statuses.map(async (status) => {
        const res = await fetch(`${API_URL}?status=${status}`);
        if (!res.ok) throw new Error(`Failed to fetch ${status} books`);
        return res.json() as Promise<Book[]>;
      }),
    );

    const byId = new Map<string, Book>();
    for (const books of lists) {
      for (const book of books) {
        byId.set(book.id, book);
      }
    }

    return Array.from(byId.values());
  },
);

export const searchBooks = createAsyncThunk(
  "books/searchBooks",
  async (query: string) => {
    const res = await fetch(
      `${API_URL}ByAuthorOrTitle?search=${encodeURIComponent(query)}`,
    );
    if (!res.ok) throw new Error("Search failed");
    return res.json() as Promise<Book[]>;
  },
);

type BooksState = {
  selected: Book | null;
  selectedLoading: boolean;
  selectedError: string | null;
  recommended: Book[];
  recommendedLoading: boolean;
  recommendedError: string | null;
  suggested: Book[];
  suggestedLoading: boolean;
  suggestedError: string | null;
  allBooks: Book[];
  allBooksLoading: boolean;
  allBooksError: string | null;
  searchResults: Book[];
  searchResultsLoading: boolean;
  searchResultsError: string | null;
};

const initialState: BooksState = {
  selected: null,
  selectedLoading: false,
  selectedError: null,
  recommended: [],
  recommendedLoading: false,
  recommendedError: null,
  suggested: [],
  suggestedLoading: false,
  suggestedError: null,
  allBooks: [],
  allBooksLoading: false,
  allBooksError: null,
  searchResults: [],
  searchResultsLoading: false,
  searchResultsError: null,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchResultsLoading = false;
      state.searchResultsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSelectedBook.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(fetchSelectedBook.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selected = action.payload;
      })
      .addCase(fetchSelectedBook.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError =
          action.error.message ?? "Failed to load selected book";
      })
      .addCase(fetchRecommendedBooks.pending, (state) => {
        state.recommendedLoading = true;
        state.recommendedError = null;
      })
      .addCase(fetchRecommendedBooks.fulfilled, (state, action) => {
        state.recommendedLoading = false;
        state.recommended = action.payload;
      })
      .addCase(fetchRecommendedBooks.rejected, (state, action) => {
        state.recommendedLoading = false;
        state.recommendedError =
          action.error.message ?? "Failed to load recommended books";
      })
      .addCase(fetchSuggestedBooks.pending, (state) => {
        state.suggestedLoading = true;
        state.suggestedError = null;
      })
      .addCase(fetchSuggestedBooks.fulfilled, (state, action) => {
        state.suggestedLoading = false;
        state.suggested = action.payload;
      })
      .addCase(fetchSuggestedBooks.rejected, (state, action) => {
        state.suggestedLoading = false;
        state.suggestedError =
          action.error.message ?? "Failed to load suggested books";
      })
      .addCase(fetchAllBooks.pending, (state) => {
        state.allBooksLoading = true;
        state.allBooksError = null;
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.allBooksLoading = false;
        state.allBooks = action.payload;
      })
      .addCase(fetchAllBooks.rejected, (state, action) => {
        state.allBooksLoading = false;
        state.allBooksError = action.error.message ?? "Failed to load books";
      })
      .addCase(searchBooks.pending, (state) => {
        state.searchResultsLoading = true;
        state.searchResultsError = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.searchResultsLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.searchResultsLoading = false;
        state.searchResultsError = action.error.message ?? "Search failed";
      })
  },
});

export const { clearSearchResults } = booksSlice.actions;
export default booksSlice.reducer;
