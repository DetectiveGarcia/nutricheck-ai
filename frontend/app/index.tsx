import React, { useState } from "react";
import { View } from "react-native";
import Login from "./auth/Login";
import Register from "./auth/Register";
export default function Index() {
  const [loginRegisterToggle, setLoginRegisterToggle] =
    useState<boolean>(false);


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        borderWidth: 5
      }}
    >
      {loginRegisterToggle ? (
        <Register {...{ loginRegisterToggle, setLoginRegisterToggle }} />
      ) : (
        <Login {...{ loginRegisterToggle, setLoginRegisterToggle }} />
      )}
    </View>
  );
}
