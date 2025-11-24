import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
} from "../../service/auth/authService";
import { getUserById } from "../../service/user/userService";
import {
  disconnectRealtime,
  getRealtimeChannel,
} from "../../service/realtime/ablyClient";

const deriveEffectiveRole = (user) => {
  if (!user) {
    return user;
  }

  if (user.effective_role) {
    return user;
  }

  if (user.user_role === "ADMIN") {
    return {
      ...user,
      effective_role: "ADMIN",
      display_role: "ADMIN",
    };
  }

  if (user.end_date) {
    const end = new Date(user.end_date);
    if (!Number.isNaN(end.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const derivedRole = end < today ? "ALUMNI" : "STUDENT";
      return {
        ...user,
        effective_role: derivedRole,
        display_role: derivedRole,
      };
    }
  }

  const fallbackRole = user.user_role || "STUDENT";

  return {
    ...user,
    effective_role: fallbackRole,
    display_role: fallbackRole,
  };
};

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage and immediately refresh from the API when possible
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedAuth = localStorage.getItem("isAuthenticated");
        const token = localStorage.getItem("token");

        if (storedAuth === "true" && storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          setUser(deriveEffectiveRole(parsedUser));
          setIsAuthenticated(true);

          try {
            const freshUser = deriveEffectiveRole(
              await getUserById(parsedUser.id)
            );
            localStorage.setItem("user", JSON.stringify(freshUser));
            setUser(freshUser);
          } catch (refreshError) {
            console.error("Error refreshing user on init:", refreshError);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (identifier, password) => {
    try {
      // Call login API
      const response = await loginService(identifier, password);

      // Store token
      if (response.jwt) {
        localStorage.setItem("token", response.jwt);
      }

      // Fetch full user data using user ID
      if (response.user && response.user.id) {
        const userData = deriveEffectiveRole(
          await getUserById(response.user.id)
        );

        // Store user data and auth state
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isAuthenticated", "true");

        setUser(userData);
        setIsAuthenticated(true);

        return { success: true, user: userData };
      }

      throw new Error("Invalid response from server");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Call register API
      const response = await registerService(userData);

      // Store token
      if (response.jwt) {
        localStorage.setItem("token", response.jwt);
      }

      // Fetch full user data using user ID
      if (response.user && response.user.id) {
        const fullUserData = deriveEffectiveRole(
          await getUserById(response.user.id)
        );

        // Store user data and auth state
        localStorage.setItem("user", JSON.stringify(fullUserData));
        localStorage.setItem("isAuthenticated", "true");

        setUser(fullUserData);
        setIsAuthenticated(true);

        return { success: true, user: fullUserData };
      }

      throw new Error("Invalid response from server");
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setIsAuthenticated(false);
    disconnectRealtime();
  };

  const updateUserData = useCallback(async (userId) => {
    try {
      const userData = deriveEffectiveRole(await getUserById(userId));
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    let channel;
    let isMounted = true;

    const userId = user?.id;

    const subscribeToRealtime = async () => {
      if (!userId) {
        await disconnectRealtime();
        return;
      }

      try {
        channel = await getRealtimeChannel(
          `users:user-${userId}`,
          `user-${userId}`
        );
        if (!channel) {
          return;
        }

        const handleMessage = async (message) => {
          if (!isMounted) {
            return;
          }

          const targetId = message?.data?.userId || message?.data?.id;
          if (targetId && targetId !== userId) {
            return;
          }

          try {
            await updateUserData(userId);
          } catch (error) {
            console.error("Realtime user refresh failed:", error);
          }
        };

        channel.subscribe("user-status-changed", handleMessage);
        channel.subscribe("profile-updated", handleMessage);

        return () => {
          channel.unsubscribe("user-status-changed", handleMessage);
          channel.unsubscribe("profile-updated", handleMessage);
        };
      } catch (error) {
        console.error("Failed to subscribe to Ably user channel:", error);
      }
    };

    const cleanupPromise = subscribeToRealtime();

    return () => {
      isMounted = false;
      cleanupPromise
        ?.then((cleanup) => {
          if (typeof cleanup === "function") {
            cleanup();
          }
        })
        .catch((error) => {
          console.error("Error during Ably cleanup:", error);
        });
    };
  }, [user?.id, updateUserData]);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
