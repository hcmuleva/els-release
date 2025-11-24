// ========================================
// LEVEL 2: FilterButtons Component
// Learning: Click handlers and conditional styling
// Now functional with useState!
// ========================================

function FilterButtons({ selectedRole, onRoleChange }) {
  const roles = ["All", "Student", "Alumni", "Admin"];

  return (
    <div className="filter-controls">
      {roles.map((role) => (
        <button
          key={role}
          className={`filter-btn ${selectedRole === role ? "active" : ""}`}
          onClick={() => onRoleChange(role)}
        >
          {role}
        </button>
      ))}
    </div>
  );
}

export default FilterButtons;
