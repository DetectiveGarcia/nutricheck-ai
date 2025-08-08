import { usePoppinsFonts } from "@/assets/fonts/poppins";
import { useAuth } from "@/context/AuthProvider";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface RegisterProps {
  loginRegisterToggle: boolean;
  setLoginRegisterToggle: Dispatch<SetStateAction<boolean>>;
}

const Register = ({
  loginRegisterToggle,
  setLoginRegisterToggle,
}: RegisterProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { register } = useAuth();

  const [fontsLoaded] = usePoppinsFonts();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("All fields are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await register(firstName, lastName, email, password);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (error: any) {
      Alert.alert("Register failed", error.message || "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ width: "100%" }}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontFamily: 'Poppins_600SemiBold' }}>Register</Text>

      <TextInput
        placeholder="First name"
        value={firstName}
        onChangeText={setFirstName}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          borderWidth: 1,
          borderRadius: 5,
        }}
      />
      <TextInput
        placeholder="Last name"
        value={lastName}
        onChangeText={setLastName}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          borderWidth: 1,
          borderRadius: 5,
        }}
      />
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
      <Button title="Register" onPress={handleRegister} />
      <View style={styles.loginContainer}>
        <Text>Ta dig tbx till </Text>
        <Pressable
          onPress={() => {
            setLoginRegisterToggle(!loginRegisterToggle);
          }}
        >
          <Text style={styles.loginText}>logga in</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 15,
  },
  loginText: {
    color: "blue",
    textDecorationLine: "underline",
    fontFamily: 'Poppins_400Regular'
  },
});

export default Register;
