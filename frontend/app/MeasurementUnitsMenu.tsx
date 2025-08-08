import { MeasureUnit } from "@/types/measureUnits"
import { Nutrient } from "@/types/nutrition"
import { Picker } from '@react-native-picker/picker'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { View } from 'react-native'

interface MeasureUnitsProps {
  setNutritionList: Dispatch<SetStateAction<Nutrient[]>>
  mesureUnits: MeasureUnit[]
  nutritionName: string
}

const MeasurementUnitsMenu = ({ mesureUnits, setNutritionList, nutritionName }: MeasureUnitsProps) => {


  useEffect(() => {

    const initUnitValue = () => {
      const initialUnitValue = mesureUnits[0].name

      setNutritionList(prevList => prevList.map(nutrient => {
        return { ...nutrient, unit: initialUnitValue }
      } ) )

    }

    initUnitValue()

  }, [])


  return (
    <View style={{borderWidth: 1}}>
      <Picker style={{ width: 109 }} onValueChange={(unitValue: string) => setNutritionList(prevList => {
        return prevList.map((nutrient) => 
            nutrient.name === nutritionName ? { ...nutrient, unit: unitValue } : nutrient
          )
      })} >
         {mesureUnits && mesureUnits.map((mesureUnit) => {
          return (
            <Picker.Item value={mesureUnit.name} label={mesureUnit.name} key={mesureUnit.name}  />
          )
         })} 
      </Picker>

    </View>
  )
}

export default MeasurementUnitsMenu