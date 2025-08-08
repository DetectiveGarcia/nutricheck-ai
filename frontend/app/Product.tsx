import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Product = () => {
  const { productTitle, response } = useLocalSearchParams();
  

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View>
        <Text style={{ fontSize: 25 }}>{productTitle}</Text>
      </View>
      <View>
        <Text>{response}</Text>
      </View>
    </View>
  );
};

export default Product;
