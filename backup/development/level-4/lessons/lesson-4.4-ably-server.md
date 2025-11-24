# Lesson 4.4 - Server-Side Ably Integration (Strapi)

**Duration**: 70 minutes  
**Difficulty**: Advanced

---

## 🎯 Learning Objectives

1. ✅ Install Ably SDK in Strapi backend
2. ✅ Create lifecycle hooks to broadcast events
3. ✅ Publish user CRUD operations to Ably
4. ✅ Secure server-side publishing
5. ✅ Handle errors and retries
6. ✅ Build admin notification system

---

## 🔧 Step 1: Install Ably in Strapi

```bash
cd college-app-server  # Your Strapi backend
npm install ably
```

Add Ably key to `.env`:

```env
ABLY_API_KEY=your_ably_api_key_here
```

---

## 📡 Step 2: Create Ably Service

Create `src/services/ably.js`:

```javascript
const Ably = require("ably");

let ablyClient = null;

/**
 * Get or create Ably REST client (Singleton)
 * REST API is used on server-side (not Realtime)
 */
const getAblyClient = () => {
  if (!ablyClient) {
    const apiKey = process.env.ABLY_API_KEY;

    if (!apiKey) {
      throw new Error("ABLY_API_KEY not configured");
    }

    ablyClient = new Ably.Rest({ key: apiKey });
    console.log("✅ Ably REST client initialized");
  }

  return ablyClient;
};

/**
 * Publish message to Ably channel
 * @param {string} channelName - Channel name
 * @param {string} eventName - Event name
 * @param {Object} data - Data to publish
 */
const publish = async (channelName, eventName, data) => {
  try {
    const ably = getAblyClient();
    const channel = ably.channels.get(channelName);

    await channel.publish(eventName, data);

    console.log(`📡 Published to ${channelName}:${eventName}`, {
      id: data.id,
      type: eventName,
    });

    return true;
  } catch (error) {
    console.error("❌ Ably publish error:", error);
    // Don't throw - we don't want to break the main operation
    return false;
  }
};

/**
 * Sanitize user data before broadcasting
 * Remove sensitive fields
 */
const sanitizeUserData = (user) => {
  const { password, resetPasswordToken, confirmationToken, ...safeData } = user;

  return {
    id: safeData.id,
    username: safeData.username,
    email: safeData.email,
    first_name: safeData.first_name,
    last_name: safeData.last_name,
    user_role: safeData.user_role,
    user_status: safeData.user_status,
    // Add computed role
    role: safeData.user_role || "STUDENT",
  };
};

module.exports = {
  getAblyClient,
  publish,
  sanitizeUserData,
};
```

---

## 🔄 Step 3: Create User Lifecycle Hooks

Create `src/api/user/content-types/user/lifecycles.js`:

```javascript
const { publish, sanitizeUserData } = require("../../../../services/ably");

module.exports = {
  /**
   * After a user is created
   */
  async afterCreate(event) {
    const { result } = event;

    try {
      // Sanitize data
      const safeData = sanitizeUserData(result);

      // Publish to Ably
      await publish("users-channel", "user-created", safeData);

      console.log("✅ User created event published:", safeData.username);
    } catch (error) {
      console.error("❌ Error publishing user-created event:", error);
    }
  },

  /**
   * After a user is updated
   */
  async afterUpdate(event) {
    const { result } = event;

    try {
      // Sanitize data
      const safeData = sanitizeUserData(result);

      // Publish to Ably
      await publish("users-channel", "user-updated", safeData);

      console.log("✅ User updated event published:", safeData.username);
    } catch (error) {
      console.error("❌ Error publishing user-updated event:", error);
    }
  },

  /**
   * After a user is deleted
   */
  async afterDelete(event) {
    const { result } = event;

    try {
      // Sanitize data
      const safeData = sanitizeUserData(result);

      // Publish to Ably
      await publish("users-channel", "user-deleted", safeData);

      console.log("✅ User deleted event published:", safeData.username);
    } catch (error) {
      console.error("❌ Error publishing user-deleted event:", error);
    }
  },

  /**
   * After multiple users are deleted
   */
  async afterDeleteMany(event) {
    const { result } = event;

    try {
      if (result && result.count > 0) {
        await publish("users-channel", "users-bulk-deleted", {
          count: result.count,
        });

        console.log(`✅ Bulk delete event published: ${result.count} users`);
      }
    } catch (error) {
      console.error("❌ Error publishing bulk delete event:", error);
    }
  },
};
```

---

## 🔐 Step 4: Add Security Validation

Update `src/services/ably.js` with security checks:

```javascript
/**
 * Validate data before publishing
 * Ensure required fields exist and are valid
 */
const validatePublishData = (eventName, data) => {
  // Check required fields based on event type
  if (eventName === "user-created" || eventName === "user-updated") {
    if (!data.id || !data.username) {
      throw new Error("Invalid user data: missing id or username");
    }
  }

  // Check data size (Ably has 65KB limit per message)
  const dataSize = JSON.stringify(data).length;
  if (dataSize > 65000) {
    throw new Error("Data too large to publish");
  }

  return true;
};

/**
 * Publish with retry logic
 */
const publishWithRetry = async (channelName, eventName, data, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      // Validate data
      validatePublishData(eventName, data);

      // Attempt to publish
      const ably = getAblyClient();
      const channel = ably.channels.get(channelName);
      await channel.publish(eventName, data);

      console.log(
        `📡 Published to ${channelName}:${eventName} (attempt ${i + 1})`
      );
      return true;
    } catch (error) {
      console.error(`❌ Publish attempt ${i + 1} failed:`, error.message);

      // If last retry, give up
      if (i === retries - 1) {
        console.error("❌ All publish retries failed");
        return false;
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }

  return false;
};

module.exports = {
  getAblyClient,
  publish,
  publishWithRetry,
  sanitizeUserData,
  validatePublishData,
};
```

---

## 📊 Step 5: Create Admin Notification System

Create `src/api/notification/controllers/notification.js`:

```javascript
const { publish } = require("../../../services/ably");

module.exports = {
  /**
   * Send admin notification
   * POST /api/notifications/admin
   */
  async sendAdminNotification(ctx) {
    try {
      const { title, message, type, data } = ctx.request.body;

      // Validate input
      if (!title || !message) {
        return ctx.badRequest("Title and message are required");
      }

      // Create notification object
      const notification = {
        id: Date.now(),
        title,
        message,
        type: type || "info", // info, success, warning, error
        data: data || {},
        timestamp: new Date().toISOString(),
      };

      // Publish to admin channel
      await publish("admin-channel", "notification", notification);

      ctx.send({
        success: true,
        notification,
      });
    } catch (error) {
      console.error("Error sending admin notification:", error);
      ctx.internalServerError("Failed to send notification");
    }
  },

  /**
   * Get real-time stats
   * GET /api/notifications/stats
   */
  async getStats(ctx) {
    try {
      // Get total users
      const totalUsers = await strapi.db
        .query("plugin::users-permissions.user")
        .count();

      // Get users by role
      const students = await strapi.db
        .query("plugin::users-permissions.user")
        .count({
          where: { user_role: "STUDENT" },
        });

      const alumni = await strapi.db
        .query("plugin::users-permissions.user")
        .count({
          where: { user_role: "ALUMNI" },
        });

      const admins = await strapi.db
        .query("plugin::users-permissions.user")
        .count({
          where: { user_role: "ADMIN" },
        });

      const stats = {
        totalUsers,
        students,
        alumni,
        admins,
        timestamp: new Date().toISOString(),
      };

      // Publish stats update
      await publish("admin-channel", "stats-updated", stats);

      ctx.send(stats);
    } catch (error) {
      console.error("Error getting stats:", error);
      ctx.internalServerError("Failed to get stats");
    }
  },
};
```

Create route: `src/api/notification/routes/notification.js`:

```javascript
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/notifications/admin",
      handler: "notification.sendAdminNotification",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/notifications/stats",
      handler: "notification.getStats",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

---

## 🧪 Step 6: Test Server-Side Events

### Start Strapi:

```bash
npm run develop
```

### Test by Creating a User:

```bash
curl -X POST http://localhost:1337/api/auth/local/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### Check Strapi Logs:

You should see:

```
✅ User created event published: testuser
📡 Published to users-channel:user-created
```

---

## ✅ What You've Learned

1. ✅ Installed Ably REST SDK in Strapi
2. ✅ Created lifecycle hooks for user CRUD operations
3. ✅ Implemented data sanitization for security
4. ✅ Added retry logic for failed publishes
5. ✅ Built admin notification system
6. ✅ Created real-time stats endpoint

---

## 🔒 Security Best Practices

1. **Use REST API on Server**: Never use Realtime API in backend (security risk)
2. **Sanitize Data**: Remove passwords, tokens, sensitive fields
3. **Validate Data**: Check required fields before publishing
4. **Error Handling**: Don't break main operations if Ably fails
5. **Rate Limiting**: Prevent abuse with Strapi middleware
6. **Channel Permissions**: Configure Ably dashboard for channel access

---

## 🎯 Practice Exercise

**Task**: Add Lifecycle Hooks for Other Content Types

Requirements:

1. Create a "Post" content type in Strapi
2. Add lifecycle hooks to publish post events
3. Subscribe to post events in React client
4. Display live post updates

---

## ➡️ Next Lesson

[Lesson 5: Advanced React Patterns](./lesson-5-react-patterns.md)

Learn how to:

- Create custom hooks for common patterns
- Implement error boundaries
- Optimize performance with memoization
- Add code splitting and lazy loading
