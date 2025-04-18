// import RequireAuth from "@/app/lib/ReuquireAuth";
import Layout from "@/components/Layout";
import Link from "next/link";
import React from "react";
import AllSessions from "./components/ListSessions";

const ActivitiesSettings = () => {
  return (
    // <RequireAuth>
    <Layout>
      <div className="w-full px-4">
        <Link href="/admin/activities-settings/create-session">
          Create new academic sessions
        </Link>
        <AllSessions />
      </div>
    </Layout>
    //  </RequireAuth>
  );
};

export default ActivitiesSettings;
