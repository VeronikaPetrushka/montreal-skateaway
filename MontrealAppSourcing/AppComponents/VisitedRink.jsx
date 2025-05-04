import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, TextInput } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const reactions = [
    {
        image: require('../AppAssets/appReactions/amazing.png'),
        text: 'AMAZING'
    },
    {
        image: require('../AppAssets/appReactions/fun.png'),
        text: 'FUN'
    },
    {
        image: require('../AppAssets/appReactions/awful.png'),
        text: 'AWFUL'
    },
    {
        image: require('../AppAssets/appReactions/crowded.png'),
        text: 'CROWDED'
    }
];

const VisitedRink = ({ rink }) => {
    const navigation = useNavigation();
    const [selectedReaction, setSelectedReaction] = useState(null);
    const [rinkNote, setRinkNote] = useState(null);

    useEffect(() => {
        const loadVisitedData = async () => {
            try {
                const stored = await AsyncStorage.getItem(`VISITED_RINK_${rink.name}`);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.reaction) setSelectedReaction(parsed.reaction);
                    if (parsed.note) setRinkNote(parsed.note);
                }
            } catch (error) {
                alert('Failed to load visited rink data');
            }
        };

        loadVisitedData();
    }, []);

    const saveVisitedRink = async () => {
        try {
            const formattedDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            const visitData = {
                reaction: selectedReaction,
                note: rinkNote,
                date: formattedDate
            };

            await AsyncStorage.setItem(`VISITED_RINK_${rink.name}`, JSON.stringify(visitData));

            const existingList = await AsyncStorage.getItem('VISITED_RINKS');
            let visitedList = existingList ? JSON.parse(existingList) : [];

            visitedList = visitedList.filter(item => item.name !== rink.name);

            visitedList.push(rink);

            await AsyncStorage.setItem('VISITED_RINKS', JSON.stringify(visitedList));

            navigation.goBack();
        } catch (error) {
            alert('Failed to save visited rink data');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Image source={require('../AppAssets/appIcons/back.png')}/>
            </TouchableOpacity>

            <Text style={styles.rinkName}>{rink.name.toUpperCase()}</Text>

            <ScrollView style={{ width: '100%' }}>

                <Text style={styles.rinkDate}>
                    {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Text>
                
                <Image source={rink.image} style={styles.rinkImage} />

                <Text style={styles.rinkDate}>RATE YOUR DAY ON THE ICE</Text>

                <View style={{height: 110, marginBottom: 28}}>
                    <ScrollView horizontal>
                        {reactions.map((reaction, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedReaction(reaction)}
                                style={[styles.reactionBtn, selectedReaction?.text === reaction.text && {borderWidth: 3}]}
                            >
                                <Image source={reaction.image} style={{ width: 44, height: 44, resizeMode: 'contain' }} />
                                <Text style={styles.reactionText}>{reaction.text}</Text>
                            </TouchableOpacity>
                        ))
                    }
                    </ScrollView>
                </View>

                <Text style={styles.rinkDate}>ADD NOTE</Text>
                <TextInput
                        style={styles.rinkNoteInput}
                        value={rinkNote}
                        onChangeText={(text) => {
                            setRinkNote(text);
                        }}
                        multiline
                />

                <TouchableOpacity style={styles.visitBtn} onPress={saveVisitedRink}>
                    <Text style={styles.visitBtnText}>SAVE</Text>
                </TouchableOpacity>
                
            </ScrollView>

        </View>
    )
};

const styles = StyleSheet.create({

    backBtn: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 8,
        height: 13,
    },

    rinkName: {
        alignSelf: 'center',
        textAlig: 'center',
        fontSize: 26,
        fontWeight: '900',
        color: '#000',
        marginBottom: 46
    },

    rinkDate: {
        fontSize: 18,
        lineHeight: 21,
        fontWeight: '900',
        color: '#8b1e00',
        marginBottom: 11
    },

    rinkImage: {
        width: '100%',
        height: 156,
        borderRadius: 10,
        resizeMode: 'cover',
        marginBottom: 20
    },

    reactionBtn: {
        width: 110,
        height: '100%',
        paddingVertical: 15,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#8b1e00',
    },

    reactionText: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: '900',
        color: '#a64646'
    },

    rinkNoteInput: {
        width: '100%',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 17,
        minHeight: 134,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        fontWeight: '900',
        lineHeight: 21,
        fontSize: 16,
        color: '#4a4a4a',
        marginBottom: 28
    },

    visitBtn: {
        width: '100%',
        padding: 14,
        borderRadius: 10,
        backgroundColor: '#8b1e00',
        alignItems: 'center',
        justifyContent: 'center',
    },

    visitBtnText: {
        fontSize: 26,
        fontWeight: '900',
        color: '#fff'
    }

});

export default VisitedRink;