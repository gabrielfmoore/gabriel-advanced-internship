import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "@/lib/features/books/booksSlice";
import authReducer from "@/lib/features/auth/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      books: booksReducer,
      auth: authReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
