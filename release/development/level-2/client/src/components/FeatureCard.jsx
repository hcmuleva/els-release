// ========================================
// LEVEL 2: FeatureCard Component
// Learning: Props - accepting and using data
// ========================================

/**
 * FeatureCard displays a single feature
 * Props:
 * - icon: emoji icon to display
 * - title: feature title
 * - description: feature description
 */
function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <span className="icon">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default FeatureCard;
