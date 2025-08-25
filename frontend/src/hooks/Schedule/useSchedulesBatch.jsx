// hooks/Schedule/useSchedulesBatch.js
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

const useSchedulesBatch = (scheduleIds = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("access_token");
  const scheduleIdsRef = useRef(scheduleIds);
  const tokenRef = useRef(token);

  // Update refs when props change
  useEffect(() => {
    scheduleIdsRef.current = scheduleIds;
  }, [scheduleIds]);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  const fetchAll = useCallback(async () => {
    const currentScheduleIds = scheduleIdsRef.current;
    const currentToken = tokenRef.current;

    if (!currentScheduleIds.length) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const requests = currentScheduleIds.map((id) =>
        axios
          .get(`${process.env.REACT_APP_API_URL}/core/event/schedule/${id}/`, {
            headers: { Authorization: `Bearer ${currentToken}` },
          })
          .then((res) => ({ id, schedule: res.data })),
      );
      const results = await Promise.all(requests);
      setData(results);
    } catch (err) {
      setError(err.message || "Failed to fetch schedules");
    } finally {
      setLoading(false);
    }
  }, []); // Removed dependencies since we're using refs

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, error, refetch: fetchAll };
};

export default useSchedulesBatch;
