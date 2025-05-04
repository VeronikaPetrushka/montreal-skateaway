import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native";

const MontrealDeveloperInfo = () => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1 }}>

            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Image source={require('../AppAssets/appIcons/back.png')}/>
            </TouchableOpacity>
            
            <Text style={styles.pageName}>DEVELOPER INFO</Text>

            <ScrollView style={{width: '100%'}}>

                <Text style={styles.text}>{`This app was created with love for winter, skating, and the vibrant community of Montreal.`.toUpperCase()}</Text>

                <Text style={styles.text}>{`we are passionate about meaningful digital experiences, I built this application to help locals and visitors easily explore the city's skating rinks—from scenic Old Port to hidden neighborhood gems like Howie-Morenz and Saint-Michel. Whether you're planning your next skate or just discovering new places to glide, this app is designed to make your journey smooth, beautiful, and fun.`.toUpperCase()}</Text>

                <Text style={styles.text}>{`Thank you for skating with us!`.toUpperCase()}</Text>

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

    pageName: {
        alignSelf: 'center',
        textAlig: 'center',
        fontSize: 26,
        fontWeight: '900',
        color: '#000',
        marginBottom: 46
    },

    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: '900',
        color: '#4a4a4a',
        marginBottom: 20
    }

});

export default MontrealDeveloperInfo;