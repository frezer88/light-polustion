import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function ElementBottomSheet ({latitude, longitude, handleCloseModalPress, setFocusCordinates}) {

  const showPointOnMap = () => {
    setFocusCordinates((prev) => ({
      ...prev,
      latitude: latitude,
      longitude: longitude
    }))
    handleCloseModalPress();
  }

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
      </View>
      <TouchableOpacity
        onPress={() => showPointOnMap()}
      >
        <Icon
          name={'location-outline'}
          size={32}
        />
      </TouchableOpacity>
    </View>
  )
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
  }
}
