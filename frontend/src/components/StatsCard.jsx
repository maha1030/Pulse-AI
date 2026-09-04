
function StatsCard({ title, value, unit, description }) {
  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <span className="stats-card-title">
          {title}
        </span>

        <span className="stats-card-icon">
          +
        </span>
      </div>

      <div className="stats-card-value">
        {value}
        {unit && (
          <span className="stats-card-unit">
            {unit}
          </span>
        )}
      </div>

      <p className="stats-card-description">
        {description}
      </p>
    </div>
  );
}

export default StatsCard;

