import { useState } from "react";

function CreateService({
  projectId,
  onClose,
  onServiceCreated,
}) {
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Service name is required.");
      return;
    }

    if (!baseUrl.trim()) {
      setError("Base URL is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/services/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            base_url: baseUrl.trim(),
            project_id: projectId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create service");
      }

      const newService = await response.json();

      onServiceCreated(newService);
      onClose();

    } catch (error) {
      console.error("Error creating service:", error);
      setError("Unable to create service.");
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
              NEW SERVICE
            </span>

            <h2>Add Service</h2>

            <p>
              Connect an API service to this project.
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
              Service Name
            </label>

            <input
              type="text"
              placeholder="e.g. User API"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>
              Base URL
            </label>

            <input
              type="text"
              placeholder="e.g. https://api.example.com"
              value={baseUrl}
              onChange={(event) =>
                setBaseUrl(event.target.value)
              }
            />

          </div>


          <div className="form-project-info">
            Adding service to Project #{projectId}
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
                : "Add Service"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateService;