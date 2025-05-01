"use client";

import React from "react";
import AddingQuiz from "./components/AddingQuiz";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";

const SetQuiz = () => {
  return (
    <AdminLayout>
      <div className="w-full px-4">
        <Link href="/admin/set-quiz/all-quiz">
          See all Quiz questions, delete and update them
        </Link>
        <AddingQuiz />
      </div>
    </AdminLayout>
  );
};

export default SetQuiz;
