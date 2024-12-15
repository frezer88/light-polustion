import React, {useState, useEffect, useLayoutEffect, useRef} from 'react';
import { View, Image, Dimensions, Text, SafeAreaView, TouchableOpacity, TextInput } from "react-native";

export default function useRefTest() {

  const testRef = useRef(null)

  return (
    <View style={styles.container}>
      <TextInput ref={testRef}>
      </TextInput>
      <TouchableOpacity
        onPress={() => {
          console.log(testRef.current.focus())
        }}
      >
        <Text>Click</Text>
      </TouchableOpacity>
    </View>

  )
}

const styles = {
  container: {
    flex: 1,
  }
}
