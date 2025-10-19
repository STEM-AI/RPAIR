// hooks/Schedule/useSchedulesBatch.js
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import axios from "axios";

const useSchedulesBatch = (scheduleIds = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");

  // Update refs synchronously during render
  const scheduleIdsRef = useRef(scheduleIds);
  const tokenRef = useRef(token);
  scheduleIdsRef.current = scheduleIds;
  tokenRef.current = token;

  const fetchAll = useCallback(async (ids = scheduleIdsRef.current) => {
    if (!ids || !ids.length) {
      setData([]);
      setLoading(false);
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      const currentToken = tokenRef.current;

      const requests = ids.map((id) =>
        axios
          .get(`${process.env.REACT_APP_API_URL}/core/event/schedule/${id}/`, {
            headers: { Authorization: `Bearer ${currentToken}` },
          })
          .then((res) => ({ id, schedule: res.data }))
          .catch((err) => {
            console.error(`Error fetching schedule ${id}:`, err);
            return { id, schedule: null, error: err.message };
          }),
      );

      const results = await Promise.all(requests);
      setData(results);
      return results;
    } catch (err) {
      console.error("Error in fetchAll:", err);
      setError(err.message || "Failed to fetch schedules");
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since refs are updated during render

  // Memoize stringified scheduleIds to avoid complex dependency
  const scheduleIdsJSON = useMemo(
    () => JSON.stringify(scheduleIds),
    [scheduleIds],
  );

  // Fetch when scheduleIds change
  useEffect(() => {
    const fetchData = async () => {
      if (scheduleIdsRef.current && scheduleIdsRef.current.length > 0) {
        await fetchAll(scheduleIdsRef.current);
      } else {
        setData([]);
      }
    };

    fetchData();
  }, [scheduleIdsJSON, fetchAll]); // Dependencies are now properly declared

  return { data, loading, error, refetch: fetchAll };
};

export default useSchedulesBatch;
