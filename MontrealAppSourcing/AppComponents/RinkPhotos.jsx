import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Modal } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";

const MontrealRinkDetails = ({ rink }) => {
    const navigation = useNavigation();
    const [rinkPhotos, setRinkPhotos] = useState([]);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
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

        loadPhotos();
    }, []);

    useEffect(() => {
        const savePhotos = async () => {
            try {
                await AsyncStorage.setItem(`RINK_PHOTOS_${rink.name}`, JSON.stringify(rinkPhotos));
            } catch (e) {
                console.error('Failed to save photos:', e);
            }
        };

        if (rinkPhotos.length > 0) {
            savePhotos();
        }
    }, [rinkPhotos]);

    const uploadRinkPhotos = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                selectionLimit: 10,
            });

            if (!result.didCancel && result.assets) {
                const selected = result.assets.map(asset => asset.uri);
                const updatedPhotos = [...rinkPhotos, ...selected];
                setRinkPhotos(updatedPhotos);
            }
        } catch (error) {
            console.error('Error selecting images:', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Image source={require('../AppAssets/appIcons/back.png')}/>
            </TouchableOpacity>

            <Text style={styles.rinkName}>{rink.name.toUpperCase()}</Text>

            <Text style={[styles.rinkNameDetails, {marginBottom: 30}]}>PHOTOS</Text>

            <ScrollView style={{ width: '100%' }} contentContainerStyle={{flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                
                {
                    rinkPhotos.length > 0 ? (
                        <>
                            {rinkPhotos.map((photo, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        { width: '48%', height: 257, marginBottom: 13, borderRadius: 10, overflow: 'hidden' },
                                        selectedPhoto === photo && { borderWidth: 3, borderColor: '#8b1e00' }
                                    ]}
                                    onPress={() => {
                                        setSelectedPhoto(photo);
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    <Image source={{ uri: photo }} style={styles.rinkImage} />
                                </TouchableOpacity>
                            ))}
                        </>
                    ) : (
                        <Text style={[styles.rinkNameDetails, {textAlign: 'center', color: '#4a4a4a', marginBottom: 20}]}>ADD NEW PHOTOS</Text>
                    )
                }

                <View style={{height: 400}} />

            </ScrollView>
            
            <TouchableOpacity style={styles.viewPhotosBtn} onPress={uploadRinkPhotos}>
                <Text style={[styles.rinkNameDetails, {fontSize: 16}]}>UPLOAD</Text>
            </TouchableOpacity>

            {showDeleteModal && (
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={showDeleteModal}
                    onRequestClose={() => setShowDeleteModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>

                            <Text style={{ fontWeight: '900', fontSize: 16, marginBottom: 20 }}>Delete this photo?</Text>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setRinkPhotos(prev => prev.filter(uri => uri !== selectedPhoto));
                                        setShowDeleteModal(false);
                                    }}
                                    style={[styles.modalButton, { backgroundColor: '#8b1e00' }]}
                                >
                                    <Text style={{ color: '#fff', fontWeight: '700' }}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { setShowDeleteModal(false); setSelectedPhoto(null); }}
                                    style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                                >
                                    <Text style={{ color: '#000', fontWeight: '400' }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>
            )}

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

    rinkImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    rinkNameDetails: {
        fontSize: 18,
        lineHeight: 21,
        fontWeight: '900',
        color: '#8b1e00'
    },

    viewPhotosBtn: {
        width: 181,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#8b1e00',
        paddingVertical: 8,
        paddingHorizontal: 17,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        zIndex: 10
    },

    modalOverlay: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalContent: {
        width: '70%',
        backgroundColor: '#ffdd8f',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },

    modalButton: {
        width: '47%',
        padding: 8,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }

});

export default MontrealRinkDetails;