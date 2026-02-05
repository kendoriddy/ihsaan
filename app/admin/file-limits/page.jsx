"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import axios from "axios";

const FileLimits = () => {
  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const API_BASE = "https://api.ihsaanacademia.com/resource/config/";

  // Helper function to get the most recent token
  const getActiveToken = () => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      return storedToken ? storedToken.trim() : null;
    }
    return null;
  };

  // 1. FETCH CURRENT SETTINGS ON LOAD
  useEffect(() => {
    const fetchSettings = async () => {
      const token = getActiveToken();

      if (!token) {
        toast.error("Session not found. Please log in again.");
        setIsFetching(false);
        return;
      }

      try {
        const response = await axios.get(API_BASE, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Convert the backend results and filter out "OTHERS"
        const mappedData = response.data.results
          .filter((item) => item.resource_type !== "OTHERS") 
          .map((item) => {
            const isMB = item.max_size >= 1048576;
            return {
              db_id: item.id, 
              id: item.resource_type,
              label: `${item.resource_type.charAt(0) + item.resource_type.slice(1).toLowerCase()} Files`,
              value: isMB ? Math.round(item.max_size / 1048576) : Math.round(item.max_size / 1024),
              unit: isMB ? "MB" : "KB",
              max: isMB ? 1000 : 5000,
            };
          });

        setSettings(mappedData);
      } catch (error) {
        console.error("Fetch Error:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          toast.error("Your session has expired. Please re-login.");
        } else {
          toast.error("Failed to load current settings");
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const handleUpdate = (id, newValue) => {
    setSettings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
  };

  // 2. PATCH INDIVIDUAL RESOURCES
  const handleSave = async () => {
    const token = getActiveToken();
    if (!token) {
      toast.error("Authorization token missing.");
      return;
    }

    setIsLoading(true);
    try {
      const updateRequests = settings.map((item) => {
        const multiplier = item.unit === "MB" ? 1048576 : 1024;
        const sizeInBytes = item.value * multiplier;

        const payload = {
          resource_type: item.id,
          max_size: sizeInBytes,
        };

        // THE ATOMIC PATCH: Targets specific DB ID using the fresh token
        return axios.patch(`${API_BASE}${item.db_id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      });

      await Promise.all(updateRequests);
      toast.success("All limits synchronized successfully!");
    } catch (error) {
      console.error("Update Error:", error.response?.data);
      const errorMsg = error.response?.data?.detail || "Some updates failed.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <AdminLayout>
        <div className="p-10 text-center font-medium text-gray-600">
          Loading Settings...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full px-4 max-w-4xl mx-auto py-6">
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-md border border-gray-100">
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-gray-800">File Upload Limits</h1>
            <p className="text-gray-500 mt-2">
              Adjust the maximum allowed file sizes for images, videos, and documents.
            </p>
          </div>

          <div className="space-y-12">
            {settings.map((item) => (
              <div key={item.id} className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                    {item.label}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) => handleUpdate(item.id, Number(e.target.value))}
                      className="w-24 p-2 border border-gray-300 rounded text-center font-semibold outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm text-gray-500 font-medium">{item.unit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 font-mono">0</span>
                  <input
                    type="range"
                    min="0"
                    max={item.max}
                    value={item.value}
                    onChange={(e) => handleUpdate(item.id, Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-xs text-gray-400 font-mono">
                    {item.max}{item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-end border-t pt-8">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Syncing..." : "Apply New Limits"}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FileLimits;