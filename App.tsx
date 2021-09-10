import "react-native-gesture-handler";
import React, { FC, useContext } from "react";
import { PageHandler } from "./src/components/page-handler";
import { PageProvider } from "./src/providers/page";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerNavigationProp } from "@react-navigation/drawer/lib/typescript/src/types";
import { Information } from "./src/components/information";
import { infoAreaColor } from "./src/utils/colors";
import { Header } from "./src/components/drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Settings } from "./src/components/settings";
import { SettingsProvider } from "./src/providers/settings";
import { AppStateProvider } from "./src/providers/app-state";
import { NavigationStatusProvider } from "./src/providers/navigation-status";
import { DeveloperPage } from "./src/components/developer-page";
import { WindowContext, WindowProvider } from "./src/providers/window";
import { SafeAreaView, StatusBar } from "react-native";

const App: FC = () => (
  <AppStateProvider>
    <WindowProvider>
      <SettingsProvider>
        <NavigationStatusProvider>
          <PageProvider>
            <NavigationContainer>
              <DrawerMenu />
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

export type HomeScreenNavigationProp = DrawerNavigationProp<
  RootStackParamList,
  "Home"
>;

const DrawerMenu: FC = () => {
  const Drawer = createDrawerNavigator<RootStackParamList>();

  const { height } = useContext(WindowContext).applicationWindow;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar barStyle={"light-content"} />
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          drawerActiveTintColor: "#dbe9df",
          drawerItemStyle: { marginVertical: 4 },
          drawerLabelStyle: { fontSize: 17, color: "#e5e5e5" },
          drawerActiveBackgroundColor: "#008755",
          drawerPosition: "left",
          gestureEnabled: false,
          drawerStyle: {
            backgroundColor: infoAreaColor,
            paddingTop: height * 0.15,
          },
        }}
        backBehavior="none"
        detachInactiveScreens
        defaultStatus="closed">
        <Drawer.Screen
          name="Home"
          component={PageHandler}
          options={{
            title: "Pääsivu",
            headerShown: false,
            drawerIcon: () => <Icon name={"tv"} size={24} color="#FFFFFF" />,
          }}
        />
        <Drawer.Screen
          name="Information"
          component={Information}
          options={{
            title: "Tietoja",
            headerShown: true,
            header: () => <Header title={"Tietoja"} />,
            drawerIcon: () => <Icon name={"info"} size={24} color="#FFFFFF" />,
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={Settings}
          options={{
            title: "Asetukset",
            headerShown: true,
            header: () => <Header title={"Asetukset"} />,
            drawerIcon: () => (
              <Icon name={"settings"} size={24} color="#FFFFFF" />
            ),
          }}
        />
        {__DEV__ && (
          <Drawer.Screen
            name="Development"
            component={DeveloperPage}
            options={{
              title: "Kehittäjäsivu",
              headerShown: true,
              header: () => <Header title={"Kehittäjäsivu"} />,
              drawerIcon: () => (
                <Icon name={"code"} size={24} color="#FFFFFF" />
              ),
            }}
          />
        )}
      </Drawer.Navigator>
    </SafeAreaView>
  );
};
