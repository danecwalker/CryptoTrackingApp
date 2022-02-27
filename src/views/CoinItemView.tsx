import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, Touchable } from 'react-native';
import { TapGestureHandler, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { Easing, EasingNode, interpolate, useAnimatedStyle, useSharedValue, Value, withTiming } from 'react-native-reanimated';
import { LineChart } from 'react-native-wagmi-charts';
import * as haptics from 'expo-haptics';


interface CoinItemViewProps {
  coin: any
};


let {width, height} = Dimensions.get('window');

const CoinItemView = ({coin} : CoinItemViewProps) => {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'code',
  });

  let gd = coin.graph_data

  const boxHeight = useSharedValue(0);

  function toggleHeight() {
    boxHeight.value === 200 ?
    boxHeight.value = 0 :
    boxHeight.value = 200;
  }

  const boxAnimation = useAnimatedStyle(() => {
    return {
      height: withTiming(boxHeight.value, {duration: 200})
    };
  });

  function invokeHaptic() {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
  }

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={[styles.top, boxAnimation]}>
        
        <LineChart.Provider data={gd}>
          <LineChart width={width-40} height={200}>
            <LineChart.Path color={coin.price_change_percentage_24h < 0 ? '#ff0000' : '#00ff00'} width={1}>
              <LineChart.Gradient />
            </LineChart.Path>
            <LineChart.CursorCrosshair onActivated={invokeHaptic} onEnded={invokeHaptic} color={coin.price_change_percentage_24h < 0 ? '#ff0000' : '#00ff00'} >
              <LineChart.Tooltip textStyle={{color: '#fff'}}/>
            </LineChart.CursorCrosshair>
          </LineChart>
          
        </LineChart.Provider>
      </Animated.View>

      <TouchableOpacity onPress={()=>toggleHeight()} activeOpacity={0.6}>
        <View style={styles.bottom}>
          <View style={styles.left}>
            <Text style={styles.coinName}>{coin.name}</Text>
            <Text style={styles.coinCode}>{coin.symbol.toUpperCase()}</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.coinPrice}>{formatter.format(coin.current_price)}</Text>
            <Text style={[styles.coinDiff, {color: coin.price_change_percentage_24h < 0 ? '#ff0000' : '#00ff00'}]}>{coin.price_change_percentage_24h.toFixed(2)}% ({coin.price_change_24h.toFixed()})</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: width - 40,
    marginVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },

  top: {
    // backgroundColor: '#ff0000',
    backgroundColor: '#080808'
  },

  bottom: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#282828',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  left: {},

  right: {},

  coinName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 4,
  },

  coinCode: {
    fontWeight: 'normal',
    fontSize: 14,
    color: '#fff',
    opacity: 0.5,
  },

  coinPrice: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    textAlign: 'right',
    marginBottom: 4,
  },

  coinDiff: {
    fontWeight: 'normal',
    fontSize: 14,
    color: '#00ffcc',
    textAlign: 'right',
  },
});


export default CoinItemView;