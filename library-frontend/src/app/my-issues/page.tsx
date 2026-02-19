"use client";

import { useEffect, useState } from "react";
import api from "../../lib/axios";

interface Issue {
  id: number;
  dueDate: string;
  returnDate: string | null;
  fineAmount: number;
  book: {
    title: string;
    author: string;
  };
}

export default function MyIssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await api.get("/issues/my");
      setIssues(res.data.data);
    } catch (error) {
      alert("Failed to fetch issued books");
    }
  };

  const returnBook = async (id: number) => {
    try {
      await api.patch(`/issues/${id}/return`);
      alert("Book returned successfully");
      fetchIssues();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error returning book");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Issued Books</h1>

      {issues.length === 0 ? (
        <p>No books issued yet.</p>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => (
            <div key={issue.id} className="border p-4 rounded shadow">
              <h2 className="font-semibold">{issue.book.title}</h2>
              <p>Author: {issue.book.author}</p>
              <p>Due Date: {new Date(issue.dueDate).toLocaleDateString()}</p>
              <p>Fine: ₹{issue.fineAmount}</p>

              {!issue.returnDate && (
                <button
                  className="bg-red-500 text-white px-3 py-1 mt-2"
                  onClick={() => returnBook(issue.id)}
                >
                  Return Book
                </button>
              )}

              {issue.returnDate && (
                <p className="text-green-600 mt-2">Returned</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
