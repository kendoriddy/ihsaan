"use client";

import React from "react";
import AddingQuiz from "./components/AddingQuiz";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import Button from "@/components/Button";

const SetQuiz = () => {
  return (
    <AdminLayout>
      <div className="w-full px-4">
        <Link href="/admin/set-quiz/all-quiz" className="mb-4">
          <Button> See all Quiz questions</Button>
        </Link>
        <AddingQuiz />
      </div>
    </AdminLayout>
  );
};

export default SetQuiz;
