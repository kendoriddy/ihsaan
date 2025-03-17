"use client";
import Layout from "@/components/Layout";
import { useParams } from "next/navigation";

const IndividualAssignmentPage = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div>Individual Assignment ID: {id}</div>
    </Layout>
  );
};

export default IndividualAssignmentPage;
