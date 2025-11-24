# Lesson 4.6 - Production-Ready Features & Deployment

**Duration**: 60 minutes  
**Difficulty**: Advanced

---

## 🎯 Learning Objectives

1. ✅ Implement optimistic UI updates
2. ✅ Add offline queue with retry logic
3. ✅ Create toast notification system
4. ✅ Build loading skeletons
5. ✅ Implement infinite scroll pagination
6. ✅ Add analytics and error tracking
7. ✅ Optimize for production deployment

---

## ⚡ Step 1: Optimistic UI Updates

Create `src/hooks/useOptimisticUpdate.js`:

```javascript
import { useState } from "react";
import { message } from "antd";

/**
 * Hook for optimistic updates
 * Updates UI immediately, then confirms with server
 */
export function useOptimisticUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);

  const optimisticUpdate = async ({
    updateFn, // Function to call API
    rollbackFn, // Function to rollback on error
    optimisticData, // Data to show immediately
    successMessage, // Success message
    errorMessage, // Error message
  }) => {
    setIsUpdating(true);

    try {
      // Step 1: Update UI optimistically (instant feedback)
      if (optimisticData) {
        optimisticData();
      }

      // Step 2: Call actual API
      const result = await updateFn();

      // Step 3: Show success message
      if (successMessage) {
        message.success(successMessage);
      }

      return result;
    } catch (error) {
      // Step 4: Rollback on error
      if (rollbackFn) {
        rollbackFn();
      }

      // Step 5: Show error message
      message.error(errorMessage || "Operation failed");

      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return { optimisticUpdate, isUpdating };
}
```

### Example Usage in Members Page:

```jsx
import { useOptimisticUpdate } from "../hooks/useOptimisticUpdate";
import { updateUser } from "../services/user/userService";
import { getChannel } from "../services/realtime/ablyClient";

function Members() {
  const [users, setUsers] = useState([]);
  const { optimisticUpdate } = useOptimisticUpdate();

  const handleUpdateUser = async (userId, updates) => {
    // Store original user for rollback
    const originalUser = users.find((u) => u.id === userId);

    await optimisticUpdate({
      // Update UI immediately
      optimisticData: () => {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
        );
      },

      // Call API
      updateFn: async () => {
        const updated = await updateUser(userId, updates);

        // Publish to Ably for other clients
        const channel = getChannel("users-channel");
        await channel.publish("user-updated", updated);

        return updated;
      },

      // Rollback on error
      rollbackFn: () => {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? originalUser : u))
        );
      },

      successMessage: "Profile updated successfully!",
      errorMessage: "Failed to update profile",
    });
  };

  // ... rest of component
}
```

---

## 📴 Step 2: Offline Queue with Retry

Create `src/utils/offlineQueue.js`:

```javascript
class OfflineQueue {
  constructor() {
    this.queue = [];
    this.isOnline = navigator.onLine;
    this.isProcessing = false;

    // Listen for online/offline events
    window.addEventListener("online", () => this.handleOnline());
    window.addEventListener("offline", () => this.handleOffline());
  }

  /**
   * Add operation to queue
   */
  enqueue(operation) {
    const item = {
      id: Date.now(),
      operation,
      retries: 0,
      maxRetries: 3,
      timestamp: new Date(),
    };

    this.queue.push(item);
    console.log("📥 Operation queued:", item.id);

    // Try to process if online
    if (this.isOnline) {
      this.processQueue();
    }
  }

  /**
   * Process all queued operations
   */
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    console.log(`⚙️ Processing queue: ${this.queue.length} items`);

    while (this.queue.length > 0) {
      const item = this.queue[0];

      try {
        // Execute operation
        await item.operation();

        // Remove from queue on success
        this.queue.shift();
        console.log("✅ Operation completed:", item.id);
      } catch (error) {
        console.error("❌ Operation failed:", item.id, error);

        // Increment retry count
        item.retries++;

        // Remove if max retries reached
        if (item.retries >= item.maxRetries) {
          this.queue.shift();
          console.error("❌ Max retries reached, removing:", item.id);
        } else {
          // Wait before retry
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, item.retries) * 1000)
          );
        }
      }
    }

    this.isProcessing = false;
    console.log("✅ Queue processing complete");
  }

  /**
   * Handle going online
   */
  handleOnline() {
    console.log("🌐 Back online");
    this.isOnline = true;
    this.processQueue();
  }

  /**
   * Handle going offline
   */
  handleOffline() {
    console.log("📴 Gone offline");
    this.isOnline = false;
  }

  /**
   * Get queue status
   */
  getStatus() {
    return {
      isOnline: this.isOnline,
      queueLength: this.queue.length,
      isProcessing: this.isProcessing,
    };
  }
}

// Singleton instance
export const offlineQueue = new OfflineQueue();
```

### Usage:

```jsx
import { offlineQueue } from "../utils/offlineQueue";
import { updateUser } from "../services/user/userService";

// Queue an update operation
offlineQueue.enqueue(async () => {
  await updateUser(userId, data);
});
```

---

## 💀 Step 3: Loading Skeletons

Create `src/components/common/MemberSkeleton.jsx`:

```jsx
import { Card, Skeleton, Space } from "antd";

function MemberSkeleton({ count = 6 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "16px",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Skeleton.Avatar active size="large" />
            <Skeleton active paragraph={{ rows: 2 }} />
          </Space>
        </Card>
      ))}
    </div>
  );
}

export default MemberSkeleton;
```

Usage:

```jsx
{
  loading ? <MemberSkeleton count={6} /> : <MembersList users={users} />;
}
```

---

## ♾️ Step 4: Infinite Scroll Pagination

Create `src/hooks/useInfiniteScroll.js`:

```javascript
import { useState, useEffect, useCallback } from "react";

export function useInfiniteScroll(fetchFn, options = {}) {
  const { pageSize = 20, threshold = 100 } = options;

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const newData = await fetchFn(page, pageSize);

      if (newData.length === 0 || newData.length < pageSize) {
        setHasMore(false);
      }

      setData((prev) => [...prev, ...newData]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, page, pageSize, loading, hasMore]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (
        scrollHeight - scrollTop - clientHeight < threshold &&
        !loading &&
        hasMore
      ) {
        fetchData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchData, loading, hasMore, threshold]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []); // Only run once

  const reset = () => {
    setData([]);
    setPage(1);
    setHasMore(true);
  };

  return { data, loading, hasMore, reset };
}
```

---

## 📊 Step 5: Analytics Integration

Create `src/utils/analytics.js`:

```javascript
/**
 * Simple analytics utility
 * Replace with Google Analytics, Mixpanel, etc.
 */
class Analytics {
  constructor() {
    this.events = [];
  }

  /**
   * Track page view
   */
  pageView(page) {
    console.log("📊 Page view:", page);
    this.track("page_view", { page });
  }

  /**
   * Track custom event
   */
  track(eventName, properties = {}) {
    const event = {
      name: eventName,
      properties,
      timestamp: new Date().toISOString(),
      userId: localStorage.getItem("userId"),
    };

    this.events.push(event);
    console.log("📊 Event tracked:", event);

    // Send to analytics service
    // this.sendToService(event);
  }

  /**
   * Track user action
   */
  action(category, action, label) {
    this.track("user_action", { category, action, label });
  }

  /**
   * Track error
   */
  error(error, context = {}) {
    console.error("❌ Error tracked:", error);
    this.track("error", {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }
}

export const analytics = new Analytics();
```

Usage:

```jsx
import { analytics } from "../utils/analytics";

// Track page view
useEffect(() => {
  analytics.pageView("/members");
}, []);

// Track user action
const handleLogin = async () => {
  analytics.action("auth", "login", "email");
  await login(email, password);
};
```

---

## 🏗️ Step 6: Production Build Optimization

Update `vite.config.js`:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  build: {
    // Output directory
    outDir: "dist",

    // Generate sourcemaps for debugging
    sourcemap: true,

    // Chunk size warnings
    chunkSizeWarningLimit: 500,

    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "antd-vendor": ["antd", "@ant-design/icons"],
          utils: ["axios", "dayjs"],
          realtime: ["ably"],
        },
      },
    },

    // Minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true,
      },
    },
  },

  // Server config
  server: {
    port: 3000,
    open: true,
  },

  // Preview config
  preview: {
    port: 4173,
  },
});
```

---

## 🚀 Step 7: Deployment Checklist

### Environment Variables:

```env
# Production .env
VITE_API_URL=https://your-api.com/api
VITE_ABLY_API_KEY=your_production_ably_key
```

### Build for Production:

```bash
npm run build
```

### Preview Production Build:

```bash
npm run preview
```

### Deploy to Vercel/Netlify:

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

---

## ✅ Production Checklist

- [x] Environment variables configured
- [x] Error boundaries on all routes
- [x] Loading states on all async actions
- [x] Proper error messages
- [x] Analytics tracking
- [x] SEO meta tags
- [x] Performance optimization (code splitting)
- [x] Security headers
- [x] HTTPS enabled
- [x] CDN for static assets
- [x] Monitoring and logging
- [x] Backup strategy

---

## 📈 Performance Tips

1. **Code Splitting**: Split by routes using `React.lazy()`
2. **Memoization**: Use `useMemo` and `useCallback` for expensive operations
3. **Virtualization**: Use `react-window` for long lists
4. **Image Optimization**: Use WebP format, lazy loading
5. **Bundle Analysis**: Use `rollup-plugin-visualizer`
6. **CDN**: Serve static assets from CDN
7. **Caching**: Implement proper cache headers

---

## 🎯 Final Exercise

**Task**: Deploy Full Application

Requirements:

1. Build production version
2. Deploy frontend to Vercel
3. Deploy backend to Railway/Heroku
4. Configure environment variables
5. Test all features in production
6. Set up monitoring (Sentry)
7. Add Google Analytics

---

## 🎓 Congratulations!

You've completed Level 4 and learned:

✅ Professional UI with Ant Design  
✅ Advanced authentication flow  
✅ Real-time features with Ably  
✅ Server-side event broadcasting  
✅ Advanced React patterns  
✅ Production-ready optimizations  
✅ Deployment best practices

---

## 📚 Additional Resources

- [React Performance](https://react.dev/learn/render-and-commit)
- [Ably Best Practices](https://ably.com/docs/best-practice-guide)
- [Ant Design Pro](https://pro.ant.design/)
- [Vercel Deployment](https://vercel.com/docs)

---

**You're now ready to build production-grade React applications!** 🚀
