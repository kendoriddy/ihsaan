"use client";
import Layout from "@/components/Layout";
import { useParams } from "next/navigation";

const GroupAssignment = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div>Group Assignment ID: {id}</div>
    </Layout>
  );
};

export default GroupAssignment;
