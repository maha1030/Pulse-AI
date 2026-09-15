import { useState } from "react";

function CreateEndpoint({
  serviceId,
  onClose,
  onEndpointCreated,
}) {
  const [path, setPath] = useState("");
  const [method, setMethod] = useState("GET");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!path.trim()) {
      setError("Endpoint path is required.");
      return;
    }

    if (!path.trim().startsWith("/")) {
      setError("Endpoint path must start with /.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/endpoints/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: path.trim(),
            method: method,
            service_id: serviceId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create endpoint");
      }

      const newEndpoint = await response.json();

      onEndpointCreated(newEndpoint);
      onClose();

    } catch (error) {
      console.error("Error creating endpoint:", error);
      setError("Unable to create endpoint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-overlay">

      <div className="create-project-modal">

        <div className="create-project-header">

          <div>
            <span className="health-label">
              NEW ENDPOINT
            </span>

            <h2>Add Endpoint</h2>

            <p>
              Add an API endpoint to this service.
            </p>
          </div>

          <button
            className="close-project-btn"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <form
          className="create-project-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label>
              Endpoint Path
            </label>

            <input
              type="text"
              placeholder="e.g. /users"
              value={path}
              onChange={(event) =>
                setPath(event.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>
              HTTP Method
            </label>

            <select
              value={method}
              onChange={(event) =>
                setMethod(event.target.value)
              }
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>

          </div>


          <div className="form-project-info">
            Service ID: #{serviceId}
          </div>


          {error && (
            <div className="create-project-error">
              {error}
            </div>
          )}


          <div className="create-project-actions">

            <button
              type="button"
              className="cancel-project-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-project-btn"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Add Endpoint"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateEndpoint;