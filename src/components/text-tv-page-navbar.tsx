import { NavBar } from "./navbar";
import {
  fontSizeMedium,
  iconSizeMedium,
  iconSizeSmall,
  pageInfoHeight,
  pageInfoLandscapeWidth,
} from "../utils/constants";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { FC, useContext } from "react";
import { infoAreaColor } from "../utils/colors";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenNavigationProp } from "../../App";
import { SettingsContext } from "../providers/settings";
import { NavigationStatusContext } from "../providers/navigation-status";
import { PageContext } from "../providers/page";
import { OrientationTypes, WindowContext } from "../providers/window";

export const TextTvPageNavBar: React.FC<{
  isKeyboardVisible: boolean;
  refreshPage: () => void;
  setKeyboardVisibility: (isVisible: boolean) => void;
  subPageMax: string;
  onBackPress: () => void;
}> = (props) => {
  const { error } = useContext(PageContext);
  const { settings, storeValue } = useContext(SettingsContext);

  const { page, subPage, isLoadingImg, isLoadingPageData } = useContext(
    NavigationStatusContext,
  );

  const { applicationWindow, orientation } = useContext(WindowContext);

  const { width, height } = applicationWindow;

  const isLoading = isLoadingImg || isLoadingPageData;

  const hasUnknownError = error && error.code !== 404;

  const isLandscape = orientation === OrientationTypes.Landscape;

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const isPageInFavorites = settings.favorites.includes(page);

  const addPageToFavorites = () => {
    storeValue("favorites", [...new Set([...settings.favorites, page])].sort());
  };

  const removePageFromFavorites = () => {
    storeValue(
      "favorites",
      [
        ...new Set(settings.favorites.filter((favorite) => favorite !== page)),
      ].sort(),
    );
  };

  const showBackButton = page !== "100";

  return (
    <View
      style={{
        height: isLandscape ? height : pageInfoHeight,
        width: isLandscape ? pageInfoLandscapeWidth : width,
        backgroundColor: "black",
      }}>
      <NavBar
        style={{
          ...styles.pageInfo,
          ...(isLandscape ? styles.pageInfoLandscape : {}),
          height: "100%",
          width: "100%",
        }}>
        <MenuWrapper isLandscape={isLandscape}>
          <TouchableOpacity
            onPress={
              showBackButton ? props.onBackPress : navigation.openDrawer
            }>
            <Icon
              style={{
                ...styles.menu,
                marginRight: isLandscape ? 0 : 10,
                padding: isLandscape ? 10 : 0,
                marginBottom: isLandscape ? -10 : 0,
              }}
              name={showBackButton ? "arrow-back-ios" : "menu"}
              size={iconSizeMedium}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          {isLoading && !hasUnknownError && (
            <ActivityIndicator size={fontSizeMedium + 8} color="#FFFFFF" />
          )}
          {!isLoading && (
            <Text
              style={{ ...styles.pageInfoText, fontVariant: ["tabular-nums"] }}>
              {page || ""}
            </Text>
          )}
          {isLandscape && (
            <Text
              style={{ ...styles.pageInfoText, fontVariant: ["tabular-nums"] }}>
              {`${subPage}/${props.subPageMax}`}
            </Text>
          )}

          {(isLandscape || (page && !isLoading)) && (
            <TouchableOpacity
              onPress={() => {
                if (page && !isLoading) {
                  if (isPageInFavorites) {
                    removePageFromFavorites();
                  } else {
                    addPageToFavorites();
                  }
                }
              }}>
              <Icon
                style={{ ...styles.icon, marginRight: isLandscape ? 0 : 15 }}
                name={
                  settings.favoriteIcon === "heart"
                    ? isPageInFavorites
                      ? "favorite"
                      : "favorite-border"
                    : isPageInFavorites
                    ? "star"
                    : "star-border"
                }
                size={iconSizeSmall}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          )}
        </MenuWrapper>

        <MenuWrapper isLandscape={isLandscape}>
          <TouchableOpacity onPress={props.refreshPage}>
            <Icon
              style={{ ...styles.icon, marginRight: isLandscape ? 0 : 15 }}
              name="refresh"
              size={iconSizeMedium}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              props.setKeyboardVisibility(!props.isKeyboardVisible)
            }>
            <Icon
              style={{ ...styles.icon, marginRight: isLandscape ? 0 : 15 }}
              name="search"
              size={iconSizeMedium}
              color="#FFFFFF"
            />
          </TouchableOpacity>
          {!isLandscape && (
            <Text
              style={{ ...styles.pageInfoText, fontVariant: ["tabular-nums"] }}>
              {`${subPage}/${props.subPageMax}`}
            </Text>
          )}
        </MenuWrapper>
      </NavBar>
    </View>
  );
};

const MenuWrapper: FC<{ isLandscape: boolean }> = ({
  children,
  isLandscape,
}) => (
  <>
    {isLandscape && <>{children}</>}
    {!isLandscape && <View style={styles.horizontalContainer}>{children}</View>}
  </>
);

const styles = StyleSheet.create({
  pageInfo: {
    backgroundColor: infoAreaColor,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  pageInfoLandscape: {
    flexDirection: "column",
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  pageInfoText: {
    color: "#FFFFFF",
    fontSize: fontSizeMedium,
    fontFamily: Platform.OS === "ios" ? undefined : "monospace",
  },
  icon: {
    alignSelf: "center",
    padding: 10,
  },
  menu: {
    alignSelf: "center",
  },
  horizontalContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  verticalContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});
