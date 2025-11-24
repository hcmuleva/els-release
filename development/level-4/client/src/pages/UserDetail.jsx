import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import "./UserDetail.css";
import { getUserById } from "../../service/user/userService";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const data = await getUserById(userId);
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const formatLabel = (value, fallback = "Not provided") => {
    if (!value) {
      return fallback;
    }
    const readable = value.replace(/_/g, " ").toLowerCase();
    return readable.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const timeline = useMemo(() => {
    if (!user?.start_date) {
      return {
        hasTimeline: false,
        startLabel: "Not set",
        endLabel: "",
        spanLabel: "Timeline pending",
      };
    }

    const startDate = new Date(user.start_date);
    const endDate = user.end_date ? new Date(user.end_date) : null;
    const hasEnd = Boolean(endDate && !Number.isNaN(endDate.getTime()));
    const startLabel = Number.isNaN(startDate.getTime())
      ? "Invalid date"
      : `${startDate.getFullYear()}`;
    const endLabel = hasEnd ? `${endDate.getFullYear()}` : "Present";
    let spanLabel = hasEnd ? "Completed" : "In progress";

    if (hasEnd && !Number.isNaN(startDate.getTime())) {
      const years = Math.max(
        1,
        endDate.getFullYear() - startDate.getFullYear()
      );
      spanLabel = `${years} year${years > 1 ? "s" : ""}`;
    }

    return {
      hasTimeline: true,
      startLabel,
      endLabel,
      spanLabel,
    };
  }, [user]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <h2>User not found</h2>
        <button onClick={() => navigate("/users")} className="back-btn">
          Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="user-detail-container">
      <button onClick={() => navigate("/users")} className="back-button">
        ← Back to Users
      </button>

      <div className="profile-header">
        <div className="profile-banner">
          <div className="profile-avatar-large">
            {user.first_name?.[0]}
            {user.last_name?.[0]}
          </div>
        </div>
        <div className="profile-info">
          <h1>
            {user.first_name} {user.last_name}
          </h1>
          <p className="profile-username">@{user.username}</p>
          <div className="profile-badges">
            <span className={`badge role-${user.user_role?.toLowerCase()}`}>
              {user.user_role}
            </span>
            <span className={`badge status-${user.user_status?.toLowerCase()}`}>
              {user.user_status}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="user-overview-grid">
          <div className="user-overview-card highlight">
            <span className="user-overview-label">Role</span>
            <h3>{formatLabel(user.user_role, "Member")}</h3>
            <p>Reflects current academic standing</p>
          </div>
          <div className="user-overview-card">
            <span className="user-overview-label">Status</span>
            <h3>{formatLabel(user.user_status)}</h3>
            <p>Review this profile to keep information fresh</p>
          </div>
          <div className="user-overview-card">
            <span className="user-overview-label">Duration</span>
            <h3>{timeline.spanLabel}</h3>
            <p>
              {timeline.hasTimeline
                ? `From ${timeline.startLabel} to ${timeline.endLabel}`
                : "Waiting for academic dates"}
            </p>
          </div>
        </div>

        <div className="user-timeline">
          <div className="user-timeline-track">
            <div className="user-timeline-node">
              <span className="user-timeline-label">Start</span>
              <span className="user-timeline-value">{timeline.startLabel}</span>
            </div>
            <div
              className={`user-timeline-connector ${
                timeline.hasTimeline ? "active" : "inactive"
              }`}
            ></div>
            <div className="user-timeline-node">
              <span className="user-timeline-label">
                {timeline.hasTimeline ? "Latest" : "Next"}
              </span>
              <span className="user-timeline-value">
                {timeline.endLabel || "Add date"}
              </span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>Contact Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Mobile Number</span>
              <span className="info-value">
                {user.mobile_number || "Not provided"}
              </span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>Academic Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Role</span>
              <span className="info-value">{user.user_role}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status</span>
              <span className="info-value">{user.user_status}</span>
            </div>
            {user.start_date && (
              <div className="info-item">
                <span className="info-label">Start Date</span>
                <span className="info-value">
                  {new Date(user.start_date).toLocaleDateString()}
                </span>
              </div>
            )}
            {user.end_date && (
              <div className="info-item">
                <span className="info-label">End Date</span>
                <span className="info-value">
                  {new Date(user.end_date).toLocaleDateString()}
                </span>
              </div>
            )}
            {user.dob && (
              <div className="info-item">
                <span className="info-label">Date of Birth</span>
                <span className="info-value">
                  {new Date(user.dob).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {user.start_date && user.end_date && (
          <div className="info-section">
            <h2>Duration</h2>
            <div className="duration-info">
              <p>
                {user.user_role === "ALUMNI" ? "Graduated" : "Enrolled"} from{" "}
                <strong>{new Date(user.start_date).getFullYear()}</strong> to{" "}
                <strong>{new Date(user.end_date).getFullYear()}</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetail;
