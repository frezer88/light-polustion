import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {ScrollView, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {useCallback, useEffect, useRef, useState} from 'react';
import ElementBottomSheet from './elementBottomSheet';
import Icon from 'react-native-vector-icons/Ionicons';
import {getLightPollutions} from '../points';
import EventEmmiterClass from 'react-native/Libraries/vendor/emitter/EventEmitter';

const EventEmitter = new EventEmmiterClass();

export default function BottomSheet({
  cordMap,
  setFocusCordinates,
  myCoordinates,
  radiusSearch,
  setRadiusSearch,
}) {
  const bottomSheetRef = useRef(null);
  const snapPoints = ['5%', '50%'];

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleCloseModalPress = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  // Рендеринг маркеров
  const renderItem = ({item}) => (
    <ElementBottomSheet
      latitude={item.latitude}
      longitude={item.longitude}
      handleCloseModalPress={handleCloseModalPress}
      setFocusCordinates={setFocusCordinates}
    />
  );

  const showMyPositionOnMap = () => {
    setFocusCordinates(myCoordinates);
    handleCloseModalPress();
  };

  const plusRadius = () => {
    if (radiusSearch <= 3000) {
      setRadiusSearch(prev => prev + 50);
      EventEmitter.emit('pressPlus');
    }
  };

  const minusRadius = () => {
    if (radiusSearch >= 100) {
      setRadiusSearch(prev => prev - 50);
      EventEmitter.emit('pressMinus');
    }
  };

  useEffect(() => {
    handlePresentModalPress();
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDismissOnClose={false}
      android_keyboardInputMode="adjustResize"
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      enablePanDownToClose={false}
      handleComponent={() => (
        <View style={{}}>
          <View style={{alignItems: 'center'}}>
            <Icon name={'remove'} size={36} color={'grey'} />
          </View>
          <TouchableOpacity
            onPress={() => plusRadius()}
            style={{
              position: 'absolute',
              bottom: 160,
              right: 15,
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: '#ffffff',
              borderRadius: 15,
              zIndex: 100,
            }}
            activeOpacity={0.7}>
            <Icon name={'add-circle-outline'} size={35} color={'#027BFF'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => minusRadius()}
            style={{
              position: 'absolute',
              bottom: 100,
              right: 15,
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: '#ffffff',
              borderRadius: 15,
              zIndex: 100,
            }}
            activeOpacity={0.7}>
            <Icon name={'remove-circle-outline'} size={35} color={'#027BFF'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => showMyPositionOnMap()}
            style={{
              position: 'absolute',
              bottom: 40,
              right: 15,
              paddingHorizontal: 16,
              paddingVertical: 10,
              backgroundColor: '#ffffff',
              borderRadius: 15,
              zIndex: 100,
            }}
            activeOpacity={0.7}>
            <Icon name={'body'} size={35} color={'#027BFF'} />
          </TouchableOpacity>
        </View>
      )}>
      <BottomSheetView style={styles.contentContainer}>
        <View
          style={{
            alignItems: 'center',
            borderBottomWidth: 1,
            paddingBottom: 16,
            borderBottomColor: '#dddddd',
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>
            Информация о точках
          </Text>
        </View>
        <FlatList
          data={cordMap}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 16,
  },
};

export {EventEmitter};
