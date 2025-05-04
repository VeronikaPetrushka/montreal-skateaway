import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, ImageBackground, Modal, PanResponder } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from '@react-native-community/blur';
import { useNavigation } from "@react-navigation/native";
import AppNavigation from '../AppHelpers/AppNavigation';

const { height, width } = Dimensions.get('window');

const hockeyPuck = require('../AppAssets/appHockey/puck.png');
const hockeyStick = require('../AppAssets/appHockey/stick.png');

const MontrealIceRinkHockey = () => {
    const navigation = useNavigation();
    const [playHockey, setPlayHockey] = useState(false);
    const [time, setTime] = useState(0);
    const [score, setScore] = useState(0);
    const scoredRef = useRef(false);
    const [gameOver, setGameOver] = useState(false);
    const [record, setRecord] = useState(0);

    // loading record

    useEffect(() => {
        loadRecord();
    }, []);

    useEffect(() => {
        loadRecord();
    }, [gameOver]);

    const loadRecord = async () => {
        try {
            const stored = await AsyncStorage.getItem('HOCKEY_RECORDS');
            const records = stored ? JSON.parse(stored) : [];
            if (records.length > 0) {
                const max = Math.max(...records);
                setRecord(max);
            }
        } catch (e) {
            alert('Failed to load hockey record');
        }
    };

    // stick logic

    const [stickX, setStickX] = useState(0);
    const [stickY, setStickY] = useState(0);

    const stickSize = 70;
    const movementWidth = width * 0.8;
    const movementHeight = height > 700 ? height * 0.4 : height * 0.45;
    const startBottom = height > 700 ? height * 0.34 : height * 0.31;
    const movementAreaLeft = (Dimensions.get('window').width - movementWidth) / 2;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            const newX = Math.max(0, Math.min(stickX + gestureState.dx, movementWidth - stickSize));
            const newY = Math.max(0, Math.min(stickY - gestureState.dy, movementHeight - stickSize));
            setStickX(newX);
            setStickY(newY);

            // Compute absolute centers
            const stickCenterX = movementAreaLeft + newX + stickSize / 2;
            const stickCenterY = startBottom + newY + stickSize / 2;
            const puckCenterX = movementAreaLeft + puckX + puckSize / 2;
            const puckCenterY = startBottom + puckY + puckSize / 2;

            const dx = puckCenterX - stickCenterX;
            const dy = puckCenterY - stickCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If collision
            if (distance < (stickSize + puckSize) / 2) {
                const angle = Math.atan2(dy, dx);
                const speed = 70; // increased for stronger push

                // velocity
                setPuckVx(Math.cos(angle) * speed);
                setPuckVy(Math.sin(angle) * speed);

                // Push puck slightly outward to prevent overlap
                const overlap = (stickSize + puckSize) / 2 - distance;
                const offsetX = Math.cos(angle) * overlap;
                const offsetY = Math.sin(angle) * overlap;

                setPuckX(prev => Math.max(0, Math.min(prev + offsetX, movementWidth - puckSize)));
                setPuckY(prev => Math.max(0, Math.min(prev + offsetY, movementHeight - puckSize)));
            }
        }
    });

    // puck logic

    const puckSize = 70;

    const [puckX, setPuckX] = useState((movementWidth - puckSize) / 2);
    const [puckY, setPuckY] = useState((movementHeight - puckSize) / 2);
    const [puckVx, setPuckVx] = useState(0);
    const [puckVy, setPuckVy] = useState(0);

    useEffect(() => {
        let animation;
        const update = () => {
            setPuckX(prevX => {
                let nextX = prevX + puckVx;
                if (nextX <= 0 || nextX >= movementWidth - puckSize) {
                    setPuckVx(v => -v); // bounce
                    nextX = Math.max(0, Math.min(nextX, movementWidth - puckSize));
                }
                return nextX;
            });

            setPuckY(prevY => {
                let nextY = prevY + puckVy;
                if (nextY <= 0 || nextY >= movementHeight - puckSize) {
                    setPuckVy(v => -v); // bounce
                    nextY = Math.max(0, Math.min(nextY, movementHeight - puckSize));
                }
                return nextY;
            });

            // friction
            setPuckVx(v => Math.abs(v) < 0.5 ? 0 : v * 0.975);
            setPuckVy(v => Math.abs(v) < 0.5 ? 0 : v * 0.975);

            animation = requestAnimationFrame(update);
        };

        if (playHockey) {
            animation = requestAnimationFrame(update);
        }

        return () => cancelAnimationFrame(animation);
    }, [playHockey, puckVx, puckVy]);

    // Goal detection zone (top-center of movement area)
    const goalWidth = 100;
    const goalHeight = 40;
    const goalX = (movementWidth - goalWidth) / 2;
    const goalY = movementHeight - goalHeight; // top of movement area

    // Check if puck is in the goal zone
    if (
        !scoredRef.current &&
        puckY + puckSize / 2 >= goalY &&
        puckY + puckSize / 2 <= movementHeight &&
        puckX + puckSize / 2 >= goalX &&
        puckX + puckSize / 2 <= goalX + goalWidth
    ) {
        setScore(prev => prev + 1);
        scoredRef.current = true;
    }

    // Reset scored flag once puck leaves the goal zone
    if (
        puckY + puckSize / 2 < goalY - 5 ||
        puckY + puckSize / 2 > movementHeight + 5 ||
        puckX + puckSize / 2 < goalX - 5 ||
        puckX + puckSize / 2 > goalX + goalWidth + 5
    ) {
        scoredRef.current = false;
    }
    
    //timer

    useEffect(() => {
        let interval;
        if (playHockey) {
            interval = setInterval(() => {
                setTime(prev => {
                    if (prev >= 60) {
                        clearInterval(interval);
                        saveRecord();
                        loadRecord();
                        setGameOver(true);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [playHockey]);

    const formatTime = (seconds) => {
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');
        return `${mm}:${ss}`;
    };

    //game over

    const saveRecord = async () => {
        try {
            const stored = await AsyncStorage.getItem('HOCKEY_RECORDS');
            const records = stored ? JSON.parse(stored) : [];

            const updatedRecords = [...records, score];

            await AsyncStorage.setItem('HOCKEY_RECORDS', JSON.stringify(updatedRecords));

            const maxScore = Math.max(...updatedRecords);
            setRecord(maxScore);
        } catch (e) {
            alert('Failed to update hockey records');
        }
    }

    const resetHockeyGame = () => {
        setPlayHockey(false);
        setTime(0);
        setScore(0);
        setGameOver(false);
        setStickX(0);
        setStickY(0);
        setPuckX((movementWidth - puckSize) / 2);
        setPuckY((movementHeight - puckSize) / 2);
        setPuckVx(0);
        setPuckVy(0);
    };

    return (
        <View style={styles.route}>

            {
                playHockey ? (
                    <ImageBackground source={require('../AppAssets/appDecor/hockeyBackground2.png')} style={{ flex: 1 }}>
                        <View style={{ width: '100%', height: '100%' }}>

                            <View style={[styles.countContainer, {top: height > 700 ? height * 0.08 : height * 0.06}]}>
                                <Text style={[styles.count, {color: '#e38400'}]}>{formatTime(time)}</Text>
                            </View>

                            {/* stick */}

                            {/* Visual movement area (optional debug box) */}
                            <View style={{
                                position: 'absolute',
                                bottom: startBottom,
                                left: movementAreaLeft,
                                width: movementWidth,
                                height: movementHeight,
                                borderRadius: 20
                            }} />

                            {/* Draggable stick */}
                            <View
                                {...panResponder.panHandlers}
                                style={{
                                    position: 'absolute',
                                    bottom: startBottom + stickY,
                                    left: movementAreaLeft + stickX,
                                    width: stickSize,
                                    height: stickSize,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Image
                                    source={hockeyStick}
                                    style={{ width: stickSize, height: stickSize, resizeMode: 'contain' }}
                                />
                            </View>

                            {/* Puck */}

                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: startBottom + puckY,
                                    left: movementAreaLeft + puckX,
                                    width: puckSize,
                                    height: puckSize,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Image
                                    source={hockeyPuck}
                                    style={{ width: puckSize, height: puckSize, resizeMode: 'contain' }}
                                />
                            </View>

                            <View style={[styles.countContainer, {bottom: height > 700 ? height * 0.08 : height * 0.06}]}>
                                <Text style={[styles.count, {color: '#8b1e00'}]}>{score}</Text>
                            </View>

                        </View>
                    </ImageBackground>
                ) : (
                    <ImageBackground source={require('../AppAssets/appDecor/hockeyBackground.png')} style={{ flex: 1 }}>
                        <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={() => setPlayHockey(true)}
                                style={{ width: '100%', position: 'absolute', bottom: height > 700 ? height * 0.14 : height * 0.18, alignSelf: 'center' }}
                            >
                                <Image source={require('../AppAssets/appDecor/startBtn.png')} style={styles.startBtn} />
                            </TouchableOpacity>
                            <View style={styles.menu}>
                                <AppNavigation />
                            </View>
                        </View>
                    </ImageBackground>
                )
            }

            {
                gameOver && (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={gameOver}
                        onRequestClose={() => {
                            setGameOver(!gameOver);
                    }}>
                        <View style={styles.modalLayout}>
                            
                            <View style={styles.modalContent}>

                                <BlurView
                                    style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
                                    blurType="light"
                                    blurAmount={2}
                                    reducedTransparencyFallbackColor="white"
                                />

                                <TouchableOpacity style={styles.backBtn} onPress={resetHockeyGame}>
                                    <Image source={require('../AppAssets/appIcons/back.png')}/>
                                </TouchableOpacity>

                                <Text style={[styles.count, {color: '#664e27'}]}>GAME OVER</Text>

                                <Text style={[styles.count, {color: '#005e87', marginVertical: height * 0.09}]}>{score}</Text>

                                <Text style={[styles.count, {color: '#005e87'}]}>RECORD {record}</Text>

                            </View>
                        </View>
                    </Modal>
                )
            }

        </View>
    )
};

const styles = StyleSheet.create({

    route: {
        width: '100%',
        height: '100%',
    },

    menu: {
        width: '100%',
        position: 'absolute',
        bottom: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },

    startBtn: {
        width: '100%',
        height: 61,
        resizeMode: 'contain',
        zIndex: 10
    },

    countContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
    },

    count: {
        fontSize: 40,
        fontWeight: '900'
    },

    modalLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },

    modalContent: {
        width: '85%',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 20,
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },

    backBtn: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 8,
        height: 13,
        tintColor: '#4a4a4a'
    }

});

export default MontrealIceRinkHockey;