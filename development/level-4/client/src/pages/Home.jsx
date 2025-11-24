import { useState, useEffect } from "react";
import { getUserStats } from "../../service/user/userService";
import "./Home.css";

const Home = () => {
  const [stats, setStats] = useState({
    total: 0,
    students: 0,
    alumni: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getUserStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-large"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const activeMembers = stats.students + stats.alumni;
  const studentShare = stats.total
    ? Math.round((stats.students / stats.total) * 100)
    : 0;
  const alumniShare = stats.total
    ? Math.round((stats.alumni / stats.total) * 100)
    : 0;
  const adminShare = stats.total
    ? Math.round((stats.admins / stats.total) * 100)
    : 0;
  const studentTrendLabel =
    studentShare >= alumniShare ? "Student majority" : "Alumni majority";

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Dashboard</h1>
        <p>Overview of your college community</p>
      </div>

      <div className="pulse-grid">
        <div className="pulse-card">
          <div className="pulse-top">
            <span className="pulse-label">Active Members</span>
            <span className="pulse-trend">{studentTrendLabel}</span>
          </div>
          <h2 className="pulse-value">{activeMembers}</h2>
          <p className="pulse-note">
            Students and alumni currently in the network
          </p>
          <div className="pulse-progress">
            <div className="progress-track">
              <span
                className="progress-fill students"
                style={{ width: `${Math.min(studentShare, 100)}%` }}
              ></span>
              <span
                className="progress-fill alumni"
                style={{ width: `${Math.min(alumniShare, 100)}%` }}
              ></span>
            </div>
            <div className="progress-labels">
              <span>Students {studentShare}%</span>
              <span>Alumni {alumniShare}%</span>
            </div>
          </div>
        </div>

        <div className="pulse-card spotlight">
          <div className="pulse-top">
            <span className="pulse-label">Admin Coverage</span>
            <span className="pulse-trend subtle">Governance</span>
          </div>
          <h2 className="pulse-value">{stats.admins}</h2>
          <p className="pulse-note">
            {adminShare}% of members are administrators keeping things running
          </p>
          <ul className="pulse-list">
            <li>Role-based access to manage profiles</li>
            <li>Monitor onboarding requests and approvals</li>
            <li>Champion mentorship opportunities</li>
          </ul>
        </div>

        <div className="pulse-card gradient">
          <div className="pulse-top">
            <span className="pulse-label">Community Snapshot</span>
            <span className="pulse-trend subtle">Realtime</span>
          </div>
          <div className="snapshot-grid">
            <div>
              <h3>{stats.total}</h3>
              <p>Total members</p>
            </div>
            <div>
              <h3>{studentShare}%</h3>
              <p>Current students</p>
            </div>
            <div>
              <h3>{alumniShare}%</h3>
              <p>Alumni strength</p>
            </div>
            <div>
              <h3>{adminShare}%</h3>
              <p>Admin ratio</p>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <span>👥</span>
          </div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.total}</p>
            <span className="stat-label">All registered users</span>
          </div>
        </div>

        <div className="stat-card students">
          <div className="stat-icon">
            <span>🎓</span>
          </div>
          <div className="stat-content">
            <h3>Students</h3>
            <p className="stat-number">{stats.students}</p>
            <span className="stat-label">Currently enrolled</span>
          </div>
        </div>

        <div className="stat-card alumni">
          <div className="stat-icon">
            <span>🎯</span>
          </div>
          <div className="stat-content">
            <h3>Alumni</h3>
            <p className="stat-number">{stats.alumni}</p>
            <span className="stat-label">Graduated members</span>
          </div>
        </div>

        <div className="stat-card admins">
          <div className="stat-icon">
            <span>⚙️</span>
          </div>
          <div className="stat-content">
            <h3>Administrators</h3>
            <p className="stat-number">{stats.admins}</p>
            <span className="stat-label">System admins</span>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-card">
          <div className="info-header">
            <h2>Welcome to Alumni College Portal</h2>
          </div>
          <div className="info-content">
            <p>
              This platform connects students and alumni, enabling you to track
              academic progress, network with peers, and maintain your
              professional profile.
            </p>
            <div className="quick-links">
              <a href="/users" className="quick-link">
                <span className="link-icon">👥</span>
                <div>
                  <strong>Browse Users</strong>
                  <small>View all students and alumni</small>
                </div>
              </a>
              <a href="/profile" className="quick-link">
                <span className="link-icon">👤</span>
                <div>
                  <strong>My Profile</strong>
                  <small>Update your information</small>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="info-card">
          <div className="info-header">
            <h2>Quick Statistics</h2>
          </div>
          <div className="info-content">
            <div className="stat-row">
              <span>Students vs Alumni Ratio</span>
              <strong>
                {stats.students > 0 && stats.alumni > 0
                  ? `${
                      Math.round((stats.students / stats.alumni) * 100) / 100
                    }:1`
                  : "N/A"}
              </strong>
            </div>
            <div className="stat-row">
              <span>Total Community Members</span>
              <strong>{stats.students + stats.alumni}</strong>
            </div>
            <div className="stat-row">
              <span>Platform Growth</span>
              <strong className="growth-positive">+{stats.total}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="insights-panel">
        <div className="insights-card">
          <h3>Next up for your network</h3>
          <p>
            Keep profiles updated to help alumni and students connect. Recent
            joins appear in the Users directory where you can review their
            status and academic timeline.
          </p>
        </div>
        <div className="insights-card checklist">
          <h3>Suggested actions</h3>
          <ul>
            <li>Approve pending registrations promptly</li>
            <li>Encourage students to share graduation timelines</li>
            <li>Spotlight alumni achievements on the dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
