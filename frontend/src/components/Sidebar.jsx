
function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-icon">P</div>
        <span>PulseAI</span>
      </div>

      <nav className="sidebar-nav">

        <p className="nav-label">MONITOR</p>

        <button className="nav-item active">
          <span>▣</span>
          Dashboard
        </button>

        <button className="nav-item">
          <span>◈</span>
          Projects
        </button>

        <button className="nav-item">
          <span>◆</span>
          Services
        </button>

        <button className="nav-item">
          <span>◇</span>
          Endpoints
        </button>

        <button className="nav-item">
          <span>◌</span>
          Metrics
        </button>

      </nav>

      <div className="sidebar-bottom">
        <div className="system-status">
          <span className="status-dot"></span>

          <div>
            <strong>System</strong>
            <p>Operational</p>
          </div>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;

