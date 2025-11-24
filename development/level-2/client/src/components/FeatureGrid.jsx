// ========================================
// LEVEL 2: FeatureGrid Component
// Learning: Rendering lists with map()
// Learning: Key prop for list items
// Learning: Importing data
// ========================================

import FeatureCard from "./FeatureCard";
import { features } from "../data/members";

/**
 * FeatureGrid displays all feature cards
 * Learning: Use map() to render array of components
 */
function FeatureGrid() {
  return (
    <section className="features">
      <div className="container">
        <h2 className="section-title">Why Join College Kit?</h2>
        <div className="features-grid">
          {/* 
            map() transforms each feature object into a FeatureCard component
            key prop is REQUIRED for list items - helps React track changes
          */}
          {features.map((feature) => (
            <FeatureCard
              key={feature.id} // ⚠️ key is required!
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureGrid;
