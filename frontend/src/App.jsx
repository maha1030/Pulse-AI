import { useEffect, useState } from "react";

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
              />

              <StatsCard
                title="Average Latency"
                value={stats?.average_latency_ms ?? 0}
                unit="ms"
              />

              <StatsCard
                title="Error Rate"
                value={stats?.error_rate ?? 0}
                unit="%"
              />

              <StatsCard
                title="Services"
                value={stats?.service_count ?? 0}
                unit=""
              />

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

