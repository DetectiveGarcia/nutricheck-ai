import { AuthProvider } from "@/context/AuthProvider";

import { SafeAreaView } from "react-native-safe-area-context";
import LayoutWithAuth from "./LayoutWithAuth";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaView style={{height: '100%'}}>
        <LayoutWithAuth />
      </SafeAreaView>
    </AuthProvider>
  );
}
