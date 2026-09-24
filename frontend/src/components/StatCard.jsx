function StatCard({ icon, label, value, description }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">
        {icon}
      </div>

      <div className="stat-card-content">
        <span>{label}</span>

        <strong>{value}</strong>

        <small>{description}</small>
      </div>
    </div>
  );
}

export default StatCard;