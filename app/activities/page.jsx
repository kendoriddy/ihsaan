"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import Layout from "@/components/Layout";

const sessions = ["2023/2024", "2024/2025"];
const terms = ["1st Term", "2nd Term", "3rd Term"];

const StudentInfoPage = () => {
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSession && selectedTerm) {
      setLoading(true);

      // Simulate fetch
      setTimeout(() => {
        setData({
          course: "Mathematics",
          group: "Science",
          subjects: ["Algebra", "Geometry", "Calculus"],
        });
        setLoading(false);
      }, 1000);
    }
  }, [selectedSession, selectedTerm]);

  return (
    <Layout>
      <div className="mb-8">
        <Typography variant="h5" className="my-4">
          Select session and term to get your Information
        </Typography>

        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
          <FormControl fullWidth>
            <InputLabel>Session</InputLabel>
            <Select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              label="Session"
            >
              {sessions.map((session) => (
                <MenuItem key={session} value={session}>
                  {session}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Term</InputLabel>
            <Select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              label="Term"
            >
              {terms.map((term) => (
                <MenuItem key={term} value={term}>
                  {term}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
      <div>
        {loading ? (
          <CircularProgress />
        ) : data ? (
          <Card>
            <CardContent>
              <Typography variant="h6">Course: {data.course}</Typography>
              <Typography variant="body1">Group: {data.group}</Typography>
              <Typography variant="body2">
                Subjects: {data.subjects.join(", ")}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          selectedSession &&
          selectedTerm && <Typography>No data available.</Typography>
        )}
      </div>
    </Layout>
  );
};

export default StudentInfoPage;
