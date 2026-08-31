import { useEffect, useState } from "react";

function Services({ onViewService }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/services/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        return response.json();
      })
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setError("Unable to load services.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="services-page">

      {/* Page Header */}
      <header className="services-header">

        <div>
          <span className="breadcrumb">
            MONITOR / SERVICES
          </span>

          <h1>Services</h1>

          <p className="services-subtitle">
            Monitor and manage the services connected to your projects.
          </p>
        </div>

        <div className="services-count">
          {services.length}{" "}
          {services.length === 1 ? "Service" : "Services"}
        </div>

      </header>


      {/* Loading */}
      {loading && (
        <div className="services-state">
          Loading services...
        </div>
      )}


      {/* Error */}
      {!loading && error && (
        <div className="services-state error">
          {error}
        </div>
      )}


      {/* Empty */}
      {!loading && !error && services.length === 0 && (
        <div className="services-state">
          No services found.
        </div>
      )}


      {/* Service Cards */}
      {!loading && !error && services.length > 0 && (

        <section className="services-grid">

          {services.map((service) => (

            <article
              className="service-card"
              key={service.id}
            >

              {/* Card Top */}
              <div className="service-card-top">

                <div className="service-icon">
                  S
                </div>

                <span className="service-status">
                  <span className="status-dot"></span>
                  Active
                </span>

              </div>


              {/* Service Information */}
              <div className="service-info">

                <h2>
                  {service.name}
                </h2>

                <p className="service-url">
                  {service.base_url}
                </p>

              </div>


              {/* Metadata */}
              <div className="service-meta">

                <div className="meta-item">
                  <span>Service ID</span>
                  <strong>
                    #{service.id}
                  </strong>
                </div>

                <div className="meta-item">
                  <span>Project ID</span>
                  <strong>
                    #{service.project_id}
                  </strong>
                </div>

              </div>


              {/* Action */}
              <div className="service-card-footer">

                <button
                  className="view-service-btn"
                  onClick={() => onViewService(service.id)}
                >
                  View Service
                  <span>→</span>
                </button>

              </div>

            </article>

          ))}

        </section>

      )}

    </div>
  );
}

export default Services;



