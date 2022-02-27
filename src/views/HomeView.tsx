import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import CoinItemView from './CoinItemView';

const CoinModel = require("../model/CoinModel");

interface HomeViewProps {
  
};

const HomeView = ({} : HomeViewProps) => {
  const safeInsets = useSafeAreaInsets();

  const [coins, setCoins] = useState([])
  const [page, setPage] = useState(1)
  const [refreshing, setRefreshing] = useState(true)

  const coinModel = new CoinModel();

  const loadData = async () => {
    setRefreshing(true);
    let data = await coinModel.loadCoins(page)
    setCoins(coins.concat(data));
    setPage(page+1);
    setRefreshing(false);
  }

  useEffect(() => {
    loadData()
  }, [])
  
  return (
    <View style={styles.container}>
      <StatusBar style="light"/>
      {coins.length === 0 ? 
        <ActivityIndicator color='#fff' /> :
        <FlatList keyExtractor={item=>item.symbol} style={[styles.list]} contentContainerStyle={{paddingTop: safeInsets.top-10, paddingBottom: safeInsets.bottom-10}} data={coins} renderItem={(item) => {
          // console.log(item.item)
          return <CoinItemView coin={item.item} />
        }} showsVerticalScrollIndicator={false} refreshing={refreshing} onEndReachedThreshold={1} onEndReached={()=>{loadData()}} ListFooterComponent={<ActivityIndicator color='#fff' style={{padding:20}} />}/>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: {
    paddingHorizontal: 20,
  }
});


export default HomeView;