import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get('window');

const CrowdLevel = ({ rink }) => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1 }}>
            
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Image source={require('../AppAssets/appIcons/back.png')}/>
            </TouchableOpacity>

            <Text style={styles.rinkName}>{rink.name.toUpperCase()}</Text>

            <ScrollView style={{ width: '100%' }}>
                
                <Image source={rink.image} style={styles.rinkImage} />

                <View style={[styles.crowdedLevelContainer, {backgroundColor: rink.crowdLevel === 'BUSY' ? '#e38400' : '#009b22'}]}>
                    <Text style={[styles.rinkRating, { marginBottom: 0 }]}>{rink.crowdLevel}</Text>
                </View>

                <Image source={rink.crowdGraph} style={{ width: '100%', height: 187, resizeMode: 'contain', marginBottom: 13 }} />
                
                <View style={styles.rinkDetailsContainer}>
                    <Text style={[styles.rinkRating, {marginBottom: 20}]}>POPULAR HOURS</Text>
                    <View style={styles.row}>
                        <Text style={styles.rinkRating}>{rink.popularDays.toUpperCase()}</Text>
                        <Text style={styles.rinkRating}>{rink.popularHours.toUpperCase()}</Text>
                    </View>
                </View>

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
        padding: 20,
        backgroundColor: '#ffcb14'
    },

    rinkImage: {
        width: '100%',
        height: 156,
        borderRadius: 10,
        resizeMode: 'cover',
        marginBottom: 20
    },

    rinkRating: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '900',
        color: '#000',
    },

    crowdedLevelContainer: {
        width: '100%',
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 13
    },

    row: {
        width: '100%', 
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },

});

export default CrowdLevel;