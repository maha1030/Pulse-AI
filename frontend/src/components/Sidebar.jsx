function Sidebar({ setCurrentPage, currentPage }) {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">P</div>
        <h1>PulseAI</h1>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <p className="sidebar-label">MONITOR</p>

        <button
          className={`sidebar-link ${
            currentPage === "dashboard" ? "active" : ""
          }`}
          onClick={() => setCurrentPage("dashboard")}
        >
          <span className="nav-icon">▦</span>
          <span>Dashboard</span>
        </button>

        <button
          className={`sidebar-link ${
            currentPage === "services" ? "active" : ""
          }`}
          onClick={() => setCurrentPage("services")}
        >
          <span className="nav-icon">▣</span>
          <span>Services</span>
        </button>

        <button
          className="sidebar-link"
          onClick={() => setCurrentPage("endpoints")}
        >
          <span className="nav-icon">◇</span>
          <span>Endpoints</span>
        </button>

        <button
          className="sidebar-link"
          onClick={() => setCurrentPage("metrics")}
        >
          <span className="nav-icon">◈</span>
          <span>Metrics</span>
        </button>

      </nav>

      {/* System status */}
      <div className="sidebar-bottom">

        <div className="system-status">
          <span className="status-dot"></span>

          <div>
            <p>System</p>
            <span>Operational</span>
          </div>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;





