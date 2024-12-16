import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Image,
  Dimensions,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import ButtonView from './buttonView';
import Index from './map';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import LoadingProvider from './context/loading';

export default function App() {
  return (
    <LoadingProvider>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <View style={styles.container}>
            <Index />
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </LoadingProvider>
  );
}

const styles = {
  container: {
    flex: 1,
  },
};
