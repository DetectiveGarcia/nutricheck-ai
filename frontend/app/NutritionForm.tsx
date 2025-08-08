import { mesureUnits } from "@/constants/measureUnits";
import { nutritionData } from "@/constants/nutritionData";
import { useAuth } from "@/context/AuthProvider";
import { useChatGPT } from "@/hooks/useChatGPT";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MeasurementUnitsMenu from "./MeasurementUnitsMenu";

const NutritionForm = () => {
  const [nutritionForm, setNutritionForm] =
    useState<typeof nutritionData>(nutritionData);
  const [productTitle, setProductTitle] = useState<string>("");
  const [titleInput, setTitleInput] = useState<string>("");
  const [addNutritionModeOn, setAddNutritionModeOn] = useState<boolean>(false);
  const [nutNameInput, setNutNameInput] = useState<string>("g");
  const [nutAmountInput, setNutAmountInput] = useState<string>("");
  const [nutUnitInput, setNutUnitInput] = useState<string>("");
  const [totalWeight, setTotalWeight] = useState<string>("");
  const [totalWeightInput, setTotalWeightInput] = useState<string>("");
  const [nutriInfoPerGram, setNutriInfoPerGram] = useState<string>("100g");
  const [nutriInfoPerGramInput, setNutriInfoPerGramInput] =
    useState<string>("100g");

  const [editPerGram, setEditPerGram] = useState<boolean>(false);

  const { sendRequest, loading, error } = useChatGPT();

  const { accessToken } = useAuth();

  const router = useRouter();

  const handleAddNutrition = () => {
    if (!nutNameInput) {
      return Alert.alert("Please add name");
    }

    setNutritionForm((prevNutritionForm) => {
      const newNutrition = {
        name: nutNameInput,
        amount: nutAmountInput,
        unit: nutUnitInput,
      };
      return [...prevNutritionForm, newNutrition];
    });
    setNutNameInput(""); // Clear the input field after adding
    setAddNutritionModeOn(false); // Optionally turn off add mode
  };

  const sendToChatGPT = async () => {
    if (!totalWeight) return Alert.alert("Lägg till total vikt av produkten");
    if (!productTitle) return Alert.alert("Please add product name");

    if (!accessToken) throw new Error("Du måste vara inloggad"); //Här kan kanske refresha tokenet

    const gptResponse = await sendRequest(
      nutritionForm,
      productTitle,
      totalWeight,
      nutriInfoPerGram,

    );

    const response = gptResponse.reply;
    console.log(response);

    router.push({
      pathname: "./Product",
      params: {
        productTitle,
        totalWeight,
        response,
      },
    });
  };

  

  return (
    <SafeAreaView style={{ width: "100%", height: "100%" }}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={{ marginTop: 10 }}>Analyserar näringsdata...</Text>
        </View>
      ) : (
        <>
          <View>
            {productTitle ? (
              <View>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: "bold",
                    marginVertical: 10,
                    textAlign: "center",
                  }}
                >
                  {productTitle}
                </Text>
              </View>
            ) : (
              <View>
                <TextInput
                  placeholder="Title of product"
                  onChangeText={(text) => setTitleInput(text)}
                />
                <Button
                  title="add title"
                  onPress={() => setProductTitle(titleInput)}
                />
              </View>
            )}
            <View>  
              <Button
                title="Add nutrition"
                onPress={() => setAddNutritionModeOn(!addNutritionModeOn)}
              />
              {!editPerGram ? (
                <TouchableOpacity onLongPress={() => setEditPerGram(true)}>
                  <Text>Näringdeklaration per gram: {nutriInfoPerGram}</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TextInput
                    keyboardType="numeric"
                    value={nutriInfoPerGramInput}
                    onChangeText={(text) => setNutriInfoPerGramInput(text)}
                  />
                  <Button
                    title="Done"
                    onPress={() => {
                      setEditPerGram(false);
                      setNutriInfoPerGram(nutriInfoPerGramInput + "g");
                    }}
                  />
                </>
              )}
            </View>
          </View>
          <ScrollView>
            <View
              style={{
                // borderWidth: 1,
                // borderColor: "black",
                padding: 10,
                width: "100%",
              }}
            >
              {addNutritionModeOn && (
                <View>
                  <TextInput
                    placeholder="Name"
                    onChangeText={setNutNameInput}
                  />
                  <TextInput
                    style={{
                      borderColor: "gray",
                      padding: 5,
                      borderTopWidth: 1,
                    }}
                    placeholder="Amount"
                    value={nutAmountInput}
                    keyboardType="numeric"
                    onChangeText={(text) => setNutAmountInput(text)}
                  />
                  <Picker
                    style={{ width: 110 }}
                    onValueChange={(unitValue: string) =>
                      setNutUnitInput(unitValue)
                    }
                  >
                    {mesureUnits.map((unit) => {
                      return (
                        <Picker.Item
                          value={unit.name}
                          label={unit.name}
                          key={unit.name}
                        />
                      );
                    })}
                  </Picker>
                  <Button title="Add" onPress={() => handleAddNutrition()} />
                </View>
              )}

              <View>
                {nutritionForm &&
                  nutritionForm.map((nutrition) => {
                    return (
                      <View
                        key={nutrition.name}
                        style={{
                          marginBottom: 20,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ width: 115 }}>{nutrition.name}</Text>
                        <TextInput
                          style={{
                            borderWidth: 1,
                            borderColor: "gray",
                            padding: 5,
                          }}
                          placeholder="Amount"
                          value={nutrition.amount}
                          keyboardType="numeric"
                          onChangeText={(text) => {
                            setNutritionForm((prevList) =>
                              prevList.map((item) =>
                                item.name === nutrition.name
                                  ? { ...item, amount: text }
                                  : item
                              )
                            );
                          }}
                        />
                        <MeasurementUnitsMenu
                          {...{
                            mesureUnits,
                            setNutritionList: setNutritionForm,
                          }}
                          nutritionName={nutrition.name}
                        />
                      </View>
                    );
                  })}
              </View>
            </View>
          </ScrollView>
          <View>
            <Button title="Send" onPress={sendToChatGPT} />
          </View>
          <View>
            {totalWeight ? (
              <Text>Total vikt: {totalWeight}</Text>
            ) : (
              <>
                <TextInput
                  placeholder="Total product weight"
                  keyboardType="numeric"
                  onChangeText={setTotalWeightInput}
                />
                <Button
                  title="Add weight"
                  onPress={() => {
                    if (!totalWeightInput)
                      return Alert.alert("Lägg till total vikt");
                    setTotalWeight(`${totalWeightInput}g`);
                  }}
                />
              </>
            )}
          </View>
          {error && (
            <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default NutritionForm;
