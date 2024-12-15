import React, {useState, useEffect, useLayoutEffect, useMemo} from 'react';
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

 function ElementChild() {

  useEffect(() => {
    console.log('ElementChild')
  });

  return (
    <View>
      <Text>Element child</Text>
    </View>
  );
}

export default ElementChild;
