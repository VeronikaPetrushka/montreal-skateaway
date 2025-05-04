import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from "react-native"
import appNavigation from "../AppConstants/appNavigation.js"
import { useNavigation } from "@react-navigation/native"

const AppNavigation = () => {
    const navigation = useNavigation();
    const [currentRoute, setCurrentRoute] = useState('MontrealRinksRoute');  

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const state = navigation.getState();
            console.log("Navigation state:", state);
            const montrealRinkRoute = state.routes[state.index]?.name || 'UnknownRoute';
            setCurrentRoute(montrealRinkRoute);
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View style={styles.menu}>

            {
                appNavigation.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => {setCurrentRoute(item.routeName); navigation.navigate(item.routeName)}}>
                        <Image
                            source={item.routeIcon}
                            style={[{ width: 30, height: 30 },
                            currentRoute === item.routeName && { tintColor: '#ffcb14' }]}
                        />
                    </TouchableOpacity>
                ))
            }

        </View>
    )
};

const styles = StyleSheet.create({

    menu: {
        width: 242,
        paddingVertical: 14,
        paddingHorizontal: 33,
        borderRadius: 20,
        backgroundColor: '#0043bd',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between'
    }

});

export default AppNavigation;