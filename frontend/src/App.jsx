
import { useEffect, useState } from "react";
import StatsCard from "./components/StatsCard";
import Sidebar from "./components/Sidebar";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch projects
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
        setLoadingProjects(false);

        // If a project exists, fetch its statistics
        if (data.length > 0) {
          fetch(
            `http://127.0.0.1:8000/projects/${data[0].id}/stats?minutes=60`
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch project statistics");
              }

              return response.json();
            })
            .then((statsData) => {
              setStats(statsData);
              setLoadingStats(false);
            })
            .catch((error) => {
              console.error("Error fetching stats:", error);
              setLoadingStats(false);
            });
        } else {
          setLoadingStats(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setLoadingProjects(false);
        setLoadingStats(false);
      });
  }, []);

  return (
    <div className="app">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">

        {/* Header */}
        <header className="header">
          <div>
            <h1>PulseAI</h1>
            <p>AI-powered API observability platform</p>
          </div>
        </header>

        {/* Dashboard */}
        <main className="dashboard">

          <h2>Project Overview</h2>

          <p className="dashboard-subtitle">
            Monitor your API performance and reliability
          </p>

          {/* Statistics Cards */}
          <div className="stats-grid">

            <StatsCard
              title="Total Requests"
              value={
                loadingStats
                  ? "..."
                  : stats?.total_requests ?? 0
              }
              unit=""
            />

            <StatsCard
              title="Average Latency"
              value={
                loadingStats
                  ? "..."
                  : stats?.average_latency_ms ?? 0
              }
              unit="ms"
            />

            <StatsCard
              title="Error Rate"
              value={
                loadingStats
                  ? "..."
                  : stats?.error_rate ?? 0
              }
              unit="%"
            />

            <StatsCard
              title="Services"
              value={
                loadingStats
                  ? "..."
                  : stats?.service_count ?? 0
              }
              unit=""
            />

          </div>

          {/* Projects */}
          <section className="projects-section">

            <div className="section-header">
              <div>
                <h2>Projects</h2>
                <p>Your monitored applications</p>
              </div>
            </div>

            {loadingProjects ? (
              <p className="empty-message">
                Loading projects...
              </p>
            ) : projects.length === 0 ? (
              <p className="empty-message">
                No projects found.
              </p>
            ) : (
              <div className="projects-grid">

                {projects.map((project) => (
                  <div
                    className="project-card"
                    key={project.id}
                  >
                    <div className="project-card-top">
                      <div className="project-icon">
                        P
                      </div>

                      <span className="project-status">
                        Active
                      </span>
                    </div>

                    <h3>{project.name}</h3>

                    <p>
                      {project.description ||
                        "No description available"}
                    </p>

                    <div className="project-footer">
                      <span>
                        Project ID
                      </span>

                      <strong>
                        #{project.id}
                      </strong>
                    </div>
                  </div>
                ))}

              </div>
            )}

          </section>

        </main>

      </div>
    </div>
  );
}

export default App;



