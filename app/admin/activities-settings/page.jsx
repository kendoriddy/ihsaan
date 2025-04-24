"use client";
// import RequireAuth from "@/app/lib/ReuquireAuth";
import Layout from "@/components/Layout";
import Link from "next/link";
import React, { useState } from "react";
import AllSessions from "./components/ListSessions";
import Button from "@/components/Button";
import ListTerms from "./components/ListTerms";

const ActivitiesSettings = () => {
  const [sessionOrTerm, setSessionOrTerm] = useState("term");

  return (
    // <RequireAuth>
    <Layout>
      <div className="w-full px-4">
        <Link
          href="/admin/activities-settings/create-session-or-term"
          className="flex justify-end mb-4"
        >
          <Button color="secondary">Create new academic session/term</Button>
        </Link>
        {sessionOrTerm === "session" && <AllSessions />}
        {sessionOrTerm === "term" && <ListTerms />}
      </div>
    </Layout>
    //  </RequireAuth>
  );
};

export default ActivitiesSettings;
