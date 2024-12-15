import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { View, Image, Dimensions, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useSharedValue,
  withDelay,
  withTiming,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS, useAnimatedReaction, withRepeat,
} from "react-native-reanimated";
import ElementChild from "./elementChild";
import { useLayout } from '@react-native-community/hooks'

export default function Element({count, doubleCount}) {

  const memoizedElementChild = useMemo(() => {
    return <ElementChild />;
  }, [doubleCount]);

  return (
    <View>
      <Text>Element = {count}</Text>
      <Text>Double count = {doubleCount}</Text>
      {memoizedElementChild}
    </View>
  );
}
