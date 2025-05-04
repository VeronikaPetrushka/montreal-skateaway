import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Switch, Linking } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

const MontrealSettings = () => {
    const navigation = useNavigation();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    useEffect(() => {
        const loadNotificationSetting = async () => {
            const stored = await AsyncStorage.getItem('RINK_NOTIFICATIONS');
            if (stored !== null) setNotificationsEnabled(JSON.parse(stored));
        };
        loadNotificationSetting();
    }, []);

    const toggleNotifications = async () => {
        const newValue = !notificationsEnabled;
        setNotificationsEnabled(newValue);
        await AsyncStorage.setItem('RINK_NOTIFICATIONS', JSON.stringify(newValue));
    };

    return (
        <View style={{ flex: 1 }}>
            
            <Text style={styles.pageName}>SETTINGS</Text>

            <View style={[styles.btnContainer, {paddingVertical: 16}]}>
                <Text style={styles.btnText}>RINK NOTIFICATIONS</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={toggleNotifications}
                    trackColor={{ false: '#ccc', true: '#8b1e00' }}
                    thumbColor={notificationsEnabled ? '#FFD59A' : '#f4f3f4'}
                />
            </View>

            <View style={styles.btnContainer}>
                <Text style={styles.btnText}>PRIVACY & SECURITY</Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.termsfeed.com/live/92780cba-f5f4-4436-9cac-f56c5d467eed')}>
                    <Image source={require('../AppAssets/appIcons/back.png')} style={styles.arrowBtn} />
                </TouchableOpacity>
            </View>

            <View style={styles.btnContainer}>
                <Text style={styles.btnText}>DEVELOPER INFO</Text>
                <TouchableOpacity onPress={() => navigation.navigate('MontrealDeveloperInfoPage')}>
                    <Image source={require('../AppAssets/appIcons/back.png')} style={styles.arrowBtn} />
                </TouchableOpacity>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({

    pageName: {
        alignSelf: 'center',
        textAlig: 'center',
        fontSize: 26,
        fontWeight: '900',
        color: '#000',
        marginBottom: 46
    },

    btnContainer: {
        width: '100%',
        paddingVertical: 22.5,
        paddingHorizontal: 17,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#8b1e00',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 11
    },

    btnText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '900',
        color: '#000',
    },

    arrowBtn: {
        width: 8,
        height: 13,
        tintColor: '#4b4b4b',
        transform: [{ rotate: '180deg' }]
    }

});

export default MontrealSettings;