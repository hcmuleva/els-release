// ========================================
// Home Page - Member Directory
// Learning: Using useState for search and filters
// ========================================

import { useState } from "react";
import Hero from "../components/Hero";
import FeatureGrid from "../components/FeatureGrid";
import SearchBar from "../components/SearchBar";
import FilterButtons from "../components/FilterButtons";
import MembersGrid from "../components/MembersGrid";
import { members } from "../data/members";
import "../styles/Home.css";

function Home() {
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // State for selected role filter
  const [selectedRole, setSelectedRole] = useState("All");

  // Filter members based on search query and selected role
  const filteredMembers = members.filter((member) => {
    // Check if name matches search query
    const matchesSearch = member.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Check if role matches filter (or filter is "All")
    const matchesRole = selectedRole === "All" || member.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="home-page">
      {/* Hero section */}
      <Hero />

      {/* Feature cards grid */}
      <FeatureGrid />

      {/* Members directory section */}
      <section className="members-section">
        <div className="container">
          <h2 className="section-title">Our Community Members</h2>

          {/* Search bar - pass state and setter */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Filter buttons - pass state and setter */}
          <FilterButtons
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
          />

          {/* Show count of filtered members */}
          <p className="members-count">
            Showing {filteredMembers.length} of {members.length} members
          </p>

          {/* Member cards grid - pass filtered data */}
          <MembersGrid members={filteredMembers} />
        </div>
      </section>
    </div>
  );
}

export default Home;
