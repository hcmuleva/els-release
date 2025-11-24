import Ably from "ably";

let realtimeInstance = null;
let connectingPromise = null;
let currentClientId = null;

const waitForConnection = (instance) =>
  new Promise((resolve, reject) => {
    const handleConnected = () => {
      cleanup();
      resolve(instance);
    };

    const handleFailure = (stateChange) => {
      cleanup();
      instance.close();
      const reason = stateChange?.reason;
      reject(
        reason instanceof Error ? reason : new Error("Ably connection failed")
      );
    };

    const cleanup = () => {
      instance.connection.off("connected", handleConnected);
      instance.connection.off("failed", handleFailure);
      instance.connection.off("suspended", handleFailure);
    };

    instance.connection.once("connected", handleConnected);
    instance.connection.once("failed", handleFailure);
    instance.connection.once("suspended", handleFailure);

    if (instance.connection.state === "connected") {
      handleConnected();
    }
  });

const createRealtimeInstance = async (clientId) => {
  const apiKey = import.meta.env.VITE_ABLY_API_KEY;
  if (!apiKey) {
    console.warn("Ably API key is missing. Real-time features are disabled.");
    return null;
  }

  const instance = new Ably.Realtime({
    key: apiKey,
    clientId,
    closeOnUnload: true,
    echoMessages: false,
  });

  return waitForConnection(instance);
};

export const connectRealtime = async (clientId) => {
  const apiKey = import.meta.env.VITE_ABLY_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (
    realtimeInstance &&
    currentClientId === clientId &&
    realtimeInstance.connection.state === "connected"
  ) {
    return realtimeInstance;
  }

  if (connectingPromise) {
    return connectingPromise;
  }

  if (realtimeInstance) {
    realtimeInstance.close();
    realtimeInstance = null;
    currentClientId = null;
  }

  connectingPromise = createRealtimeInstance(clientId)
    .then((instance) => {
      realtimeInstance = instance;
      currentClientId = clientId || instance.auth.clientId;
      return instance;
    })
    .finally(() => {
      connectingPromise = null;
    });

  return connectingPromise;
};

export const disconnectRealtime = async () => {
  if (connectingPromise) {
    try {
      await connectingPromise;
    } catch (error) {
      console.error("Error while establishing Ably connection:", error);
    }
  }

  if (realtimeInstance) {
    realtimeInstance.close();
    realtimeInstance = null;
    currentClientId = null;
  }
};

export const getRealtimeChannel = async (channelName, clientId) => {
  const instance = await connectRealtime(clientId);
  if (!instance) {
    return null;
  }

  return instance.channels.get(channelName);
};

export const publishRealtimeMessage = async (
  channelName,
  eventName,
  data,
  clientId
) => {
  try {
    const channel = await getRealtimeChannel(channelName, clientId);
    if (!channel) {
      return;
    }
    await channel.publish(eventName, data);
  } catch (error) {
    console.error("Failed to publish Ably message:", error);
  }
};
