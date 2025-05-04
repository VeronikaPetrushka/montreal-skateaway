import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MontrealFavRinks = () => {
    const navigation = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState('FAVORITE');
    const [favorites, setFavorites] = useState([]);
    const [visited, setVisited] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadFavorites();
            loadVisited();
        });

        return unsubscribe;
    });

    useEffect(() => {
        loadFavorites();
    }, [favorites]);

    const loadFavorites = async () => {
        try {
            const stored = await AsyncStorage.getItem('FAVORITE_RINKS');
            const parsed = stored ? JSON.parse(stored) : [];
            setFavorites(parsed);
        } catch (error) {
            alert('Failed to load favorites');
        }
    };

    const loadVisited = async () => {
        try {
            const stored = await AsyncStorage.getItem('VISITED_RINKS');
            const parsed = stored ? JSON.parse(stored) : [];
            setVisited(parsed);
        } catch (error) {
            alert('Failed to load visited rinks');
        }
    };

    const toggleFavoriteRink = async (rinkItem) => {
        try {
            const stored = await AsyncStorage.getItem('FAVORITE_RINKS');
            let favorites = stored ? JSON.parse(stored) : [];

            const exists = favorites.some(item => item.name === rinkItem.name);

            if (exists) {
                favorites = favorites.filter(item => item.name !== rinkItem.name);
            } else {
                favorites.push(rinkItem);
            }

            await AsyncStorage.setItem('FAVORITE_RINKS', JSON.stringify(favorites));
        } catch (error) {
            alert('Error toggling favorite rinks');
        }
    };

    const isRinkFavorite = (rinkItem) => {
        return favorites.some(fav => fav.name === rinkItem.name);
    };

    const rinksData = selectedCategory === 'FAVORITE' ? favorites : visited;

    return (
        <View style={{ flex: 1 }}>

            <Text style={styles.pageName}>MONTRÉAL RINKS</Text>

            <View style={styles.categoryiesPanel}>
                {
                    ['FAVORITE', 'VISITED'].map((rink, index) => (
                        <View key={index} style={{flexDirection: 'row', alignItems: 'center', height: '100%'}} >
                            <TouchableOpacity
                                onPress={() => setSelectedCategory(rink)}
                                style={[styles.categoryBtn, selectedCategory === rink && { backgroundColor: '#FFD59A' }]}
                            >
                                <Text style={styles.categoryBtnText}>{rink}</Text>
                            </TouchableOpacity>
                            {
                                index === 0 && (
                                    <View style={{ width: 1, height: '100%', backgroundColor: '#8b1e00', marginHorizontal: 20 }} />
                                )
                            }
                        </View>
                    ))
                }
            </View>
            
            <ScrollView style={{ width: '100%' }}>
                
                {
                    rinksData.map((item, idx) => (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => navigation.navigate('MontrealRinkDetailsPage', { rink: item })}
                            style={styles.rinkCard}
                        >
                            <Image source={item.image} style={styles.rinkImage} />

                            <View style={{ width: '57%'}}>

                                <View style={styles.row}>
                                    <Text style={styles.rinkName}>{item.name.toUpperCase()}</Text>
                                    <TouchableOpacity onPress={() => toggleFavoriteRink(item)}>
                                        <Image
                                            source={ isRinkFavorite(item) ? require('../AppAssets/appIcons/inFavourite.png') : require('../AppAssets/appIcons/notInFavourite.png')}
                                            style={{ width: 16, height: 16, resizeMode: 'contain' }}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.row}>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image
                                            source={require('../AppAssets/appIcons/star.png')}
                                            style={{ width: 12, height: 12, resizeMode: 'contain', marginRight: 3 }}
                                        />
                                        <Text style={styles.rinkRating}>{item.rating}</Text>
                                    </View>
                                    <Text style={styles.rinkRating}>{item.openingHours.toUpperCase()}</Text>
                                </View>

                                <Text style={styles.rinkRating}>{item.address}</Text>

                                <View style={styles.row}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {
                                            item.benefits.map((benefit, index) => (
                                                <Image
                                                    key={index}
                                                    source={benefit}
                                                    style={{ width: 16, height: 16, resizeMode: 'contain', marginRight: 12 }}
                                                />
                                            ))
                                        }
                                    </View>
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Image
                                            source={require('../AppAssets/appIcons/cost.png')}
                                            style={{ width: 16, height: 16, resizeMode: 'contain' }}
                                        />
                                        <Text style={[styles.rinkRating, {color: '#0043bd'}]}>{item.cost.toUpperCase()}</Text>
                                    </View>
                                </View>
                            </View>

                        </TouchableOpacity>
                    ))
                }

                <View style={{height: 300}} />
            </ScrollView>

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

    categoryiesPanel: {
        width: '100%',
        height: 60,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#8b1e00',
        padding: 16,
        marginBottom: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    categoryBtn: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 4,
    },

    categoryBtnText: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '900',
        color: '#000'
    },

    row: {
        width: '100%', 
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 3
    },

    rinkCard: {
        width: '100%', 
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#8b1e00',
        padding: 7,
        marginBottom: 8
    },

    rinkImage: {
        width: '40%',
        height: 107,
        borderRadius: 10,
        resizeMode: 'cover',
    },

    rinkName: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '900',
        color: '#8b1e00'
    },

    rinkRating: {
        fontSize: 13,
        lineHeight: 21,
        fontWeight: '900',
        color: '#000'
    }

});

export default MontrealFavRinks;