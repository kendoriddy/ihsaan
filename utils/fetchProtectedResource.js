async function fetchProtectedResource() {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch("/api/protected-resource", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token might be expired, try to refresh it
        await refreshAccessToken();
        // Retry the request
        return fetchProtectedResource();
      }
      throw new Error("Failed to fetch protected resource");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching protected resource:", error);
    throw error;
  }
}

export default fetchProtectedResource;
