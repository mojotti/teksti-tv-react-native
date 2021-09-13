import "react-native-gesture-handler";
import React, { FC } from "react";
import { PageHandler } from "./src/components/page-handler";
import { PageProvider } from "./src/providers/page";
import { NavigationContainer } from "@react-navigation/native";
import { Settings } from "./src/components/settings";
import { SettingsProvider } from "./src/providers/settings";
import { AppStateProvider } from "./src/providers/app-state";
import { NavigationStatusProvider } from "./src/providers/navigation-status";
import { DeveloperPage } from "./src/components/developer-page";
import { WindowProvider } from "./src/providers/window";
import { SafeAreaView, StatusBar } from "react-native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { pageInfoHeight } from "./src/utils/constants";

const App: FC = () => (
  <AppStateProvider>
    <WindowProvider>
      <SettingsProvider>
        <NavigationStatusProvider>
          <PageProvider>
            <NavigationContainer>
              <Navigator />
            </NavigationContainer>
          </PageProvider>
        </NavigationStatusProvider>
      </SettingsProvider>
    </WindowProvider>
  </AppStateProvider>
);

export default App;

export type RootStackParamList = {
  Home: undefined;
  Information: undefined;
  Settings: undefined;
  Development?: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

const Navigator: FC = () => {
  const Stack = createStackNavigator();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar barStyle={"light-content"} />
      <Stack.Navigator initialRouteName="Home" detachInactiveScreens>
        <Stack.Screen
          name="Home"
          component={PageHandler}
          options={{
            title: "Teksti-TV",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            title: "Asetukset",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#1c1c1c",
              height: pageInfoHeight,
            },
            headerTitleStyle: {
              color: "#eeeeee",
            },
            // header: () => <Header title={"Asetukset"} />,
          }}
        />
        {__DEV__ && (
          <Stack.Screen
            name="Development"
            component={DeveloperPage}
            options={{
              title: "Kehittäjäsivu",
              headerShown: true,
              // header: () => <Header title={"Kehittäjäsivu"} />,
            }}
          />
        )}
      </Stack.Navigator>
    </SafeAreaView>
  );
};
