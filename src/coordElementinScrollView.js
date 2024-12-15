import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet
} from "react-native";

export default function CoordElementinScrollView() {
  const [positions, setPositions] = useState({});
  const itemRefs = useRef([]);

  // Обработчик для измерения каждого элемента
  const measureElement = (index) => {
    if (itemRefs.current[index]) {
      itemRefs.current[index].measure((x, y, width, height, pageX, pageY) => {
        setPositions((prevPositions) => ({
          ...prevPositions,
          [index]: { x: pageX, y: pageY }
        }));
      });
    }
  };

  // Обработчик прокрутки
  const handleScroll = () => {
    // Измеряем каждый элемент при прокрутке
    Array.from({ length: 100 }).forEach((_, index) => measureElement(index));
  };

  return (
    <ScrollView
      style={styles.scrollView}
      onScroll={handleScroll} // Добавляем обработчик прокрутки
      scrollEventThrottle={16} // Частота обновления
    >
      {
        Array.from({ length: 100 }).map((_, index) => (
          <View
            key={index}
            ref={(ref) => (itemRefs.current[index] = ref)} // Сохраняем ref для каждого элемента
            style={styles.item}
            onLayout={() => measureElement(index)} // Измерение при первоначальной загрузке
          >
            <Text>Элемент {index + 1} - X: {positions[index]?.x || 0}, Y: {positions[index]?.y || 0}</Text>
          </View>
        ))
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 20,
  },
  item: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f2f2f2',
  },
});
