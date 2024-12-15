import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Image, Dimensions, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { useLayout } from '@react-native-community/hooks'

export default function CommunityHooks() {

  const { onLayout, ...layout } =  useLayout()
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('layout: ', layout)
  }, [layout])

  return (
    <View>
      <Text onLayout={onLayout} style={{width: count * 10}}>{count}</Text>
      <TouchableOpacity onPress={() => setCount((prev) => prev + 1)}>
        <Text>Click</Text>
      </TouchableOpacity>
    </View>
  )
}
