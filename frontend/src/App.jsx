import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import Sidebar from "./components/Sidebar";
import StatsCard from "./components/StatsCard";
import Services from "./components/Services";
import ServiceDetails from "./components/ServiceDetails";
import EndpointDetails from "./components/EndpointDetails";

import "./App.css";


function App() {

  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);

  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedEndpointId, setSelectedEndpointId] = useState(null);
  const [metrics, setMetrics] = useState([]);


  // =========================
  // FETCH PROJECTS
  // =========================

  useEffect(() => {

    fetch("http://127.0.0.1:8000/projects/")

      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        return response.json();

      })

      .then((data) => {
        setProjects(data);
      })

      .catch((error) => {
        console.error("Error fetching projects:", error);
      });

  }, []);


  // =========================
  // FETCH PROJECT STATS
  // =========================

  useEffect(() => {

    fetch(
      "http://127.0.0.1:8000/projects/1/stats?minutes=60"
    )

      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        return response.json();

      })

      .then((data) => {
        setStats(data);
      })

      .catch((error) => {
        console.error("Error fetching stats:", error);
      });

  }, []);


  useEffect(() => {
    fetch(
      "http://127.0.0.1:8000/metrics/1?minutes=60"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch metrics");
        }

        return response.json();
      })
      .then((data) => {
        setMetrics(data);
      })
      .catch((error) => {
        console.error("Error fetching metrics:", error);
      });
  }, []);

  const chartData = metrics.map((metric) => ({
    time: new Date(metric.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    }),
    latency: metric.latency_ms
  }));


  return (

    <div className="app">

      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="main-content">

        {currentPage === "dashboard" && (

          <div className="dashboard-page">

            {/* Header */}

            <header className="page-header">

              <div className="header-text">

                <span className="breadcrumb">
                  MONITOR / DASHBOARD
                </span>

                <h1>Project Overview</h1>

                <p className="header-description">
                  Monitor your API services and performance.
                </p>

              </div>

            </header>


            {/* =========================
                STATISTICS
            ========================= */}

            <section className="stats-grid">

              <StatsCard
                title="Total Requests"
                value={stats?.total_requests ?? 0}
                unit=""
                description="Requests in the last 60 minutes"
              />

              <StatsCard
                title="Average Latency"
                value={stats?.average_latency_ms ?? 0}
                unit="ms"
                description="Average API response time"
              />

              <StatsCard
                title="Error Rate"
                value={stats?.error_rate ?? 0}
                unit="%"
                description="Requests returning errors"
              />

              <StatsCard
                title="Services"
                value={stats?.service_count ?? 0}
                unit=""
                description="Active monitored services"
              />
            </section>


            <section className="dashboard-chart-section">

              <div className="section-header">
                <div>
                  <h2>Latency Over Time</h2>
                  <p className="chart-description">
                    API response latency for the last 60 minutes.
                  </p>
                </div>

                <span className="chart-unit">
                  milliseconds
                </span>
              </div>

              <div className="dashboard-chart">

                {chartData.length === 0 ? (
                  <div className="chart-empty">
                    No request metrics available.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>

                      <CartesianGrid stroke="#222" />

                      <XAxis
                        dataKey="time"
                        stroke="#666"
                        tick={{ fontSize: 11 }}
                      />

                      <YAxis
                        stroke="#666"
                        tick={{ fontSize: 11 }}
                      />

                      <Tooltip
                        contentStyle={{
                          background: "#111",
                          border: "1px solid #333",
                          borderRadius: "6px"
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="latency"
                        stroke="#a855f7"
                        strokeWidth={2}
                        dot={false}
                      />

                    </LineChart>
                  </ResponsiveContainer>
                )}

              </div>

            </section>


            <section className="recent-requests-section">
              <div className="section-header">
                <div>
                  <h2>Recent Requests</h2>
                  <p className="chart-description">
                    Latest API requests captured by PulseAI.
                  </p>
                </div>

                <span className="chart-unit">
                  {metrics.length} requests
                </span>
              </div>

              <div className="recent-requests-list">
                {metrics.length === 0 ? (
                  <div className="chart-empty">
                    No request metrics available.
                  </div>
                ) : (
                  [...metrics]
                    .slice(-8)
                    .reverse()
                    .map((metric) => (
                      <div
                        className="request-row"
                        key={metric.id}
                      >
                        <div className="request-method">
                          GET
                        </div>

                        <div className="request-path">
                          /api/request
                        </div>

                        <div
                          className={`request-status ${
                            metric.status_code >= 400
                              ? "error"
                              : "success"
                          }`}
                        >
                          {metric.status_code}
                        </div>

                        <div className="request-latency">
                          {metric.latency_ms} ms
                        </div>

                        <div className="request-time">
                          {new Date(
                            metric.timestamp
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </section>


            {/* =========================
                PROJECTS
            ========================= */}

            <section className="projects-section">

              <div className="section-header">
                <h2>Projects</h2>

                <span className="project-count">
                  {projects.length} Project
                  {projects.length !== 1 ? "s" : ""}
                </span>
              </div>


              <div className="projects-grid">

                {projects.length === 0 ? (

                  <div className="empty-state">
                    <p>No projects found.</p>
                  </div>

                ) : (

                  projects.map((project) => (

                    <div
                      className="project-card"
                      key={project.id}
                    >

                      {/* Card Header */}

                      <div className="project-card-header">

                        <div className="project-icon">
                          P
                        </div>

                        <span className="project-status">
                          <span className="status-dot"></span>
                          Active
                        </span>

                      </div>


                      {/* Project Information */}

                      <div className="project-info">

                        <h3>
                          {project.name}
                        </h3>

                        <p>
                          {project.description}
                        </p>

                      </div>


                      {/* Project Footer */}

                      <div className="project-footer">

                        <span>
                          Project ID
                        </span>

                        <strong>
                          #{project.id}
                        </strong>

                      </div>

                    </div>

                  ))

                )}

              </div>

            </section>

          </div>

        )}


        {/* =========================
            SERVICES
        ========================= */}

        {currentPage === "services" && (
          <Services
            onViewService={(serviceId) => {
              setSelectedServiceId(serviceId);
              setCurrentPage("service-details");
            }}
          />
        )}

        {currentPage === "service-details" && (
          <ServiceDetails
            serviceId={selectedServiceId}
            onBack={() => {
              setCurrentPage("services");
              setSelectedServiceId(null);
            }}
            onViewEndpoint={(endpointId) => {
              setSelectedEndpointId(endpointId);
              setCurrentPage("endpoint-details");
            }}
          />
        )}


        {/* =========================
            PLACEHOLDERS
        ========================= */}

        {currentPage === "endpoint-details" && (
          <EndpointDetails
            endpointId={selectedEndpointId}
            onBack={() => {
              setCurrentPage("service-details");
              setSelectedEndpointId(null);
            }}
          />
        )}

        {currentPage === "endpoints" && (

          <div className="coming-soon">
            <h2>Endpoints</h2>
            <p>Endpoint monitoring will be available here.</p>
          </div>

        )}


        {currentPage === "metrics" && (

          <div className="coming-soon">
            <h2>Metrics</h2>
            <p>Detailed metrics will be available here.</p>
          </div>

        )}

      </main>

    </div>
  );
}


export default App;

