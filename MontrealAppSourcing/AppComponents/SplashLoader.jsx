import { View, Image, TouchableOpacity, Dimensions } from "react-native"
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get('window');

const SplashLoader = () => {
    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            
            <Image
                source={require('../AppAssets/appDecor/appLogo.png')}
                style={{ width: '100%', height: height * 0.4, resizeMode: 'contain', marginBottom: height * 0.07 }}
            />

            <TouchableOpacity onPress={() => navigation.navigate('MontrealRinksPage')}>
                <Image
                    source={require('../AppAssets/appDecor/appSplashBtn.png')}
                    style={{ width: '100%', height: 61, resizeMode: 'contain' }}
                />
            </TouchableOpacity>

        </View>
    )
};

export default SplashLoader;