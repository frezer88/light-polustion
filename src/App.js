import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Image, Dimensions, Text, SafeAreaView, TouchableOpacity } from "react-native";
import ButtonView from './buttonView'
import Index from "./map";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <Index/>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
};

const styles = {
  container: {
    flex: 1,
  }
}

