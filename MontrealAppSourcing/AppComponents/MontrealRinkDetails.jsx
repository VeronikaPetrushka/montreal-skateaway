import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Dimensions, TextInput } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, } from "@react-navigation/native";

const MontrealRinkDetails = ({ rink }) => {
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState([]);
    const [rinkPhotos, setRinkPhotos] = useState([]);
    const [rinkNote, setRinkNote] = useState(null);
    const [visitDate, setVisitDate] = useState(null);
    const [reaction, setReaction] = useState(null);
    const [rinkNote2, setRinkNote2] = useState(null);
    const [visited, setVisited] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadFavorites();
            loadPhotos();
            loadVisitedData();
        });

        return unsubscribe;
    });

    useEffect(() => {
        loadFavorites();
    }, [favorites]);

    useEffect(() => {
        loadPhotos();
    }, [rinkPhotos]);

    useEffect(() => {
        loadVisitedData();
    }, [visitDate, reaction, rinkNote2]);

    useEffect(() => {
        loadNote();
        loadPhotos();
        loadVisitedData();
    }, []);

    const loadFavorites = async () => {
        try {
            const stored = await AsyncStorage.getItem('FAVORITE_RINKS');
            const parsed = stored ? JSON.parse(stored) : [];
            setFavorites(parsed);
        } catch (error) {
            console.error('Failed to load favorites:', error);
        }
    };

    const toggleFavoriteRink = async () => {
        try {
            const stored = await AsyncStorage.getItem('FAVORITE_RINKS');
            let favorites = stored ? JSON.parse(stored) : [];

            const exists = favorites.some(item => item.name === rink.name);

            if (exists) {
                favorites = favorites.filter(item => item.name !== rink.name);
            } else {
                favorites.push(rink);
            }

            await AsyncStorage.setItem('FAVORITE_RINKS', JSON.stringify(favorites));
        } catch (error) {
            console.error('Error toggling favorite rink:', error);
        }
    };

    const isRinkFavorite = () => {
        return favorites.some(fav => fav.name === rink.name);
    };

    const loadPhotos = async () => {
        try {
            const stored = await AsyncStorage.getItem(`RINK_PHOTOS_${rink.name}`);
            if (stored) {
                setRinkPhotos(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load photos:', e);
        }
    };

    const loadNote = async () => {
        try {
            const storedNote = await AsyncStorage.getItem(`RINK_NOTE_${rink.name}`);
            if (storedNote) setRinkNote(storedNote);
        } catch (e) {
            console.error('Failed to load note:', e);
        }
    };

    const loadVisitedData = async () => {
        try {
            const stored = await AsyncStorage.getItem(`VISITED_RINK_${rink.name}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.date) setVisitDate(parsed.date);
                if (parsed.reaction) setReaction(parsed.reaction);
                if (parsed.note) setRinkNote2(parsed.note);
                setVisited(true);
            }
        } catch (error) {
            console.error('Failed to load visited rink data:', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Image source={require('../AppAssets/appIcons/back.png')}/>
            </TouchableOpacity>

            <Text style={styles.rinkName}>{rink.name.toUpperCase()}</Text>

            <ScrollView style={{width: '100%'}}>

                <View style={styles.rinkDetailsContainer}>
                    <Image source={rink.image} style={styles.rinkImage} />

                    <View style={styles.row}>
                        <Text style={styles.rinkNameDetails}>{rink.name.toUpperCase()}</Text>
                        
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                                source={require('../AppAssets/appIcons/star.png')}
                                style={{ width: 12, height: 12, resizeMode: 'contain', marginRight: 3 }}
                            />
                            <Text style={styles.rinkRating}>{rink.rating}</Text>
                        </View>

                        <TouchableOpacity onPress={toggleFavoriteRink}>
                            <Image
                                source={ isRinkFavorite ? require('../AppAssets/appIcons/inFavourite.png') : require('../AppAssets/appIcons/notInFavourite.png')}
                                style={{ width: 17, height: 17, resizeMode: 'contain' }}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.rinkRating, {marginBottom: 20}]}>{rink.openingHours.toUpperCase()}</Text>

                    <Text style={styles.rinkRating}>ADDRESS</Text>
                    <Text style={[styles.rinkRating, {marginBottom: 20}]}>{rink.address}</Text>

                    <View style={styles.row}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                                style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 6}}
                                source={rink.lightening ? require('../AppAssets/appIcons/true.png')
                                    : require('../AppAssets/appIcons/false.png')}
                            />
                            <Text style={styles.rinkRating}>LIGHTENING</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image
                                style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 6}}
                                source={rink.music ? require('../AppAssets/appIcons/true.png')
                                    : require('../AppAssets/appIcons/false.png')}
                            />
                            <Text style={styles.rinkRating}>MUSIC</Text>
                        </View>
                    </View>

                    <View style={[styles.row, {marginBottom: 8}]}>
                        <Text style={styles.rinkRating}>1 SESSION - 1 HOUR</Text>
                        <Text style={[styles.rinkRating, {color: '#8b1e00'}]}>{rink.sessionsCost.toUpperCase()}</Text>
                    </View>

                    <View style={[styles.row, {marginBottom: 8}]}>
                        <Text style={styles.rinkRating}>RENTAL SKATE</Text>
                        <Text style={[styles.rinkRating, {color: '#8b1e00'}]}>{rink.skateRentalCost.toUpperCase()}</Text>
                    </View>

                    <View style={[styles.row, {marginBottom: 0}]}>
                        <Text style={styles.rinkRating}>WARDROBE</Text>
                        <Text style={[styles.rinkRating, {color: '#8b1e00'}]}>{rink.wardrobe.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={[styles.rinkDetailsContainer, {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
                    <Image source={require('../AppAssets/appDecor/crowd.png')} style={{width: 30, height: 30, resizeMode: 'contain'}} />
                    <Text style={[styles.rinkRating, { marginBottom: 0 }]}>CROWD LEVEL</Text>
                    <View style={[styles.crowdedLevelContainer, {backgroundColor: rink.crowdLevel === 'BUSY' ? '#e38400' : '#009b22'}]}>
                        <Text style={[styles.rinkRating, { marginBottom: 0 }]}>{rink.crowdLevel}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CrowdLevelPage', { rink })}
                    >
                        <Image
                            source={require('../AppAssets/appIcons/back.png')}
                            style={{ width: 8, height: 13, tintColor: '#8b1e00', transform: [{ rotate: '180deg' }] }}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.rinkDetailsContainer}>
                    
                    {
                        rinkPhotos.length > 0 && (
                            <>
                                <Text style={[styles.rinkNameDetails, { marginBottom: 16 }]}>PHOTOS & NOTES</Text>
                                <View style={styles.row}>
                                    {
                                        rinkPhotos.slice(-3).map((photo, index) => (
                                            <Image
                                                key={index}
                                                source={{uri: photo}}
                                                style={{
                                                    width: rinkPhotos.length === 1 ? '100%' : rinkPhotos.length === 2 ? '48%' : '30%',
                                                    height: 108,
                                                    borderRadius: 10,
                                                    resizeMode: 'cover',
                                                    marginRight: rinkPhotos.length === 2 && index === 0 ? '4%' : 0
                                                }}
                                            />
                                        ))
                                    }
                                </View>
                            </>
                        )
                    }
                    <TouchableOpacity style={styles.viewPhotosBtn} onPress={() => navigation.navigate('RinkPhotosPage', { rink })}>
                        <Text style={[styles.rinkNameDetails, { fontSize: 15 }]}>{rinkPhotos.length > 0 ? 'VIEW ALL PHOTOS' : 'ADD PHOTOS'}</Text>
                    </TouchableOpacity>
                    <Text style={[styles.rinkNameDetails, {marginBottom: 16}]}>ADD YOUR NOTE</Text>
                    <TextInput
                        style={styles.rinkNoteInput}
                        value={rinkNote}
                        onChangeText={(text) => {
                            setRinkNote(text);
                            AsyncStorage.setItem(`RINK_NOTE_${rink.name}`, text);
                        }}
                        placeholder="SHARE YOUR EXPERIENCE"
                        placeholderTextColor='#4A4A4A'
                        multiline
                    />

                    {
                        visited && (
                            <>
                                {visitDate && (<Text style={styles.rinkDate}>{visitDate}</Text>)}

                                {
                                    rinkNote2 && (
                                        <View style={styles.rinkNoteContainer}>
                                            <Text style={styles.rinkNote}>{rinkNote2}</Text>
                                        </View>
                                    )
                                }

                                {
                                    reaction && (
                                        <View style={styles.reactionBtn}>
                                            <Image source={reaction.image} style={{ width: 44, height: 44, resizeMode: 'contain' }} />
                                            <Text style={styles.reactionText}>{reaction.text}</Text>
                                        </View>
                                    )
                                }
                            </>
                        )
                    }

                </View>

                <TouchableOpacity style={styles.visitBtn} onPress={() => navigation.navigate('VisitedRinkPage', { rink })}>
                    <Text style={styles.visitBtnText}>{visited ? 'ALREADY VISITED' : 'VISIT'}</Text>
                </TouchableOpacity>

                <View style={{height: 100}} />

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

    rinkDetailsContainer: {
        width: '100%', 
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#8b1e00',
        padding: 20,
        marginBottom: 16
    },

    rinkImage: {
        width: '100%',
        height: 156,
        borderRadius: 10,
        resizeMode: 'cover',
        marginBottom: 20
    },

    row: {
        width: '100%', 
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 20
    },

    rinkNameDetails: {
        fontSize: 18,
        lineHeight: 21,
        fontWeight: '900',
        color: '#8b1e00'
    },

    rinkRating: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '900',
        color: '#000',
    },

    crowdedLevelContainer: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
    },

    viewPhotosBtn: {
        width: 181,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#8b1e00',
        paddingVertical: 8,
        paddingHorizontal: 17,
        marginBottom: 16,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },

    rinkNoteInput: {
        width: '100%',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#4a4a4a',
        paddingVertical: 8,
        paddingHorizontal: 17,
        minHeight: 276,
        fontWeight: '900',
        lineHeight: 21,
        fontSize: 16,
        color: '#4a4a4a',
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
    },

    rinkNoteContainer: {
        width: '100%',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 17,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginTop: 16
    },

    rinkNote: {
        fontWeight: '900',
        lineHeight: 21,
        fontSize: 16,
        color: '#4a4a4a',
    },

    reactionBtn: {
        width: 110,
        height: 110,
        paddingVertical: 15,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#8b1e00',
        marginTop: 16
    },

    reactionText: {
        fontSize: 14,
        lineHeight: 21,
        fontWeight: '900',
        color: '#a64646'
    },

    rinkDate: {
        fontSize: 18,
        lineHeight: 21,
        fontWeight: '900',
        color: '#8b1e00',
        marginTop: 16
    }

});

export default MontrealRinkDetails;