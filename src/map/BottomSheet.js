import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { ScrollView, Text, View, FlatList } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import ElementBottomSheet from "./elementBottomSheet";
import Animated, { useSharedValue } from "react-native-reanimated";

export default function BottomSheet({ cordMap, bottomSheetPosition }) {
  const bottomSheetRef = useRef(null);
  const snapPoints = ["5%", "50%"];

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const showPointOnMap = () => {

  }

  // Рендеринг маркеров
  const renderItem = ({ item }) => (
    <ElementBottomSheet latitude={item.latitude} longitude={item.longitude} handleCloseModalPress={handleCloseModalPress} showPointOnMap={showPointOnMap} />
  );

  useEffect(() => {
    handlePresentModalPress();
  }, []);

  return (
  <Animated.View style={{ top: bottomSheetPosition }}>
  <BottomSheetModal
      ref={bottomSheetRef}
      // onChange={handleSheetChanges}
      snapPoints={snapPoints}
      enableDismissOnClose={false} // Отключаем возможность закрытия
      android_keyboardInputMode="adjustResize"
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      enablePanDownToClose={false}
      animatedPosition={bottomSheetPosition}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={{alignItems: 'center', borderBottomWidth: 1, paddingBottom: 16, borderBottomColor: '#dddddd',}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Информация о точках</Text>
        </View>
        <FlatList
          data={cordMap}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </BottomSheetView>
    </BottomSheetModal>
    </Animated.View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 16,
  },
};
