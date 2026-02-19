"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";

interface Book {
  id: number;
  title: string;
  author: string;
  availableCopies: number;
}

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data.data);
    } catch (error) {
      alert("Failed to fetch books");
    }
  };

  const issueBook = async (bookId: number) => {
    try {
      await api.post("/issues", { bookId });
      alert("Book issued successfully");
      fetchBooks();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error issuing book");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Books</h1>

      <div className="grid grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold">{book.title}</h2>
            <p>{book.author}</p>
            <p>Available: {book.availableCopies}</p>

            <button
              disabled={book.availableCopies === 0}
              className="bg-green-500 text-white px-3 py-1 mt-2"
              onClick={() => issueBook(book.id)}
            >
              Issue
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
