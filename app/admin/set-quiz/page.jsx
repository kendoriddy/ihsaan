"use client";

import Layout from "@/components/Layout";
import React from "react";
import AddingQuiz from "./components/AddingQuiz";
import Link from "next/link";

const SetQuiz = () => {
  return (
    <Layout>
      <div className="w-full px-4">
        <Link href="/set-quiz/all-quiz">
          See all Quiz questions, delete and update them
        </Link>
        <AddingQuiz />
      </div>
    </Layout>
  );
};

export default SetQuiz;
