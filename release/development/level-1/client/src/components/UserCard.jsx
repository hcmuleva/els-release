import "../styles/UserCard.css";

function UserCard({ firstName, lastName, role, age, program, year }) {
  // Get initials for avatar
  const initials = `${firstName[0]}${lastName[0]}`;

  return (
    <div className="user-card">
      <div className="user-header">
        <div className="user-avatar">{initials}</div>
        <div className="user-info">
          <h3>
            {firstName} {lastName}
          </h3>
          <span className={`user-role ${role}`}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </span>
        </div>
      </div>

      <div className="user-details">
        <div className="user-detail">
          <span className="label">Age:</span>
          <span className="value">{age} years</span>
        </div>
        <div className="user-detail">
          <span className="label">Program:</span>
          <span className="value">{program}</span>
        </div>
        <div className="user-detail">
          <span className="label">Year:</span>
          <span className="value">{year}</span>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
