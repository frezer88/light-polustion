import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import MapView, {Circle, Marker, Polyline} from 'react-native-maps';
import {useCallback, useEffect, useRef, useState} from 'react';
import BottomSheet, {EventEmitter} from './BottomSheet';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import {
  generatePointsInCircle,
  getArrayLightPollution,
  getLightPollutions,
  LIGHT_POLLUTION_ARRAY,
} from '../points';
import {getPollution} from './elementBottomSheet';
import {useLoading} from '../context/loading.tsx';
import absoluteFill = StyleSheet.absoluteFill;

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
  const {isLoading, startLoading, stopLoading} = useLoading();
  const [focusCordinates, setFocusCordinates] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [myCoordinates, setMyCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const ref = useRef<MapView>(null);
  const [points, setPoints] = useState([]);
  const bottomSheetPosition = useSharedValue(0);
  const [radiusSearch, setRadiusSearch] = useState(500);
  const [changeRadiusSearch, setSetRadiusSearch] = useState(undefined);
  const [bestPoints, setBestPoints] = useState([]);
  const [bestestPoint, setBestestPoint] = useState(null);

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

    const interval = setInterval(() => {
      const points = getArrayLightPollution();

      setPoints(points);
    }, 2000);
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    EventEmitter.addListener('pressPlus', async () => {
      startLoading();
      console.log('123 ' + radiusSearch);
      await getLightPollutions(
        myCoordinates.latitude,
        myCoordinates.longitude,
        radiusSearch + 1200,
        1200,
      );
      stopLoading();
    });

    EventEmitter.addListener('pressMinus', async () => {
      startLoading();
      console.log('-123 ' + radiusSearch);
      await getLightPollutions(
        myCoordinates.latitude,
        myCoordinates.longitude,
        radiusSearch - 1200,
        -1200,
      );
      stopLoading();
    });

    if (points.length === 0) {
      (async () => {
        startLoading();
        await getLightPollutions(
          myCoordinates.latitude,
          myCoordinates.longitude,
          radiusSearch,
        );
        stopLoading();
      })();
    }

    return () => {
      EventEmitter.removeAllListeners();
    };
  }, [radiusSearch, myCoordinates]);

  useEffect(() => {
    let minPollution = Number.MAX_SAFE_INTEGER;
    let minPollutionIndex = -1;

    points.forEach((point, i) => {
      if (
        minPollution > point.lightPollutionNumber &&
        point.lat > 1 &&
        point.lon > 1 &&
        point.lon !== myCoordinates.latitude &&
        point.lon !== myCoordinates.longitude
      ) {
        minPollutionIndex = i;
        minPollution = point.lightPollutionNumber;
      }
    });

    setBestPoints(
      points.filter(
        point =>
          point.lightPollutionNumber < 50 &&
          point.lat > 1 &&
          point.lon > 1 &&
          point.lon !== points[minPollutionIndex].lat &&
          point.lon !== points[minPollutionIndex].lon,
      ),
    );

    console.log(points[minPollutionIndex]);

    setBestestPoint(points[minPollutionIndex]);
  }, [points]);

  // useEffect(() => {
  //   if (focusCordinates.longitude > 1) {
  //     console.log(focusCordinates);
  //     ref.current.animateCamera(
  //       {
  //         center: {
  //           longitude: focusCordinates.longitude,
  //           latitude: focusCordinates.latitude,
  //         },
  //         altitude: 10,
  //       },
  //       {duration: 1000},
  //     );
  //   }
  // }, [focusCordinates]);

  return (
    <View style={styles.container}>
      <MapView ref={ref} style={{flex: 1}} region={focusCordinates}>
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
        <Circle
          center={myCoordinates}
          radius={radiusSearch + 100}
          strokeWidth={2} // Толщина обводки
          strokeColor="#027BFF" // Цвет обводки
          fillColor="rgba(0, 123, 255, 0.3)" // Цвет заливки круга
        />
        {bestPoints.map((point, index) => (
          <>
            <Marker
              key={`point${point.lat}${point.lon}${index}`}
              coordinate={{
                latitude: point.lat,
                longitude: point.lon,
              }}>
              <Icon
                name={'telescope-outline'}
                size={25}
                color={
                  focusCordinates.latitude === point.lat &&
                  focusCordinates.longitude === point.lon
                    ? getPollution(point.lightPollutionNumber).color
                    : getPollution(point.lightPollutionNumber, 0.3).color
                }
              />
            </Marker>
            <Polyline
              id={`line${point.lat}${point.lon}${index}`}
              coordinates={[
                {
                  latitude: point.lat,
                  longitude: point.lon,
                },
                myCoordinates,
              ]}
              strokeColor={
                focusCordinates.latitude === point.lat &&
                focusCordinates.longitude === point.lon
                  ? 'rgba(2, 123, 255, 1)'
                  : 'rgba(2, 123, 255, 0.3)'
              }
            />
          </>
        ))}
        {bestestPoint !== null && bestestPoint !== undefined && (
          <>
            <Marker
              key={`point${bestestPoint.latitude}${bestestPoint.longitude}-bestest`}
              coordinate={{
                latitude: bestestPoint.lat,
                longitude: bestestPoint.lon,
              }}>
              <Icon name={'telescope-outline'} size={25} color={'black'} />
            </Marker>
            <Polyline
              id={`line${bestestPoint.lat}${bestestPoint.lon}-besterset`}
              coordinates={[
                {
                  latitude: bestestPoint.lat,
                  longitude: bestestPoint.lon,
                },
                myCoordinates,
              ]}
              strokeColor={'black'}
            />
          </>
        )}
      </MapView>
      <BottomSheet
        cordMap={cordMap}
        setFocusCordinates={setFocusCordinates}
        myCoordinates={myCoordinates}
        radiusSearch={radiusSearch}
        setRadiusSearch={setRadiusSearch}
        bestPoints={bestPoints}
        bestestPoint={bestestPoint}
      />

      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 60,
            right: 30,
            width: 30,
            height: 30,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}>
          <ActivityIndicator size={'small'} />
        </View>
      )}
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
