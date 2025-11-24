import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  UsersRound,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, updateUser } from "../../service/user/userService";
import {
  getRealtimeChannel,
  publishRealtimeMessage,
} from "../../service/realtime/ablyClient";
import { useAuth } from "../context/AuthContext";
import "./Users.css";

const STATUS_OPTIONS = ["APPROVED", "REJECTED", "PENDING"];

const STATUS_META = {
  APPROVED: {
    label: "Approved",
    tone: "success",
    Icon: CheckCircle2,
    tagline: "Ready to connect",
  },
  REJECTED: {
    label: "Rejected",
    tone: "danger",
    Icon: XCircle,
    tagline: "Requires attention",
  },
  PENDING: {
    label: "Pending",
    tone: "pending",
    Icon: Clock,
    tagline: "Awaiting review",
  },
};

const FALLBACK_STATUS_META = STATUS_META.PENDING;

const ROLE_META = {
  STUDENT: { label: "Student", className: "role-student" },
  ALUMNI: { label: "Alumni", className: "role-alumni" },
  ADMIN: { label: "Admin", className: "role-admin" },
};

const PAGE_SIZE_OPTIONS = [6, 9, 12, 24];

const Users = () => {
  const { user, updateUserData } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    user_role: "",
    user_status: "",
    start_date: "",
    end_date: "",
  });
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("APPROVED");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState("");
  const [refreshingStatus, setRefreshingStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[1]);
  const navigate = useNavigate();
  const userId = user?.id;

  const viewerRole =
    user?.display_role || user?.effective_role || user?.user_role || "";
  const isAdmin = viewerRole === "ADMIN";
  const viewerApproved = user?.user_status === "APPROVED";

  const overview = useMemo(() => {
    const roleTotals = {
      STUDENT: 0,
      ALUMNI: 0,
      ADMIN: 0,
    };
    const statusTotals = {
      APPROVED: 0,
      REJECTED: 0,
      PENDING: 0,
    };

    users.forEach((entry) => {
      if (entry?.user_role && roleTotals[entry.user_role] !== undefined) {
        roleTotals[entry.user_role] += 1;
      }

      if (entry?.user_status && statusTotals[entry.user_status] !== undefined) {
        statusTotals[entry.user_status] += 1;
      }
    });

    const total = users.length || 0;
    const approvalRate = total
      ? Math.round((statusTotals.APPROVED / total) * 100)
      : 0;

    return {
      total,
      roleTotals,
      statusTotals,
      approvalRate,
      pending: statusTotals.PENDING,
    };
  }, [users]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = isAdmin ? {} : { user_status: "APPROVED" };
      const data = await getAllUsers(params);
      setUsers(data);
      setFilteredUsers(data);
      setSelectedUserIds([]);
      setBulkMessage("");
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (!isAdmin && !viewerApproved) {
      setLoading(false);
      setUsers([]);
      setFilteredUsers([]);
      return;
    }

    fetchUsers();
  }, [user, isAdmin, viewerApproved, fetchUsers]);

  const applyFilterSet = useCallback(() => {
    let filtered = [...users];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (candidate) =>
          candidate.first_name?.toLowerCase().includes(searchLower) ||
          candidate.last_name?.toLowerCase().includes(searchLower) ||
          candidate.username?.toLowerCase().includes(searchLower) ||
          candidate.email?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.user_role) {
      filtered = filtered.filter(
        (candidate) => candidate.user_role === filters.user_role
      );
    }

    if (filters.user_status) {
      filtered = filtered.filter(
        (candidate) => candidate.user_status === filters.user_status
      );
    }

    if (filters.start_date) {
      filtered = filtered.filter(
        (candidate) => candidate.start_date === filters.start_date
      );
    }

    if (filters.end_date) {
      filtered = filtered.filter(
        (candidate) => candidate.end_date === filters.end_date
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, filters]);

  useEffect(() => {
    applyFilterSet();
  }, [applyFilterSet]);

  useEffect(() => {
    let channel;
    let isMounted = true;

    const subscribeToDirectoryUpdates = async () => {
      try {
        channel = await getRealtimeChannel(
          "users:updates",
          userId ? `user-${userId}` : undefined
        );

        if (!channel) {
          return;
        }

        const handleDirectoryUpdate = () => {
          if (!isMounted) {
            return;
          }
          fetchUsers();
        };

        channel.subscribe("user-status-changed", handleDirectoryUpdate);
        channel.subscribe("user-bulk-status-changed", handleDirectoryUpdate);
        channel.subscribe("profile-updated", handleDirectoryUpdate);

        return () => {
          channel.unsubscribe("user-status-changed", handleDirectoryUpdate);
          channel.unsubscribe(
            "user-bulk-status-changed",
            handleDirectoryUpdate
          );
          channel.unsubscribe("profile-updated", handleDirectoryUpdate);
        };
      } catch (error) {
        console.error("Failed to subscribe to user directory updates:", error);
      }
    };

    const cleanupPromise = subscribeToDirectoryUpdates();

    return () => {
      isMounted = false;
      cleanupPromise
        ?.then((cleanup) => {
          if (typeof cleanup === "function") {
            cleanup();
          }
        })
        .catch((error) => {
          console.error("Error during user directory realtime cleanup:", error);
        });
    };
  }, [fetchUsers, userId]);

  const totalPages = useMemo(() => {
    if (pageSize === 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  }, [filteredUsers.length, pageSize]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredUsers.slice(start, end);
  }, [filteredUsers, currentPage, pageSize]);

  const currentPageSelection = useMemo(() => {
    const ids = paginatedUsers.map((entry) => entry.id);
    const hasAll =
      ids.length > 0 && ids.every((id) => selectedUserIds.includes(id));
    return { ids, hasAll };
  }, [paginatedUsers, selectedUserIds]);

  const pageRange = useMemo(() => {
    if (filteredUsers.length === 0) {
      return { from: 0, to: 0 };
    }
    const from = (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, filteredUsers.length);
    return { from, to };
  }, [filteredUsers.length, currentPage, pageSize]);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === "prev") {
        return Math.max(1, prev - 1);
      }
      if (direction === "next") {
        return Math.min(totalPages, prev + 1);
      }
      return prev;
    });
  };

  const handleDirectPageChange = (page) => {
    const parsed = Number(page);
    if (Number.isNaN(parsed)) {
      return;
    }
    setCurrentPage(Math.min(Math.max(1, parsed), totalPages));
  };

  const handlePageSizeChange = (event) => {
    const nextSize = Number(event.target.value);
    setPageSize(nextSize);
    setCurrentPage(1);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      user_role: "",
      user_status: "",
      start_date: "",
      end_date: "",
    });
    setSelectedUserIds([]);
  };

  const toggleUserSelection = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (currentPageSelection.hasAll) {
      setSelectedUserIds((prevIds) =>
        prevIds.filter((id) => !currentPageSelection.ids.includes(id))
      );
      return;
    }

    setSelectedUserIds((prevIds) => [
      ...new Set([...prevIds, ...currentPageSelection.ids]),
    ]);
  };

  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedUserIds.length === 0) {
      return;
    }

    const updatedIds = [...selectedUserIds];
    setBulkLoading(true);
    setBulkMessage("");
    try {
      await Promise.all(
        updatedIds.map((userId) =>
          updateUser(userId, { user_status: bulkStatus })
        )
      );
      setBulkMessage(
        `Updated ${updatedIds.length} user${
          updatedIds.length > 1 ? "s" : ""
        } to ${bulkStatus}.`
      );
      await fetchUsers();
      await publishRealtimeMessage(
        "users:updates",
        "user-bulk-status-changed",
        {
          userIds: updatedIds,
          status: bulkStatus,
          updatedBy: userId ?? null,
        },
        userId ? `user-${userId}` : undefined
      );
      await Promise.all(
        updatedIds.map((affectedUserId) =>
          publishRealtimeMessage(
            `users:user-${affectedUserId}`,
            "user-status-changed",
            {
              userId: affectedUserId,
              status: bulkStatus,
              updatedBy: userId ?? null,
            },
            userId ? `user-${userId}` : undefined
          )
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      setBulkMessage("Failed to update user status. Please try again.");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    if (!user) {
      return;
    }
    setRefreshingStatus(true);
    try {
      await updateUserData(user.id);
    } catch (error) {
      console.error("Error refreshing status:", error);
    } finally {
      setRefreshingStatus(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  const SelectionIcon = currentPageSelection.hasAll ? XCircle : UsersRound;
  const selectionLabel = currentPageSelection.hasAll
    ? "Clear Visible"
    : "Select Visible";
  const BulkActionIcon = bulkLoading ? RefreshCcw : ShieldCheck;
  const bulkActionLabel = bulkLoading ? "Updating..." : "Update Status";

  if (!isAdmin && !viewerApproved) {
    return (
      <div className="users-container users-container--restricted">
        <div className="users-restricted-card">
          <h1>Awaiting Approval</h1>
          <p>
            Your account is currently marked as{" "}
            <strong>{user?.user_status ?? "PENDING"}</strong>. Once approved,
            you&apos;ll gain access to the community directory.
          </p>
          <button
            type="button"
            className="refresh-status-btn"
            onClick={handleRefreshStatus}
            disabled={refreshingStatus}
          >
            <RefreshCcw
              size={16}
              aria-hidden="true"
              className={refreshingStatus ? "icon-rotate" : ""}
            />
            <span>{refreshingStatus ? "Refreshing..." : "Refresh Status"}</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <RefreshCcw className="spinner-large icon-rotate" size={48} />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <div>
          <h1>Users Directory</h1>
          <p>
            {isAdmin
              ? "Manage community membership and approvals"
              : "Browse and connect with approved students and alumni"}
          </p>
        </div>
        <div className="users-count">
          <span className="count-badge">{filteredUsers.length}</span>
          <span className="count-label">Visible Users</span>
        </div>
      </div>

      {isAdmin && (
        <div className="users-admin-bar">
          <div className="admin-selection">
            <button
              type="button"
              className="select-toggle-btn"
              onClick={toggleSelectAll}
              disabled={paginatedUsers.length === 0}
            >
              <SelectionIcon size={16} aria-hidden="true" />
              <span>{selectionLabel}</span>
            </button>
            <span className="selection-count">
              {selectedUserIds.length} selected
            </span>
          </div>
          <div className="admin-actions">
            <select
              className="bulk-status-select"
              value={bulkStatus}
              onChange={(event) => setBulkStatus(event.target.value)}
            >
              {STATUS_OPTIONS.map((status) => (
                <option value={status} key={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="bulk-apply-btn"
              onClick={handleBulkStatusUpdate}
              disabled={bulkLoading || selectedUserIds.length === 0}
            >
              <BulkActionIcon
                size={16}
                aria-hidden="true"
                className={bulkLoading ? "icon-rotate" : ""}
              />
              <span>{bulkActionLabel}</span>
            </button>
          </div>
          {bulkMessage && (
            <p className="admin-feedback" role="status">
              {bulkMessage}
            </p>
          )}
        </div>
      )}

      <div className="users-overview">
        <div className="overview-card">
          <span className="overview-label">Students</span>
          <h3>{overview.roleTotals.STUDENT}</h3>
          <p>
            {overview.total
              ? Math.round((overview.roleTotals.STUDENT / overview.total) * 100)
              : 0}
            % of members
          </p>
        </div>
        <div className="overview-card">
          <span className="overview-label">Alumni</span>
          <h3>{overview.roleTotals.ALUMNI}</h3>
          <p>
            {overview.total
              ? Math.round((overview.roleTotals.ALUMNI / overview.total) * 100)
              : 0}
            % of members
          </p>
        </div>
        <div className="overview-card">
          <span className="overview-label">Administrators</span>
          <h3>{overview.roleTotals.ADMIN}</h3>
          <p>Supporting community operations</p>
        </div>
        <div className="overview-card highlight">
          <span className="overview-label">Approval Health</span>
          <h3>{overview.approvalRate}%</h3>
          <p>{overview.pending} pending registrations</p>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search className="search-icon" size={18} aria-hidden="true" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by name, username, or email..."
            className="search-input"
          />
        </div>

        <div className="filters-grid">
          <select
            name="user_role"
            value={filters.user_role}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="ALUMNI">Alumni</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            name="user_status"
            value={filters.user_status}
            onChange={handleFilterChange}
            className="filter-select"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((status) => (
              <option value={status} key={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleFilterChange}
            placeholder="Start Date"
            className="filter-select"
          />

          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
            placeholder="End Date"
            className="filter-select"
          />

          <button
            type="button"
            onClick={clearFilters}
            className="clear-filters-btn"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="no-results">
          <Search className="no-results-icon" size={64} strokeWidth={1.5} />
          <h3>No users found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <div className="users-grid">
            {paginatedUsers.map((entry) => {
              const isSelected = selectedUserIds.includes(entry.id);
              const roleMeta = ROLE_META[entry.user_role] || {
                label: entry.user_role || "Member",
                className: "",
              };
              const statusMeta =
                STATUS_META[entry.user_status] || FALLBACK_STATUS_META;
              const StatusIcon = statusMeta.Icon;
              const roleBadgeClasses = ["role-badge", roleMeta.className]
                .filter(Boolean)
                .join(" ");
              const statusBadgeClasses = `status-badge status-badge--${
                statusMeta.tone || "neutral"
              }`;
              const statusCalloutClass = `user-status-callout user-status-callout--${
                statusMeta.tone || "neutral"
              }`;
              return (
                <div
                  key={entry.id}
                  className={`user-card ${
                    isAdmin && isSelected ? "selected" : ""
                  }`}
                  onClick={() => handleUserClick(entry.id)}
                >
                  {isAdmin && (
                    <label
                      className="user-select-checkbox"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleUserSelection(entry.id)}
                      />
                    </label>
                  )}
                  <div className="user-card-header">
                    <div className="user-avatar-large">
                      {entry.first_name?.[0]}
                      {entry.last_name?.[0]}
                    </div>
                    <div className="user-badges">
                      <span className={roleBadgeClasses}>{roleMeta.label}</span>
                      <span className={statusBadgeClasses}>
                        <StatusIcon
                          size={14}
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                        <span>{statusMeta.label}</span>
                      </span>
                    </div>
                  </div>

                  <div className="user-card-body">
                    <div className={statusCalloutClass}>
                      <div className="status-callout-icon">
                        <StatusIcon
                          size={18}
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="status-callout-copy">
                        <p>{statusMeta.label}</p>
                        <span>{statusMeta.tagline}</span>
                      </div>
                    </div>
                    <h3>
                      {entry.first_name} {entry.last_name}
                    </h3>
                    <p className="user-username">@{entry.username}</p>
                    <p className="user-email">{entry.email}</p>

                    {(entry.start_date || entry.end_date) && (
                      <div className="user-dates">
                        {entry.start_date && (
                          <div className="date-item">
                            <span className="date-label">Started:</span>
                            <span className="date-value">
                              {new Date(entry.start_date).getFullYear()}
                            </span>
                          </div>
                        )}
                        {entry.end_date && (
                          <div className="date-item">
                            <span className="date-label">Ended:</span>
                            <span className="date-value">
                              {new Date(entry.end_date).getFullYear()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="user-card-footer">
                    <button type="button" className="view-profile-btn">
                      <span>View Profile</span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredUsers.length > pageSize && (
            <div className="pagination-controls">
              <div className="pagination-info">
                <span className="pagination-text">
                  Showing {pageRange.from}-{pageRange.to} of{" "}
                  {filteredUsers.length} users
                </span>
              </div>

              <div className="pagination-nav">
                <button
                  type="button"
                  className="pagination-btn pagination-btn--prev"
                  onClick={() => handlePageChange("prev")}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                  <span>Previous</span>
                </button>

                <div className="pagination-pages">
                  <span className="page-label">Page</span>
                  <input
                    type="number"
                    className="page-input"
                    value={currentPage}
                    onChange={(e) => handleDirectPageChange(e.target.value)}
                    min={1}
                    max={totalPages}
                    aria-label="Current page"
                  />
                  <span className="page-separator">of</span>
                  <span className="page-total">{totalPages}</span>
                </div>

                <button
                  type="button"
                  className="pagination-btn pagination-btn--next"
                  onClick={() => handlePageChange("next")}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="pagination-size">
                <label htmlFor="page-size-select" className="page-size-label">
                  Per page:
                </label>
                <select
                  id="page-size-select"
                  className="page-size-select"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  aria-label="Items per page"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Users;
