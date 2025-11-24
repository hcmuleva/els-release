import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUser } from "../../service/user/userService";
import "./Profile.css";

const Profile = () => {
  const { user, updateUserData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    dob: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        mobile_number: user.mobile_number || "",
        dob: user.dob ? user.dob.split("T")[0] : "",
        start_date: user.start_date ? user.start_date.split("T")[0] : "",
        end_date: user.end_date ? user.end_date.split("T")[0] : "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await updateUser(user.id, formData);
      await updateUserData(user.id);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      mobile_number: user.mobile_number || "",
      dob: user.dob ? user.dob.split("T")[0] : "",
      start_date: user.start_date ? user.start_date.split("T")[0] : "",
      end_date: user.end_date ? user.end_date.split("T")[0] : "",
    });
    setMessage({ type: "", text: "" });
  };

  const formatLabel = (value, fallback = "Not provided") => {
    if (!value) {
      return fallback;
    }
    const base = value.replace(/_/g, " ").toLowerCase();
    return base.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const timeline = useMemo(() => {
    if (!user?.start_date) {
      return {
        hasTimeline: false,
        startLabel: "Not set",
        endLabel: "",
        spanLabel: "Add your academic dates to build a journey",
      };
    }

    const startDate = new Date(user.start_date);
    const endDate = user.end_date ? new Date(user.end_date) : null;
    const hasEnd = Boolean(endDate && !Number.isNaN(endDate.getTime()));
    const startLabel = Number.isNaN(startDate.getTime())
      ? "Invalid date"
      : `${startDate.getFullYear()}`;
    const endLabel = hasEnd ? `${endDate.getFullYear()}` : "Present";

    let spanLabel = "In progress";
    if (hasEnd && !Number.isNaN(startDate.getTime())) {
      const spanYears = Math.max(
        1,
        endDate.getFullYear() - startDate.getFullYear()
      );
      spanLabel = `${spanYears} year${spanYears > 1 ? "s" : ""}`;
    } else if (!hasEnd && !Number.isNaN(startDate.getTime())) {
      const currentYear = new Date().getFullYear();
      const progressYears = Math.max(0, currentYear - startDate.getFullYear());
      spanLabel = progressYears
        ? `${progressYears}+ years active`
        : "Tracking just started";
    }

    return {
      hasTimeline: true,
      startLabel,
      endLabel,
      spanLabel,
    };
  }, [user]);

  if (!user) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <div className="profile-page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal information</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          <span className="message-icon">
            {message.type === "success" ? "✓" : "⚠️"}
          </span>
          {message.text}
        </div>
      )}

      <div className="profile-card-main">
        <div className="profile-header-section">
          <div className="profile-avatar-xl">
            {user.first_name?.[0]}
            {user.last_name?.[0]}
          </div>
          <div className="profile-header-info">
            <h2>
              {user.first_name} {user.last_name}
            </h2>
            <p className="profile-role-text">@{user.username}</p>
            <div className="profile-tags">
              <span className={`tag role-${user.user_role?.toLowerCase()}`}>
                {user.user_role}
              </span>
              <span className={`tag status-${user.user_status?.toLowerCase()}`}>
                {user.user_status}
              </span>
            </div>
          </div>
        </div>

        <div className="profile-overview-grid">
          <div className="profile-overview-card highlight">
            <span className="profile-overview-label">Membership</span>
            <h3>
              {formatLabel(user.display_role || user.user_role, "Member")}
            </h3>
            <p>Status automatically adapts as your dates change</p>
          </div>
          <div className="profile-overview-card">
            <span className="profile-overview-label">Account Status</span>
            <h3>{formatLabel(user.user_status, "Pending Review")}</h3>
            <p>Keep your details updated to remain visible</p>
          </div>
          <div className="profile-overview-card">
            <span className="profile-overview-label">Timeline</span>
            <h3>{timeline.spanLabel}</h3>
            <p>
              {timeline.hasTimeline
                ? `From ${timeline.startLabel} to ${timeline.endLabel}`
                : "Share your academic journey"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-timeline">
            <div className="timeline-track">
              <div className="timeline-node">
                <span className="timeline-node-label">Start</span>
                <span className="timeline-node-value">
                  {timeline.startLabel}
                </span>
              </div>
              <div
                className={`timeline-connector ${
                  timeline.hasTimeline ? "active" : "inactive"
                }`}
              ></div>
              <div className="timeline-node">
                <span className="timeline-node-label">
                  {timeline.hasTimeline ? "Latest" : "Next"}
                </span>
                <span className="timeline-node-value">
                  {timeline.endLabel || "Add date"}
                </span>
              </div>
            </div>
          </div>
          <div className="form-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <div className="field-value">{user.first_name}</div>
                )}
              </div>

              <div className="form-field">
                <label>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <div className="field-value">{user.last_name}</div>
                )}
              </div>

              <div className="form-field">
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <div className="field-value">{user.email}</div>
                )}
              </div>

              <div className="form-field">
                <label>Mobile Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">
                    {user.mobile_number || "Not provided"}
                  </div>
                )}
              </div>

              <div className="form-field">
                <label>Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">
                    {user.dob
                      ? new Date(user.dob).toLocaleDateString()
                      : "Not provided"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Academic Information</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Username</label>
                <div className="field-value">{user.username}</div>
              </div>

              <div className="form-field">
                <label>Role</label>
                <div className="field-value">{user.user_role}</div>
              </div>

              <div className="form-field">
                <label>Status</label>
                <div className="field-value">{user.user_status}</div>
              </div>

              <div className="form-field">
                <label>Start Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">
                    {user.start_date
                      ? new Date(user.start_date).toLocaleDateString()
                      : "Not provided"}
                  </div>
                )}
              </div>

              <div className="form-field">
                <label>End Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="field-value">
                    {user.end_date
                      ? new Date(user.end_date).toLocaleDateString()
                      : "Not provided"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-btn"
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
