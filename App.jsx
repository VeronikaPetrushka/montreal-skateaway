import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashLoaderPage from './MontrealAppSourcing/AppPages/SplashLoaderPage';

import MontrealRinksPage from './MontrealAppSourcing/AppPages/MontrealRinksPage';
import MontrealRinkDetailsPage from './MontrealAppSourcing/AppPages/MontrealRinkDetailsPage';
import RinkPhotosPage from './MontrealAppSourcing/AppPages/RinkPhotosPage';
import CrowdLevelPage from './MontrealAppSourcing/AppPages/CrowdLevelPage';
import VisitedRinkPage from './MontrealAppSourcing/AppPages/VisitedRinkPage';
import MontrealFavRinksPage from './MontrealAppSourcing/AppPages/MontrealFavRinksPage';
import MontrealIceRinkHockeyPage from './MontrealAppSourcing/AppPages/MontrealIceRinkHockeyPage';
import MontrealSettingsPage from './MontrealAppSourcing/AppPages/MontrealSettingsPage';
import MontrealDeveloperInfoPage from './MontrealAppSourcing/AppPages/MontrealDeveloperInfoPage';

enableScreens();

const Stack = createStackNavigator();

const App = () => {

  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName={"SplashLoaderPage" }>    
              <Stack.Screen 
                    name="SplashLoaderPage" 
                    component={SplashLoaderPage} 
                    options={{ headerShown: false }} 
              />
              <Stack.Screen 
                    name="MontrealRinksPage" 
                    component={MontrealRinksPage} 
                    options={{ headerShown: false }} 
              />
              <Stack.Screen 
                    name="MontrealRinkDetailsPage" 
                    component={MontrealRinkDetailsPage} 
                    options={{ headerShown: false }} 
              />
              <Stack.Screen 
                    name="RinkPhotosPage" 
                    component={RinkPhotosPage} 
                    options={{ headerShown: false }} 
              />
              <Stack.Screen 
                    name="CrowdLevelPage" 
                    component={CrowdLevelPage} 
                    options={{ headerShown: false }} 
              />
              <Stack.Screen 
                    name="VisitedRinkPage" 
                    component={VisitedRinkPage} 
                    options={{ headerShown: false }} 
              />
              <Stack.Screen 
                    name="MontrealFavRinksPage" 
                    component={MontrealFavRinksPage} 
                    options={{ headerShown: false }} 
              />
              <Stack.Screen 
                    name="MontrealIceRinkHockeyPage" 
                    component={MontrealIceRinkHockeyPage} 
                    options={{ headerShown: false }} 
              />
              <Stack.Screen 
                    name="MontrealSettingsPage" 
                    component={MontrealSettingsPage} 
                    options={{ headerShown: false }} 
              />
              <Stack.Screen 
                    name="MontrealDeveloperInfoPage" 
                    component={MontrealDeveloperInfoPage} 
                    options={{ headerShown: false }} 
              />
          </Stack.Navigator>
      </NavigationContainer>
    );
};

export default App;
