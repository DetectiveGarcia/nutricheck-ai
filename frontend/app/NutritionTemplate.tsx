import React, { useReducer } from 'react'
import { Text, View } from 'react-native'

type Action = {
    type: "ADD_NUTRITION_VALUE"
    payload: { nutritionValue: string }
}

type State = {
    nutritionList: Nutrition[] 
}

type Nutrition = {
  id: number;
  name: string
  value: string
}

const initialState: State = {
  nutritionList: []
}

function reducer(state: State, action: Action): State {
  
  switch (action.type){
    case "ADD_NUTRITION_VALUE":
      return {...state, nutritionList: state.nutritionList.map(nutrition => {
        return nutrition
      })}
  }

}

const NutritionTemplate = () => {

  const [state, action] = useReducer(reducer, initialState)

  return (
    <View>
      <Text>NutritionTemplate</Text>
    </View>
  )
}

export default NutritionTemplate