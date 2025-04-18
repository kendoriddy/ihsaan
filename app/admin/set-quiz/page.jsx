"use client";

import Layout from "@/components/Layout";
import React from "react";
import AddingQuiz from "./components/AddingQuiz";
import Link from "next/link";
import RequireAuth from "@/app/lib/ReuquireAuth";

const SetQuiz = () => {
  return (
    <RequireAuth>
      <Layout>
        <div className="w-full px-4">
          <Link href="/admin/set-quiz/all-quiz">
            See all Quiz questions, delete and update them
          </Link>
          <AddingQuiz />
        </div>
      </Layout>
    </RequireAuth>
  );
};

export default SetQuiz;
