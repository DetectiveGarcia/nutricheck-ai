import { View } from "react-native";
import NutritionForm from "./NutritionForm";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
        {/* <NutritionTemplate /> */}
        <NutritionForm />

    </View>
  );
}
