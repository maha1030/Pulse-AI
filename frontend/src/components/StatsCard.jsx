
function StatsCard({ title, value, unit }) {
  return (
    <div className="stats-card">
      <p className="stats-title">{title}</p>

      <div className="stats-value">
        <span>{value}</span>
        <small>{unit}</small>
      </div>
    </div>
  );
}

export default StatsCard;

