import { useEffect, useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function EndpointDetails({
  endpointId,
  onBack,
}) {
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [timeWindow, setTimeWindow] = useState(60);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const chartData = metrics.map((metric) => ({
  time: new Date(metric.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),

  latency: metric.latency_ms,
}));

  const statusData = [
  {
    name: "Successful",
    value: metrics.filter(
      (metric) =>
        metric.status_code >= 200 &&
        metric.status_code < 400
    ).length,
  },
  {
    name: "Client Errors",
    value: metrics.filter(
      (metric) =>
        metric.status_code >= 400 &&
        metric.status_code < 500
    ).length,
  },
  {
    name: "Server Errors",
    value: metrics.filter(
      (metric) =>
        metric.status_code >= 500
    ).length,
  },
].filter((item) => item.value > 0);

  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([
      // Fetch aggregated statistics
      fetch(
        `http://127.0.0.1:8000/metrics/${endpointId}/stats?minutes=${timeWindow}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch endpoint statistics"
          );
        }

        return response.json();
      }),

      // Fetch individual request metrics
      fetch(
        `http://127.0.0.1:8000/metrics/${endpointId}?minutes=${timeWindow}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch endpoint metrics"
          );
        }

        return response.json();
      }),
    ])
      .then(([statsData, metricsData]) => {
        setStats(statsData);
        setMetrics(metricsData);
      })
      .catch((error) => {
        console.error(
          "Error fetching endpoint data:",
          error
        );

        setError(
          "Unable to load endpoint data."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [endpointId, timeWindow]);

  if (loading) {
    return (
      <div className="endpoint-details-page">
        <div className="services-state">
          Loading endpoint data...
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

      {/* =========================
          HEADER
      ========================= */}

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


      {/* =========================
          TIME WINDOW
      ========================= */}

      <div className="stats-window">

        <span>
          Last {stats.time_window_minutes} minutes
        </span>

        <div className="time-window-buttons">

          <button
            className={timeWindow === 15 ? "active" : ""}
            onClick={() => setTimeWindow(15)}
          >
            15m
          </button>

          <button
            className={timeWindow === 60 ? "active" : ""}
            onClick={() => setTimeWindow(60)}
          >
            1h
          </button>

          <button
            className={timeWindow === 360 ? "active" : ""}
            onClick={() => setTimeWindow(360)}
          >
            6h
          </button>

          <button
            className={timeWindow === 1440 ? "active" : ""}
            onClick={() => setTimeWindow(1440)}
          >
            24h
          </button>

        </div>

      </div>


      {/* =========================
          STATISTICS
      ========================= */}

      <section className="endpoint-stats-grid">

        {/* Total Requests */}

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


        {/* Average Latency */}

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


        {/* P95 Latency */}

        <div className="endpoint-stat-card">

          <span className="endpoint-stat-label">
            P95 Latency
          </span>

          <strong>
            {stats.p95_latency_ms}
            <small> ms</small>
          </strong>

          <p>
            95% of requests are faster
          </p>

        </div>


        {/* P99 Latency */}

        <div className="endpoint-stat-card">

          <span className="endpoint-stat-label">
            P99 Latency
          </span>

          <strong>
            {stats.p99_latency_ms}
            <small> ms</small>
          </strong>

          <p>
            99% of requests are faster
          </p>

        </div>


        {/* Error Count */}

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


        {/* Error Rate */}

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


      {/* =========================
          HEALTH SUMMARY
      ========================= */}

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

      
      <section className="latency-chart-card">

        <div className="chart-header">

          <div>
            <span className="health-label">
              PERFORMANCE
            </span>

            <h2>
              Latency Over Time
            </h2>

            <p>
              Response latency for requests in the selected time window.
            </p>
          </div>

          <span className="chart-unit">
            milliseconds
          </span>

        </div>


        {chartData.length === 0 ? (

          <div className="chart-empty">
            No latency data available.
          </div>

        ) : (

          <div className="latency-chart">

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 10,
                }}
              >

                <CartesianGrid
                  stroke="#202020"
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="time"
                  tick={{
                    fill: "#666",
                    fontSize: 10,
                  }}
                  tickLine={false}
                  axisLine={{
                    stroke: "#252525",
                  }}
                />

                <YAxis
                  tick={{
                    fill: "#666",
                    fontSize: 10,
                  }}
                  tickLine={false}
                  axisLine={false}
                  unit=" ms"
                />

                <Tooltip
                  contentStyle={{
                    background: "#0d0d0d",
                    border: "1px solid #292929",
                    borderRadius: "6px",
                    color: "#eee",
                    fontSize: "11px",
                  }}
                  labelStyle={{
                    color: "#777",
                  }}
                  formatter={(value) => [
                    `${value} ms`,
                    "Latency",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 4,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        )}

      </section>


      <section className="status-chart-card">

        <div className="chart-header">

          <div>
            <span className="health-label">
              HTTP STATUS
            </span>

            <h2>
              Request Status
            </h2>

            <p>
              Distribution of successful and failed requests.
            </p>
          </div>

        </div>


        {statusData.length === 0 ? (

          <div className="chart-empty">
            No request status data available.
          </div>

        ) : (

          <div className="status-chart">

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <PieChart>

                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={3}
                >

                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "#4ade80"
                          : index === 1
                          ? "#facc15"
                          : "#ef4444"
                      }
                    />
                  ))}

                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#0d0d0d",
                    border: "1px solid #292929",
                    borderRadius: "6px",
                    color: "#eee",
                    fontSize: "11px",
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "10px",
                    color: "#777",
                  }}
                />

              </PieChart>

            </ResponsiveContainer>

          </div>

        )}

      </section>

      {/* =========================
          RECENT REQUESTS
      ========================= */}

      <section className="metrics-debug-card">

        <div className="metrics-debug-header">

          <div>

            <span className="health-label">
              RECENT REQUESTS
            </span>

            <h2>
              Request Metrics
            </h2>

          </div>

          <span className="metrics-count">
            {metrics.length}{" "}
            {metrics.length === 1
              ? "request"
              : "requests"}
          </span>

        </div>


        {metrics.length === 0 ? (

          <p className="metrics-empty">
            No requests recorded in the last{" "}
            {stats.time_window_minutes} minutes.
          </p>

        ) : (

          <div className="metrics-list">

            {metrics.map((metric) => (

              <div
                className="metric-row"
                key={metric.id}
              >

                <span>
                  {new Date(
                    metric.timestamp
                  ).toLocaleTimeString()}
                </span>

                <strong>
                  {metric.latency_ms} ms
                </strong>

                <span
                  className={
                    metric.status_code >= 400
                      ? "status-error"
                      : "status-success"
                  }
                >
                  {metric.status_code}
                </span>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

export default EndpointDetails;

