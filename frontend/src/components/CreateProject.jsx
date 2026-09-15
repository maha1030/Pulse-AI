import { useState } from "react";

function CreateProject({ onClose, onProjectCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/projects/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const newProject = await response.json();

      onProjectCreated(newProject);
      onClose();

    } catch (error) {
      console.error("Error creating project:", error);
      setError("Unable to create project.");
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
              NEW PROJECT
            </span>

            <h2>Create Project</h2>

            <p>
              Add a project to start monitoring your APIs.
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
              Project Name
            </label>

            <input
              type="text"
              placeholder="e.g. E-Commerce API"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />

          </div>


          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              placeholder="What does this project monitor?"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={4}
            />

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
                : "Create Project"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateProject;