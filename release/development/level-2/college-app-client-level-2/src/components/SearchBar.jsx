// ========================================
// LEVEL 2: SearchBar Component
// Learning: Controlled input with state
// Now functional with useState!
// ========================================

function SearchBar({ searchQuery, onSearchChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search members by name..."
        aria-label="Search members"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
