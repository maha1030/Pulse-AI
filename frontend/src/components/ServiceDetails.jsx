
import { useEffect, useState } from "react";

function ServiceDetails({ serviceId, onBack, onViewEndpoint }) {

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    setLoading(true);
    setError("");

    fetch(`http://127.0.0.1:8000/services/${serviceId}`)

      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch service");
        }

        return response.json();

      })

      .then((data) => {
        setService(data);
      })

      .catch((error) => {

        console.error(
          "Error fetching service:",
          error
        );

        setError("Unable to load service.");

      })

      .finally(() => {
        setLoading(false);
      });

  }, [serviceId]);


  if (loading) {
    return (
      <div className="service-details-page">
        <div className="services-state">
          Loading service...
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="service-details-page">
        <div className="services-state error">
          {error}
        </div>
      </div>
    );
  }


  if (!service) {
    return null;
  }


  return (

    <div className="service-details-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="service-details-header">

        <div>

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Back to Services
          </button>

          <span className="breadcrumb">
            MONITOR / SERVICES / {service.name.toUpperCase()}
          </span>

          <div className="service-title-row">

            <div className="large-service-icon">
              S
            </div>

            <div>

              <h1>
                {service.name}
              </h1>

              <p>
                {service.base_url}
              </p>

            </div>

          </div>

        </div>


        <div className="service-active-badge">

          <span className="status-dot"></span>

          Active

        </div>

      </header>


      {/* =========================
          SERVICE INFORMATION
      ========================= */}

      <section className="service-overview">

        <div className="overview-item">

          <span>Service ID</span>

          <strong>
            #{service.id}
          </strong>

        </div>


        <div className="overview-item">

          <span>Project ID</span>

          <strong>
            #{service.project_id}
          </strong>

        </div>


        <div className="overview-item">

          <span>Endpoints</span>

          <strong>
            {service.endpoints.length}
          </strong>

        </div>

      </section>


      {/* =========================
          ENDPOINTS
      ========================= */}

      <section className="endpoints-section">

        <div className="endpoints-header">

          <div>

            <h2>
              Endpoints
            </h2>

            <p>
              API endpoints exposed by this service.
            </p>

          </div>

          <span className="endpoint-count">
            {service.endpoints.length}{" "}
            {service.endpoints.length === 1
              ? "Endpoint"
              : "Endpoints"}
          </span>

        </div>


        {service.endpoints.length === 0 ? (

          <div className="services-state">
            No endpoints found for this service.
          </div>

        ) : (

          <div className="endpoint-list">

            {service.endpoints.map((endpoint) => (

              <div
                className="endpoint-row"
                key={endpoint.id}
              >

                <div className="endpoint-method">
                  {endpoint.method}
                </div>


                <div className="endpoint-path">
                  {endpoint.path}
                </div>


                <div className="endpoint-id">
                  ID #{endpoint.id}
                </div>


                <button 
                    className="endpoint-arrow"
                    onClick={() => onViewEndpoint(endpoint.id)}
                >
                  →
                </button>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>

  );
}

export default ServiceDetails;

