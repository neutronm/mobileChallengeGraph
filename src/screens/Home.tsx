import React, { useEffect } from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native'
import { WeatherList } from '../components/WeatherList';
import { invalidateOldCaches } from '../utils/weatherDataCache';
import moment from 'moment';
import { DATE_FORMAT } from '../constants/constants';


export const Home: React.FC = () => {
    
    useEffect(()=>{
        invalidateOldCaches()
    },[])

    return(
        <SafeAreaView style={styles.background}>
            <View style={styles.container}>
            <WeatherList />
            <Text>Switch city by swiping horizontaly</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    background:{
        backgroundColor: '#F5F5F5', 
    },
    container:{
       height:'100%',
       justifyContent:'center',
       alignItems:'center',
    }
})