import { createClient } from "@/lib/supabase/client";

export type LibraryRow = {
  id: string;
  user_id: string;
  book_id: string;
  added_at: string;
};

export async function getSavedBookIds(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_library")
    .select("book_id")
    .eq("user_id", userId);

  if (error) return { data: null, error };

  return {
    data: data.map((row) => row.book_id),
    error: null,
  };
}

export async function isBookSaved(userId: string, bookId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_library")
    .select("id")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .maybeSingle();

  if (error) return { saved: false, error };
  return { saved: !!data, error: null };
}

export async function addBookToLibrary(userId: string, bookId: string) {
  const supabase = createClient();

  const { error } = await supabase.from("user_library").insert({
    user_id: userId,
    book_id: bookId,
  });
  return { error };
}

export async function removeBookFromLibrary(userId: string, bookId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_library")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId);

  return { error };
}
