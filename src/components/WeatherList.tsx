import React, { useCallback } from 'react';
import { WeatherListItem } from './WeatherListItem';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import cityCoordinates from '../cityCoordinates.json';
import { City } from '../types/dataTypes';


export const WeatherList = ():JSX.Element => { 
    const renderWeatherItem = useCallback(({item}:{item:City})=>{
        return <WeatherListItem cityData={item} />
    },[])

    return(
        <View style={styles.listContainer}>
            <FlatList 
                data={cityCoordinates}
                keyExtractor={(item)=> `${item.name}-${item.coordinates.latitude}`}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={3}
                windowSize={11}
                pagingEnabled
                renderItem={renderWeatherItem}
            />
      </View>
    )
}
const styles = StyleSheet.create({
   listContainer:{
     height:'50%',
   }
})