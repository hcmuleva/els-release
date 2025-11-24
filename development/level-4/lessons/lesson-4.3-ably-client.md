# Lesson 4.3 - Ably Client-Side Real-Time Features

**Duration**: 75 minutes  
**Difficulty**: Advanced

---

## 🎯 Learning Objectives

1. ✅ Understand WebSocket vs HTTP communication
2. ✅ Setup Ably Realtime client in React
3. ✅ Subscribe to channels and events
4. ✅ Display live user updates
5. ✅ Implement presence tracking (online users)
6. ✅ Handle connection states

---

## 🌐 Understanding Real-Time Communication

### HTTP (Traditional)

- **Request-Response**: Client requests → Server responds
- **One-way**: Client initiates communication
- **Polling**: Client repeatedly asks "Any updates?"
- **Inefficient**: Multiple requests for updates

### WebSocket (Real-Time)

- **Persistent Connection**: Always connected
- **Two-way**: Server can push updates to client
- **Event-driven**: Instant updates when data changes
- **Efficient**: Single connection, multiple messages

### Ably Pub/Sub Model

```
Publisher (Server/Client) → Channel → Subscribers (All Clients)
```

**Use Cases**:

- Live notifications
- Real-time chat
- Online presence
- Collaborative editing
- Live dashboards

---

## 🚀 Step 1: Get Ably API Key

1. Sign up at https://ably.com (free tier)
2. Create a new app
3. Copy your API key
4. Add to `.env`:

```env
VITE_API_URL=http://localhost:1337/api
VITE_ABLY_API_KEY=your_ably_key_here
```

---

## 🔧 Step 2: Create Ably Client Service

Create `src/services/realtime/ablyClient.js`:

```javascript
import * as Ably from "ably";

const ABLY_KEY = import.meta.env.VITE_ABLY_API_KEY;

let ablyInstance = null;

/**
 * Get or create Ably Realtime instance (Singleton)
 */
export const getAblyClient = () => {
  if (!ablyInstance) {
    ablyInstance = new Ably.Realtime({
      key: ABLY_KEY,
      clientId: `user-${Date.now()}`, // Unique client ID
      echoMessages: false, // Don't receive our own messages
    });

    // Connection state logging
    ablyInstance.connection.on("connected", () => {
      console.log("✅ Ably connected");
    });

    ablyInstance.connection.on("disconnected", () => {
      console.log("❌ Ably disconnected");
    });

    ablyInstance.connection.on("failed", (err) => {
      console.error("Ably connection failed:", err);
    });
  }

  return ablyInstance;
};

/**
 * Disconnect Ably client
 */
export const disconnectAbly = () => {
  if (ablyInstance) {
    ablyInstance.close();
    ablyInstance = null;
    console.log("Ably disconnected");
  }
};

/**
 * Get a specific channel
 * @param {string} channelName - Name of the channel
 * @returns {Ably.RealtimeChannel}
 */
export const getChannel = (channelName) => {
  const ably = getAblyClient();
  return ably.channels.get(channelName);
};
```

---

## 🎣 Step 3: Create useRealtime Custom Hook

Create `src/hooks/useRealtime.js`:

```javascript
import { useEffect, useCallback } from "react";
import { getChannel } from "../services/realtime/ablyClient";

/**
 * Custom hook for subscribing to Ably channels
 * @param {string} channelName - Channel to subscribe to
 * @param {string} eventName - Event name to listen for
 * @param {Function} callback - Function to call when event received
 */
export function useRealtime(channelName, eventName, callback) {
  // Wrap callback in useCallback to prevent re-subscriptions
  const stableCallback = useCallback(callback, []);

  useEffect(() => {
    if (!channelName || !eventName) return;

    const channel = getChannel(channelName);

    // Subscribe to event
    channel.subscribe(eventName, stableCallback);

    console.log(`📡 Subscribed to ${channelName}:${eventName}`);

    // Cleanup: Unsubscribe on unmount
    return () => {
      channel.unsubscribe(eventName, stableCallback);
      console.log(`🔌 Unsubscribed from ${channelName}:${eventName}`);
    };
  }, [channelName, eventName, stableCallback]);
}

/**
 * Custom hook for presence tracking
 * @param {string} channelName - Channel name
 * @param {Object} userData - User data to attach to presence
 * @returns {Array} Array of present members
 */
export function usePresence(channelName, userData) {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!channelName) return;

    const channel = getChannel(channelName);
    const presence = channel.presence;

    // Enter presence
    presence.enter(userData);

    // Subscribe to presence events
    presence.subscribe("enter", (member) => {
      console.log("User entered:", member.data);
      setMembers((prev) => [...prev, member]);
    });

    presence.subscribe("leave", (member) => {
      console.log("User left:", member.data);
      setMembers((prev) => prev.filter((m) => m.clientId !== member.clientId));
    });

    // Get current members
    presence.get((err, members) => {
      if (!err) {
        setMembers(members);
      }
    });

    // Cleanup: Leave presence
    return () => {
      presence.leave();
    };
  }, [channelName]);

  return members;
}
```

---

## 🔔 Step 4: Create Real-Time Notification Component

Create `src/components/realtime/NotificationBell.jsx`:

```jsx
import { useState, useEffect } from "react";
import { Badge, Dropdown, Button, List, Typography, Empty } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useRealtime } from "../../hooks/useRealtime";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Text } = Typography;

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Subscribe to user events
  useRealtime("users-channel", "user-created", (message) => {
    const notification = {
      id: Date.now(),
      type: "user-created",
      message: `New member joined: ${message.data.username}`,
      data: message.data,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  });

  useRealtime("users-channel", "user-updated", (message) => {
    const notification = {
      id: Date.now(),
      type: "user-updated",
      message: `${message.data.username} updated their profile`,
      data: message.data,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const menuItems = {
    items: [
      {
        key: "header",
        label: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Text strong>Notifications</Text>
            {unreadCount > 0 && (
              <Button type="link" size="small" onClick={markAllRead}>
                Mark all read
              </Button>
            )}
          </div>
        ),
      },
      {
        key: "list",
        label: (
          <div
            style={{ maxHeight: "400px", overflowY: "auto", width: "350px" }}
          >
            {notifications.length > 0 ? (
              <List
                dataSource={notifications}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      background: item.read ? "transparent" : "#f0f5ff",
                      padding: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <List.Item.Meta
                      title={item.message}
                      description={dayjs(item.timestamp).fromNow()}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No notifications" />
            )}
          </div>
        ),
      },
      {
        key: "footer",
        label: notifications.length > 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "8px 0",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Button type="link" size="small" onClick={clearAll}>
              Clear all
            </Button>
          </div>
        ),
      },
    ],
  };

  return (
    <Dropdown menu={menuItems} trigger={["click"]} placement="bottomRight">
      <Badge count={unreadCount} offset={[-5, 5]}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: "20px" }} />}
          size="large"
        />
      </Badge>
    </Dropdown>
  );
}

export default NotificationBell;
```

---

## 👥 Step 5: Add Online Presence Indicator

Create `src/components/realtime/OnlineIndicator.jsx`:

```jsx
import { Badge } from "antd";
import { usePresence } from "../../hooks/useRealtime";

function OnlineIndicator({ channelName }) {
  const members = usePresence(channelName, {
    username: "Current User",
    // Add user data from auth context
  });

  return (
    <Badge
      count={members.length}
      showZero
      style={{ backgroundColor: "#52c41a" }}
      title={`${members.length} users online`}
    >
      <span style={{ marginRight: "8px" }}>🟢 Online</span>
    </Badge>
  );
}

export default OnlineIndicator;
```

---

## 🔗 Step 6: Update Members Page with Real-Time

Update `src/pages/Members.jsx` to add real-time updates:

```jsx
import { useState, useEffect } from "react";
import { Table, Input, Select, Card, Space, Tag, message } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import { useRealtime } from "../hooks/useRealtime";
import { getAllUsers } from "../services/user/userService";
import { getChannel } from "../services/realtime/ablyClient";

const { Search } = Input;

function Members() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Fetch initial data
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Real-time: New user created
  useRealtime("users-channel", "user-created", (msg) => {
    console.log("New user created:", msg.data);
    setUsers((prev) => [...prev, msg.data]);
    message.success(`${msg.data.username} joined!`);
  });

  // Real-time: User updated
  useRealtime("users-channel", "user-updated", (msg) => {
    console.log("User updated:", msg.data);
    setUsers((prev) =>
      prev.map((user) =>
        user.id === msg.data.id ? { ...user, ...msg.data } : user
      )
    );
  });

  // Real-time: User deleted
  useRealtime("users-channel", "user-deleted", (msg) => {
    console.log("User deleted:", msg.data);
    setUsers((prev) => prev.filter((user) => user.id !== msg.data.id));
    message.info(`${msg.data.username} left`);
  });

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={
            role === "ADMIN" ? "red" : role === "ALUMNI" ? "blue" : "green"
          }
        >
          {role}
        </Tag>
      ),
    },
  ];

  return (
    <Card
      title="Members Directory"
      extra={
        <Space>
          <Search
            placeholder="Search members..."
            allowClear
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={roleFilter}
            style={{ width: 120 }}
            onChange={setRoleFilter}
          >
            <Select.Option value="ALL">All Roles</Select.Option>
            <Select.Option value="STUDENT">Students</Select.Option>
            <Select.Option value="ALUMNI">Alumni</Select.Option>
            <Select.Option value="ADMIN">Admins</Select.Option>
          </Select>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
}

export default Members;
```

---

## ✅ What You've Learned

1. ✅ Setup Ably Realtime client with singleton pattern
2. ✅ Created `useRealtime` custom hook for subscriptions
3. ✅ Implemented live notifications with NotificationBell
4. ✅ Added presence tracking (online users)
5. ✅ Updated Members page with real-time user updates
6. ✅ Handled connection states

---

## 🎯 Practice Exercise

**Task**: Create a Real-Time Activity Feed

Requirements:

- Show list of recent activities
- Subscribe to all user events (created, updated, deleted)
- Display activity type with icons
- Show timestamp (relative time)
- Auto-scroll to new activities

---

## ➡️ Next Lesson

[Lesson 4: Server-Side Ably Integration](./lesson-4-ably-server.md)

Learn how to:

- Install Ably in Strapi backend
- Create lifecycle hooks to publish events
- Secure server-side broadcasting
- Build admin notification system
