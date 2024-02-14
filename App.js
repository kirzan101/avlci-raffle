import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import ManageLead from './screens/ManageLead';
import RecentLeads from './screens/RecentLeads';
import AllLeads from './screens/AllLeads';

import { GlobalStyles } from './constants/styles';
import IconButton from './components/UI/IconButton';
import { Text } from 'react-native';
import LeadsContextProvider from './store/leads-context';
import UploadLeads from './screens/UploadLeads';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

function LeadsOverview() {
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary100 },
        headerTintColor: 'white',
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary100 },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="add"
            size={24}
            color={tintColor}
            onPress={() => {
              navigation.navigate('ManageLead');
            }}
          />
        ),
      })}
    >
      <BottomTabs.Screen
        name="AllLeads"
        component={AllLeads}
        options={{
          title: 'All Leads',
          tabBarLabel: 'All',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      {/* <BottomTabs.Screen
        name="RecentLeads"
        component={RecentLeads}
        options={{
          title: 'Recent Leads',
          tabBarLabel: 'Recent',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" size={size} color={color} />
          ),
        }}
      /> */}
      <BottomTabs.Screen
        name="Upload"
        component={UploadLeads}
        options={{
          title: 'Upload Leads',
          tabBarLabel: 'Upload',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cloud-upload-outline" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <LeadsContextProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: GlobalStyles.colors.primary100 },
              headerTintColor: 'white',
            }}
          >
            <Stack.Screen
              name="LeadsOverView"
              component={LeadsOverview}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ManageLead"
              component={ManageLead}
              options={{
                presentation: 'modal',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </LeadsContextProvider>
    </>
  );
}
