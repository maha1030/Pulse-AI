import { useEffect, useState } from "react";

function EndpointDetails({
  endpointId,
  onBack,
}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(
      `http://127.0.0.1:8000/metrics/${endpointId}/stats?minutes=60`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch endpoint statistics");
        }

        return response.json();
      })
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.error(
          "Error fetching endpoint statistics:",
          error
        );

        setError(
          "Unable to load endpoint statistics."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [endpointId]);

  if (loading) {
    return (
      <div className="endpoint-details-page">
        <div className="services-state">
          Loading endpoint statistics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="endpoint-details-page">
        <div className="services-state error">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="endpoint-details-page">

      {/* Header */}

      <header className="endpoint-details-header">

        <div>

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Back to Service
          </button>

          <span className="breadcrumb">
            MONITOR / ENDPOINTS
          </span>

          <div className="endpoint-title-row">

            <div className="endpoint-large-icon">
              API
            </div>

            <div>
              <h1>
                Endpoint #{stats.endpoint_id}
              </h1>

              <p>
                Request performance and health statistics
              </p>
            </div>

          </div>

        </div>

      </header>


      {/* Time Window */}

      <div className="stats-window">
        Last {stats.time_window_minutes} minutes
      </div>


      {/* Statistics */}

      <section className="endpoint-stats-grid">

        <div className="endpoint-stat-card">

          <span className="endpoint-stat-label">
            Total Requests
          </span>

          <strong>
            {stats.total_requests}
          </strong>

          <p>
            Requests received
          </p>

        </div>


        <div className="endpoint-stat-card">

          <span className="endpoint-stat-label">
            Average Latency
          </span>

          <strong>
            {stats.average_latency_ms}
            <small> ms</small>
          </strong>

          <p>
            Average response time
          </p>

        </div>


        <div className="endpoint-stat-card">

          <span className="endpoint-stat-label">
            Error Count
          </span>

          <strong>
            {stats.error_count}
          </strong>

          <p>
            Requests with 4xx / 5xx status
          </p>

        </div>


        <div className="endpoint-stat-card">

          <span className="endpoint-stat-label">
            Error Rate
          </span>

          <strong>
            {stats.error_rate}
            <small> %</small>
          </strong>

          <p>
            Percentage of failed requests
          </p>

        </div>

      </section>


      {/* Health Summary */}

      <section className="endpoint-health-card">

        <div>

          <span className="health-label">
            ENDPOINT HEALTH
          </span>

          <h2>
            {stats.error_rate === 0
              ? "Healthy"
              : stats.error_rate < 5
              ? "Minor Issues"
              : "Needs Attention"}
          </h2>

          <p>
            Based on the last{" "}
            {stats.time_window_minutes} minutes
            of request activity.
          </p>

        </div>

        <div
          className={`health-indicator ${
            stats.error_rate === 0
              ? "healthy"
              : stats.error_rate < 5
              ? "warning"
              : "critical"
          }`}
        >
          <span></span>
        </div>

      </section>

    </div>
  );
}

export default EndpointDetails;

