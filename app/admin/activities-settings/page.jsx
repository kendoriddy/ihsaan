// import RequireAuth from "@/app/lib/ReuquireAuth";
import Layout from "@/components/Layout";
import Link from "next/link";
import React from "react";
import AllSessions from "./components/ListSessions";
import Button from "@/components/Button";

const ActivitiesSettings = () => {
  return (
    // <RequireAuth>
    <Layout>
      <div className="w-full px-4">
        <Link
          href="/admin/activities-settings/create-session"
          className="flex justify-end mb-4"
        >
          <Button color="secondary">Create new academic sessions</Button>
        </Link>
        <AllSessions />
      </div>
    </Layout>
    //  </RequireAuth>
  );
};

export default ActivitiesSettings;
