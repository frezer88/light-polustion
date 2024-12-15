import React, {useState, useEffect, useLayoutEffect} from 'react';
import { View, Image, Dimensions, Text, SafeAreaView, TouchableOpacity } from "react-native";

export default function ButtonView(){

  /**
   * Необходимо написать функцию, которая на вход принимает урл,
   * асинхронно ходит по этому урлу GET запросом и возвращает данные (json).
   * Для получении данных можно использовать fetch.
   * Если во время запроса произошла ошибка, то пробовать запросить ещё 5 раз.
   * Если в итоге информацию получить не удалось, вернуть ошибку "Заданный URL недоступен".
   */

  return (
    <View>
      <Text>123</Text>
      <TouchableOpacity
        onPress={() => {

        }}
      >
        <Text>Изменить</Text>
      </TouchableOpacity>
    </View>
  )
}
