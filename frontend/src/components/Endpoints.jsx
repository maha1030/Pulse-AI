
import { useEffect, useState } from "react";

function Endpoints({ onViewEndpoint }) {
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/endpoints/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch endpoints");
        }

        return response.json();
      })
      .then((data) => {
        setEndpoints(data);
      })
      .catch((error) => {
        console.error("Error fetching endpoints:", error);
        setError("Unable to load endpoints.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="endpoints-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <header className="endpoints-page-header">

        <div>
          <span className="breadcrumb">
            MONITOR / ENDPOINTS
          </span>

          <h1>Endpoints</h1>

          <p className="endpoints-subtitle">
            Monitor API endpoints and analyze their performance.
          </p>
        </div>

        <div className="endpoints-count">
          {endpoints.length}{" "}
          {endpoints.length === 1
            ? "Endpoint"
            : "Endpoints"}
        </div>

      </header>


      {/* =========================
          LOADING
      ========================= */}

      {loading && (
        <div className="services-state">
          Loading endpoints...
        </div>
      )}


      {/* =========================
          ERROR
      ========================= */}

      {!loading && error && (
        <div className="services-state error">
          {error}
        </div>
      )}


      {/* =========================
          EMPTY STATE
      ========================= */}

      {!loading &&
        !error &&
        endpoints.length === 0 && (
          <div className="services-state">
            No endpoints found.
          </div>
        )}


      {/* =========================
          ENDPOINT LIST
      ========================= */}

      {!loading &&
        !error &&
        endpoints.length > 0 && (

          <section className="endpoints-list">

            {endpoints.map((endpoint) => (

              <article
                className="endpoint-card"
                key={endpoint.id}
              >

                {/* HTTP METHOD */}

                <div
                  className={`endpoint-method-badge ${endpoint.method.toLowerCase()}`}
                >
                  {endpoint.method}
                </div>


                {/* ENDPOINT INFORMATION */}

                <div className="endpoint-card-info">

                  <h2>
                    {endpoint.path}
                  </h2>

                  <p>
                    API Endpoint
                  </p>

                </div>


                {/* METADATA */}

                <div className="endpoint-card-meta">

                  <div>
                    <span>Endpoint ID</span>

                    <strong>
                      #{endpoint.id}
                    </strong>
                  </div>

                  <div>
                    <span>Service ID</span>

                    <strong>
                      #{endpoint.service_id}
                    </strong>
                  </div>

                </div>


                {/* ACTION */}

                <button
                  className="view-endpoint-btn"
                  onClick={() =>
                    onViewEndpoint(endpoint.id)
                  }
                >
                  View Metrics
                  <span>→</span>
                </button>

              </article>

            ))}

          </section>

        )}

    </div>
  );
}

export default Endpoints;

