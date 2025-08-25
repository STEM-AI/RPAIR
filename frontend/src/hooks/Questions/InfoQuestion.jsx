import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function useInfoQuestions(id, type = null) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(
    // optional signal param used for cancellation from useEffect
    async (signal) => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Missing authentication token");

        const params = {};
        if (type) params.type = type;

        const url = `${process.env.REACT_APP_API_URL.replace(/\/+$/, "")}/programming/number-of-questions-time-limit/${id}/`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          params,
          // axios supports AbortSignal in recent versions
          signal,
        });

        setQuestions(response.data);
      } catch (err) {
        // ignore abort/cancel errors
        const isAbort =
          err?.name === "CanceledError" || err?.name === "AbortError";
        if (isAbort) return;

        // axios error shape may vary
        setError(err.response?.data?.message || err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [id, type],
  );

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    fetchQuestions(controller.signal);

    return () => {
      controller.abort();
    };
  }, [id, type, fetchQuestions]);

  const refetchQuestions = useCallback(
    () => fetchQuestions(),
    [fetchQuestions],
  );

  return { questions, loading, error, type, refetchQuestions };
}
