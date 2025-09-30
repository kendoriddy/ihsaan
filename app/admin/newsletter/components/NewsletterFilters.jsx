// components/NewsletterFilters.jsx
"use client";
import React, { useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Box,
  Collapse,
  Button,
} from "@mui/material";
import { useFetch } from "@/hooks/useHttp/useHttp";

const NewsletterFilters = ({ showFilters, onFiltersChange }) => {
  const [filters, setFilters] = useState({
    search: "",
    active: "",
    verified: "",
    subscribed: "",
    category: "",
    category_name: "",
    country: "",
    email: "",
    subscribed_after: "",
    subscribed_before: "",
  });

  const { isLoading: loadingCategories, data: categoriesData } = useFetch(
    ["newsletter-categories"],
    `https://ihsaanlms.onrender.com/newsletter/api/categories/`
  );
  const categories = categoriesData?.data?.results || [];

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    onFiltersChange(activeFilters);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      active: "",
      verified: "",
      subscribed: "",
      category: "",
      category_name: "",
      country: "",
      email: "",
      subscribed_after: "",
      subscribed_before: "",
    });
    onFiltersChange({});
  };

  return (
    <Collapse in={showFilters}>
      <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Search subscribers..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Email"
              placeholder="Email address..."
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category Name</InputLabel>
              <Select
                label="Category Name"
                value={filters.category_name}
                onChange={(e) =>
                  handleFilterChange("category_name", e.target.value)
                }
              >
                {categories?.map((cat) => (
                  <MenuItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Country"
              placeholder="Country..."
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Active Status</InputLabel>
              <Select
                value={filters.active}
                onChange={(e) => handleFilterChange("active", e.target.value)}
                label="Active Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Verified Status</InputLabel>
              <Select
                value={filters.verified}
                onChange={(e) => handleFilterChange("verified", e.target.value)}
                label="Verified Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Verified</MenuItem>
                <MenuItem value="false">Not Verified</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Subscribed Status</InputLabel>
              <Select
                value={filters.subscribed}
                onChange={(e) =>
                  handleFilterChange("subscribed", e.target.value)
                }
                label="Subscribed Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="true">Subscribed</MenuItem>
                <MenuItem value="false">Unsubscribed</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Subscribed After"
              type="datetime-local"
              value={filters.subscribed_after}
              onChange={(e) =>
                handleFilterChange("subscribed_after", e.target.value)
              }
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Subscribed Before"
              type="datetime-local"
              value={filters.subscribed_before}
              onChange={(e) =>
                handleFilterChange("subscribed_before", e.target.value)
              }
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            onClick={applyFilters}
            className="bg-gradient-to-r from-red-900 to-red-800 normal-case"
          >
            Apply Filters
          </Button>
          <Button
            variant="outlined"
            onClick={clearFilters}
            className="normal-case"
          >
            Clear All
          </Button>
        </Box>
      </Box>
    </Collapse>
  );
};

export default NewsletterFilters;
