// ========================================
// LEVEL 2: MemberCard Component
// Learning: Props with complex data
// Learning: Rendering arrays within components
// ========================================

/**
 * MemberCard displays a single member's information
 * Props: name, role, program, status, interests, bio
 */
function MemberCard({ name, role, program, status, interests, bio }) {
  return (
    <div className="member-card">
      <h3>{name}</h3>
      <div className="status-badge">{status}</div>
      <div className="role">{role}</div>
      <div className="program">{program}</div>

      {/* Render interests array */}
      <div className="interests">
        {interests.map((interest, index) => (
          <span key={index} className="interest-tag">
            {interest}
          </span>
        ))}
      </div>

      <div className="bio">{bio}</div>
    </div>
  );
}

export default MemberCard;
