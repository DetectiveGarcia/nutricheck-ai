import { usePoppinsFonts } from "@/assets/fonts/poppins";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "expo-router";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
    Alert,
    Button,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

interface LoginProps {
  loginRegisterToggle: boolean;
  setLoginRegisterToggle: Dispatch<SetStateAction<boolean>>;
}

const Login = ({ loginRegisterToggle, setLoginRegisterToggle }: LoginProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { login } = useAuth();
  const router = useRouter();
  const [fontsLoaded] = usePoppinsFonts();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("All fields are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      setEmail("");
      setPassword("");
      console.log("Hello");
      router.replace("./Home");
    } catch (error: any) {
      Alert.alert("Login failed", error.message || "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <View style={{ width: "100%" }}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontFamily: 'Poppins_600SemiBold' }}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          borderWidth: 1,
          borderRadius: 5,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 20,
          borderWidth: 1,
          borderRadius: 5,
        }}
      />
      <Button
        title={isSubmitting ? "Loggar in..." : "Logga in"}
        onPress={handleLogin}
        disabled={isSubmitting}
      />

      <View style={styles.registerContainer}>
        <Text>Om du inte är registrerad, kan du </Text>
        <Pressable onPress={() => setLoginRegisterToggle(!loginRegisterToggle)}>
          <Text style={styles.registerText}>registrera dig här</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
  },
  registerText: {
    color: "blue",
    textDecorationLine: "underline",
    fontFamily: 'Poppins_400Regular'
  },
});

export default Login;
