import {TouchableOpacity, View, Text} from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import {useCallback, useEffect, useRef, useState} from 'react';
import BottomSheet from './BottomSheet';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSharedValue} from 'react-native-reanimated';
import {generatePointsInCircle, getLightPollutions} from '../points';

const cordMap = [
  {
    id: 1,
    latitude: 37.78825,
    longitude: -122.421,
  },
  {
    id: 2,
    latitude: 37.78825,
    longitude: -122.4324,
  },
];

export default function Index() {
  const [focusCordinates, setFocusCordinates] = useState({
    latitude: 37.78825,
    longitude: -121.421,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [myCoordinates, setMyCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const [points, setPoints] = useState([]);
  const bottomSheetPosition = useSharedValue(0);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        setFocusCordinates({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      error => {
        setFocusCordinates({
          //Дефолт Москва
          latitude: 55.746783,
          longitude: 37.62347,
        });
      },
    );

    const watchId = Geolocation.watchPosition(
      pos => {
        // Успешное получение геолокации
        const {latitude, longitude} = pos.coords;
        setMyCoordinates({latitude: latitude, longitude: longitude});
      },
      error => {
        setMyCoordinates({
          //Дефолт Москва
          latitude: 55.746783,
          longitude: 37.62347,
        });
      },
      {
        enableHighAccuracy: true, // Включить высокую точность (например, GPS)
        distanceFilter: 10, // Обновлять данные при изменении на 10 метров
        interval: 5000, // Интервал получения данных (в миллисекундах)
        fastestInterval: 2000, // Самый короткий интервал
      },
    );

    (async () => {
      const result = await getLightPollutions(
        // myCoordinates.latitude,
        // myCoordinates.longitude,
        58.01148433646543,
        55.926202835315,
        3000,
      );

      setPoints(result);
    })();
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={{flex: 1}} region={focusCordinates}>
        <TouchableOpacity
          onPress={() => {
            setFocusCordinates(myCoordinates);
          }}
          style={{
            position: 'absolute',
            bottom: 50,
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
        {cordMap.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}>
            <View
              style={{
                padding: 5,
                borderRadius: 100,
                backgroundColor: '#9f0000',
              }}
            />
          </Marker>
        ))}
        <Marker coordinate={myCoordinates}>
          <Icon name={'body'} size={25} color={'#027BFF'} />
        </Marker>
        {/*<Circle*/}
        {/*  center={{latitude: 58.00155756232546, longitude: 55.94561631018744}}*/}
        {/*  radius={600}*/}
        {/*/>*/}
        {/*<Marker*/}
        {/*  coordinate={{*/}
        {/*    latitude: 58.00155756232546,*/}
        {/*    longitude: 55.94561631018744,*/}
        {/*  }}>*/}
        {/*  <View style={{width: 5, height: 5, backgroundColor: 'red'}} />*/}
        {/*</Marker>*/}
        {points.map((point, index) => (
          <Marker
            coordinate={{
              latitude: point.lat,
              longitude: point.lon,
            }}>
            <View
              style={{
                width: 5,
                height: 5,
                backgroundColor: `rgba(0,0,0,${
                  point.lightPollutionNumber / 50
                })`,
              }}
            />
          </Marker>
        ))}
      </MapView>
      <BottomSheet
        cordMap={cordMap}
        bottomSheetPosition={bottomSheetPosition}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
};
