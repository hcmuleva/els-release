import Header from "./components/Header";
import StatCard from "./components/StatCard";
import UserCard from "./components/UserCard";
import users from "./data/users";
import "./styles/App.css";

function App() {
  // Calculate statistics
  const totalUsers = users.length;
  const totalStudents = users.filter((user) => user.role === "student").length;
  const totalFaculty = users.filter((user) => user.role === "faculty").length;
  const totalAlumni = users.filter((user) => user.role === "alumni").length;

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        {/* Statistics Section */}
        <div className="stats-container">
          <StatCard number={totalUsers} label="Total Members" />
          <StatCard number={totalStudents} label="Students" />
          <StatCard number={totalFaculty} label="Faculty" />
          <StatCard number={totalAlumni} label="Alumni" />
        </div>

        {/* Users Section */}
        <h2 className="section-title">Our Community</h2>
        <div className="users-grid">
          {users.map((user) => (
            <UserCard
              key={user.id}
              firstName={user.firstName}
              lastName={user.lastName}
              role={user.role}
              age={user.age}
              program={user.program}
              year={user.year}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
