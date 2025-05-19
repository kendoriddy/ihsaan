"use client";
import Link from "next/link";
import React, { useState } from "react";
import AllSessions from "./components/ListSessions";
import Button from "@/components/Button";
import ListTerms from "./components/ListTerms";
import AdminLayout from "@/components/AdminLayout";
import Grades from "./components/Grades";

const ActivitiesSettings = () => {
  const [sessionOrTerm, setSessionOrTerm] = useState("session");

  return (
    <AdminLayout>
      <div className="w-full px-4">
        <Link
          href="/admin/activities-settings/create-session-or-term"
          className="flex justify-end mb-4"
        >
          <Button color="secondary">Create new academic session/term</Button>
        </Link>

        <div className="flex justify-center mb-6">
          <div className="flex gap-4 border-b border-gray-300">
            <button
              className={`px-4 py-2 font-medium ${
                sessionOrTerm === "session"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setSessionOrTerm("session")}
            >
              Academic Session
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                sessionOrTerm === "term"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setSessionOrTerm("term")}
            >
              Academic Term
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                sessionOrTerm === "grades"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setSessionOrTerm("grades")}
            >
              Academic Grades
            </button>
          </div>
        </div>

        {sessionOrTerm === "session" && <AllSessions />}
        {sessionOrTerm === "term" && <ListTerms />}
        {sessionOrTerm === "grades" && <Grades />}
      </div>
    </AdminLayout>
  );
};

export default ActivitiesSettings;
