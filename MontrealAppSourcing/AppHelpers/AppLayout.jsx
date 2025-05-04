import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import AppNavigation from './AppNavigation.jsx';

const { height } = Dimensions.get('window');

const AppLayout = ({ appRoute, skateMenu }) => {
    return (
        <View style={styles.container}>
            <Svg style={[StyleSheet.absoluteFill, { height:"100%", width:"100%"}]}>
                <Defs>
                    <RadialGradient
                        id="grad"
                        cx="50%" cy="50%" r="70%"
                        fx="50%" fy="50%"
                    >
                        <Stop offset="0%" stopColor="#FFD6A6" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#BF660D" stopOpacity="1" />
                    </RadialGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
            </Svg>

            <View style={styles.route}>{appRoute}</View>
            {
                skateMenu && (
                    <View style={styles.menu}>
                        <AppNavigation />
                    </View>
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    route: {
        width: '100%',
        height: '100%',
        padding: 20,
        paddingTop: height * 0.08
    },

    menu: {
        width: '100%',
        position: 'absolute',
        bottom: 45,
        alignItems: 'center',
        justifyContent: 'center'
    }

});

export default AppLayout;
