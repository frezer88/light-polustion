import { TouchableOpacity, View,Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useCallback, useEffect, useRef, useState } from "react";
import BottomSheet from './BottomSheet'
import Geolocation from '@react-native-community/geolocation';
import Icon from "react-native-vector-icons/Ionicons";
import { useSharedValue } from "react-native-reanimated";

const cordMap = [
  {
    id: 1,
    latitude: 37.78825,
    longitude: -122.4210,
  },
  {
    id: 2,
    latitude: 37.78825,
    longitude: -122.4324,
  }
]

export default function Index(){

  const [focusCordinates, setFocusCordinates] = useState({
    latitude: 37.78825,
    longitude: -121.4210,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  const [myCoordinates, setMyCoordinates] = useState({
    latitude: null,
    longitude: null,
  })

  const bottomSheetPosition = useSharedValue(0);


  useEffect(() => {
    Geolocation.getCurrentPosition(info => {
      setFocusCordinates({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      })
    }, error => {
      setFocusCordinates({//Дефолт Москва
        latitude: 55.746783,
        longitude: 37.623470,
      })
    });

    const watchId = Geolocation.watchPosition(
      (pos) => {
        // Успешное получение геолокации
        const { latitude, longitude } = pos.coords;
        setMyCoordinates({latitude: latitude, longitude: longitude });
      },
      (error) => {
        setMyCoordinates({//Дефолт Москва
          latitude: 55.746783,
          longitude: 37.623470,
        })
      },
      {
        enableHighAccuracy: true, // Включить высокую точность (например, GPS)
        distanceFilter: 10, // Обновлять данные при изменении на 10 метров
        interval: 5000, // Интервал получения данных (в миллисекундах)
        fastestInterval: 2000, // Самый короткий интервал
      }
    );

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [])

  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        region={focusCordinates}
      >
        <TouchableOpacity
          onPress={() => {
            setFocusCordinates(myCoordinates)
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
          activeOpacity={0.7}
        >
          <Icon
            name={'body'}
            size={35}
            color={'#027BFF'}
          />
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
            <View style={{ padding: 5, borderRadius: 100, backgroundColor: "#9f0000" }}/>
          </Marker>
        ))}
        <Marker
          coordinate={myCoordinates}
        >
          <Icon
            name={'body'}
            size={25}
            color={'#027BFF'}
          />
        </Marker>
      </MapView>
      <BottomSheet
        cordMap={cordMap}
        bottomSheetPosition={bottomSheetPosition}
      />
    </View>
  )
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
