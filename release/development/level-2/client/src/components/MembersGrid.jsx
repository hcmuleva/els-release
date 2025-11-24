// ========================================
// LEVEL 2: MembersGrid Component
// Learning: Rendering filtered list with props
// Now receives filtered members from parent!
// ========================================

import MemberCard from "./MemberCard";

function MembersGrid({ members }) {
  return (
    <div className="members-grid">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          name={member.name}
          role={member.role}
          program={member.program}
          status={member.status}
          interests={member.interests}
          bio={member.bio}
        />
      ))}
    </div>
  );
}

export default MembersGrid;
