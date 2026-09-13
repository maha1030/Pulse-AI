import { useEffect, useState } from "react";

function Metrics() {
  const [metrics, setMetrics] = useState(null);
  const [timeWindow, setTimeWindow] = useState(60);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch(
      `http://127.0.0.1:8000/metrics/global?minutes=${timeWindow}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch global metrics");
        }

        return response.json();
      })
      .then((data) => {
        setMetrics(data);
      })
      .catch((error) => {
        console.error(
          "Error fetching global metrics:",
          error
        );

        setError("Unable to load global metrics.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [timeWindow]);


  if (loading) {
    return (
      <div className="metrics-page">
        <div className="services-state">
          Loading global metrics...
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="metrics-page">
        <div className="services-state error">
          {error}
        </div>
      </div>
    );
  }


  if (!metrics) {
    return null;
  }


  return (
    <div className="metrics-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="metrics-page-header">

        <div>

          <span className="breadcrumb">
            MONITOR / METRICS
          </span>

          <h1>Global Metrics</h1>

          <p className="metrics-subtitle">
            Monitor API performance across all services and endpoints.
          </p>

        </div>


        {/* =========================
            TIME WINDOW
        ========================= */}

        <div className="metrics-time-controls">

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

      </header>


      {/* =========================
          TIME WINDOW LABEL
      ========================= */}

      <div className="global-metrics-window">

        Last {metrics.time_window_minutes} minutes

      </div>


      {/* =========================
          REQUEST METRICS
      ========================= */}

      <section className="global-metrics-section">

        <div className="global-section-header">

          <div>

            <span className="health-label">
              REQUEST PERFORMANCE
            </span>

            <h2>Performance Overview</h2>

            <p>
              Request volume and response performance across your system.
            </p>

          </div>

        </div>


        <div className="global-metrics-grid">

          <div className="global-metric-card">

            <span>Total Requests</span>

            <strong>
              {metrics.total_requests}
            </strong>

            <p>
              Requests recorded
            </p>

          </div>


          <div className="global-metric-card">

            <span>Average Latency</span>

            <strong>
              {metrics.average_latency_ms}
              <small> ms</small>
            </strong>

            <p>
              Average response time
            </p>

          </div>


          <div className="global-metric-card">

            <span>P95 Latency</span>

            <strong>
              {metrics.p95_latency_ms}
              <small> ms</small>
            </strong>

            <p>
              95% of requests are faster
            </p>

          </div>


          <div className="global-metric-card">

            <span>P99 Latency</span>

            <strong>
              {metrics.p99_latency_ms}
              <small> ms</small>
            </strong>

            <p>
              99% of requests are faster
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          ERROR METRICS
      ========================= */}

      <section className="global-metrics-section">

        <div className="global-section-header">

          <div>

            <span className="health-label">
              RELIABILITY
            </span>

            <h2>Error Overview</h2>

            <p>
              Monitor failed requests and overall API reliability.
            </p>

          </div>

        </div>


        <div className="global-metrics-grid reliability-grid">

          <div className="global-metric-card">

            <span>Error Count</span>

            <strong>
              {metrics.error_count}
            </strong>

            <p>
              Failed requests
            </p>

          </div>


          <div className="global-metric-card">

            <span>Error Rate</span>

            <strong>
              {metrics.error_rate}
              <small> %</small>
            </strong>

            <p>
              Percentage of failed requests
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          SYSTEM OVERVIEW
      ========================= */}

      <section className="global-metrics-section">

        <div className="global-section-header">

          <div>

            <span className="health-label">
              SYSTEM
            </span>

            <h2>Infrastructure Overview</h2>

            <p>
              Services and endpoints currently being monitored.
            </p>

          </div>

        </div>


        <div className="global-metrics-grid reliability-grid">

          <div className="global-metric-card">

            <span>Services</span>

            <strong>
              {metrics.service_count}
            </strong>

            <p>
              Registered services
            </p>

          </div>


          <div className="global-metric-card">

            <span>Endpoints</span>

            <strong>
              {metrics.endpoint_count}
            </strong>

            <p>
              Monitored API endpoints
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Metrics;