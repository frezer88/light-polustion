import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {exp} from '@gorhom/bottom-sheet/lib/typescript/utilities/easingExp';

const getPollution = (pollution, colorStrange = 1) => {
  if (pollution > 50) {
    return {
      color: `rgba(255, 0, 0, ${colorStrange})`,
      name: 'Очень плохая видимость',
    };
  }

  if (pollution > 35) {
    return {
      color: `rgba(255, 165, 0, ${colorStrange})`,
      name: 'Плохая видимость',
    };
  }

  if (pollution > 20) {
    return {
      color: `rgba(0, 255, 0, ${colorStrange})`,
      name: 'Хорошая видимость',
    };
  }

  return {
    color: `rgba(0, 0, 255, ${colorStrange})`,
    name: 'Прекрасная видимость',
  };
};

export default function ElementBottomSheet({
  latitude,
  longitude,
  handleCloseModalPress,
  setFocusCordinates,
  pollution,
}) {
  const showPointOnMap = () => {
    setFocusCordinates(prev => ({
      ...prev,
      latitude: latitude,
      longitude: longitude,
    }));
    handleCloseModalPress();
  };

  return (
    <View style={styles.container}>
      <View style={{}}>
        <View style={[styles.containerText, {marginBottom: 10}]}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>Широта: </Text>
          <Text>{latitude}</Text>
        </View>
        <View style={styles.containerText}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>Долгота: </Text>
          <Text>{longitude}</Text>
        </View>
        <View style={styles.containerText}>
          <Text style={{fontSize: 15, fontWeight: 'bold'}}>Видимость: </Text>
          <Text style={{color: getPollution(pollution).color}}>
            {getPollution(pollution).name}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => showPointOnMap()}>
        <Icon name={'location-outline'} size={32} />
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
};

export {getPollution};
