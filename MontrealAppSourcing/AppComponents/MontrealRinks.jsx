import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import montrealRinks from '../AppConstants/montrealRinks';

const MontrealRinks = () => {
    const navigation = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState(montrealRinks[0]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadFavorites();
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
            console.error('Failed to load favorites:', error);
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
            console.error('Error toggling favorite rink:', error);
        }
    };

    const isRinkFavorite = (rinkItem) => {
        return favorites.some(fav => fav.name === rinkItem.name);
    };

    return (
        <View style={{ flex: 1 }}>

            <Text style={styles.pageName}>MONTRÉAL RINKS</Text>
            
            <View style={styles.categoryiesPanel}>
                <ScrollView horizontal contentContainerStyle={{alignItems: 'center', flexDirection: 'row'}} showsHorizontalScrollIndicator={false}>
                    {
                        montrealRinks.map((rink, index) => (
                            <View key={index} style={{flexDirection: 'row', alignItems: 'center', height: '100%'}} >
                                <TouchableOpacity
                                    onPress={() => setSelectedCategory(rink)}
                                    style={[styles.categoryBtn, selectedCategory === rink && { backgroundColor: '#FFD59A' }]}
                                >
                                    <Text style={styles.categoryBtnText}>{rink.category}</Text>
                                </TouchableOpacity>
                                {
                                    index !== montrealRinks.length - 1 && (
                                        <View style={{ width: 1, height: '100%', backgroundColor: '#8b1e00', marginHorizontal: 9 }} />
                                    )
                                }
                            </View>
                        ))
                    }
                </ScrollView>
            </View>

            <ScrollView style={{ width: '100%' }}>
                
                {
                    selectedCategory.items.map((item, idx) => (
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
        height: 60,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#8b1e00',
        padding: 16,
        marginBottom: 18
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

export default MontrealRinks;