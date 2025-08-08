import { useAuth } from "@/context/AuthProvider";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

export default function LayoutWithAuth() {
  const { accessToken, loading, refresh } = useAuth();
  const [attemptedRefresh, setAttemptedRefresh] = useState(false);

  useEffect(() => {
    if (!accessToken && !attemptedRefresh) {
      const tryRefresh = async () => {
        try {
          await refresh();
        } catch (error) {
          Alert.alert("Error LayoutWithAuth: " + error);
        } finally {
          setAttemptedRefresh(true);
        }
      };
      tryRefresh();
    }
    console.log("LayoutWithAuth, accessToken: ", accessToken);
  }, [accessToken, attemptedRefresh]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (accessToken === null) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/Login" />
        <Stack.Screen name="auth/Register" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" />
    </Stack>
  );
}
