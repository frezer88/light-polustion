import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  withDelay,
  withTiming,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS, useAnimatedReaction, withRepeat, ReduceMotion, useDerivedValue,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useLayout } from '@react-native-community/hooks'

export default function ReanimatedMain() {

  // const {height, width, scale, fontScale} = useWindowDimensions();

  const {onLayout, width, x, height, y} = useLayout()

  const offset = useSharedValue(0)
  const color = useSharedValue(0)

  const radiusValueDerived = useDerivedValue(() => {
    if(offset.value > 0){
      return offset.value / 2
    }
    else{
      return offset.value * -1 / 2
    }
  })

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
    backgroundColor: color.value,
    borderRadius: radiusValueDerived.value
  }));

  const pan = Gesture.Pan()
    .onChange((event) => {
      offset.value += event.changeX;
    })

  useAnimatedReaction(
    () => offset.value,
    () => {

      if(offset.value > 0){
        color.value = "#c817da"
      }
      else{
        color.value = "#da9c17"
      }
    }
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[animatedStyles, {width: 100, height: 100}]}>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

const styles = {
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
}
