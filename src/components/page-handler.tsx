import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  Alert,
  BackHandler,
  Platform,
  ToastAndroid,
  TouchableHighlight,
  View,
} from "react-native";
import ExtraDimensions from "react-native-extra-dimensions-android";

import { TextTVPage } from "./text-tv-page";
import { getNewSubPage, isValidPage } from "../utils";

import {
  GestureRecognizer,
  SwipeDirections,
  swipeDirections,
} from "./gesture-recognizer";
import { LinksBar } from "./links-bar";
import { PageContext } from "../providers/page";
import { LinkMapper } from "./link-mapper";
import { SettingsContext } from "../providers/settings";
import { HomeScreenNavigationProp } from "../../App";
import { useKeyboard } from "@react-native-community/hooks";
import { AppStateContext } from "../providers/app-state";
import { NavigationStatusContext } from "../providers/navigation-status";
import { OrientationTypes, WindowContext } from "../providers/window";
import {
  linkAreaHeight,
  linkAreaLandscapeWidth,
  portraitNoTouchBarArea,
} from "../utils/constants";
import { TextTvPageNavBar } from "./text-tv-page-navbar";

export const PageHandler: React.FunctionComponent = () => {
  const [isKeyboardVisible, setKeyboardVisibility] = useState<boolean>(false);
  const { fetchPage, error, invalidateCache, textTvResponse } =
    useContext(PageContext);

  const {
    page: currentPage,
    subPage: currentSubPage,
    setSubPage,
  } = useContext(NavigationStatusContext);

  const historyRef = useRef<string[]>([]);

  const { settings } = useContext(SettingsContext);

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const { appState } = useContext(AppStateContext);
  const { keyboardShown } = useKeyboard();

  useEffect(() => {
    if (appState === "active") {
      invalidateCache();
      fetchPage(currentPage, currentSubPage, true, true);
      // historyRef.current = [currentPage];
    }
  }, [appState]);

  useEffect(() => {
    historyRef.current = [
      ...new Set(historyRef.current.filter((page) => page !== currentPage)),
      currentPage,
    ];
  }, [currentPage]);

  useEffect(() => {
    fetchPage(currentPage, currentSubPage);
  }, [currentSubPage]);

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    if (isKeyboardVisible !== keyboardShown) {
      setKeyboardVisibility(keyboardShown);
    }
  }, [keyboardShown]);

  const toHomePage = () => {
    if (historyRef.current.length === 0 || !navigation.isFocused()) {
      return false;
    }

    if (historyRef.current.length === 1) {
      if (historyRef.current[0] === "100") {
        return false;
      }

      fetchPage("100", "1", false, true);
      historyRef.current = [];

      return true;
    }

    historyRef.current = historyRef.current.slice(0, -1);
    const prevPage = historyRef.current[historyRef.current.length - 1];

    fetchPage(prevPage, "1", false, true);

    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      toHomePage,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (error?.code === 404) {
      Platform.OS === "android"
        ? ToastAndroid.showWithGravity(
            `Sivua ${error.page} ei löydy.`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          )
        : Alert.alert(`📺👀 Sivua ${error.page} ei löydy.`);
    }
  }, [error]);

  const refreshPage = async () => {
    if (currentPage && currentSubPage) {
      await fetchPage(currentPage, currentSubPage, true);

      changeSubPage("next", currentSubPage);
    }
  };

  const onPageChange = (pageNumber: string) => {
    if (!isValidPage(pageNumber)) {
      return;
    }

    fetchPage(pageNumber, "1", false, true);
  };

  const changeSubPage = (direction: "next" | "back", sub?: string) => {
    const maxSubPage = textTvResponse?.page.subPageCount;

    if (!maxSubPage) {
      return;
    }

    const newSubPage =
      sub ||
      getNewSubPage(Number(currentSubPage), Number(maxSubPage), direction);

    if (!newSubPage) {
      return;
    }

    setSubPage(String(newSubPage));
  };

  const changePage = (direction: "next" | "back") => {
    if (direction === "back") {
      if (!textTvResponse?.page.prevPage) {
        return;
      }

      onPageChange(textTvResponse?.page.prevPage);
    } else {
      if (!textTvResponse?.page.nextPage) {
        return;
      }

      onPageChange(textTvResponse.page.nextPage);
    }
  };

  const onSwipe = (gestureName: SwipeDirections) => {
    if (error && error.code !== 404) {
      return;
    }

    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;

    switch (gestureName) {
      case SWIPE_LEFT:
        changePage("next");
        break;
      case SWIPE_RIGHT:
        changePage("back");
        break;
      case SWIPE_UP:
        changeSubPage("next");
        break;
      case SWIPE_DOWN:
        changeSubPage("back");
        break;
    }
  };

  const { orientation } = useContext(WindowContext);

  const isLandscape = orientation === OrientationTypes.Landscape;

  const softMenuHeight =
    Platform.OS === "ios" ? 0 : ExtraDimensions.getSoftMenuBarHeight();

  return (
    <Container isLandscape={isLandscape}>
      <TextTvPageNavBar
        isKeyboardVisible={isKeyboardVisible}
        refreshPage={refreshPage}
        setKeyboardVisibility={setKeyboardVisibility}
        subPageMax={textTvResponse?.page.subPageCount || "1"}
        onBackPress={toHomePage}
      />
      <GestureRecognizer
        onSwipe={onSwipe}
        style={{ flex: 1, position: "relative" }}>
        <TouchableHighlight
          onPress={() => setKeyboardVisibility(!isKeyboardVisible)}
          style={{
            flex: 1,
            position: "relative",
          }}>
          <LinkMapper
            onPageChange={onPageChange}
            isKeyboardVisible={isKeyboardVisible}>
            <TextTVPage
              onPageChange={onPageChange}
              isKeyboardVisible={isKeyboardVisible}
              setKeyboardVisibility={(isVisible) =>
                setKeyboardVisibility(isVisible)
              }
            />
          </LinkMapper>
        </TouchableHighlight>
      </GestureRecognizer>

      {(isLandscape || !isKeyboardVisible) && (
        <>
          <View
            style={{
              height: isLandscape ? "100%" : linkAreaHeight,
              width: isLandscape ? linkAreaLandscapeWidth : "100%",
            }}>
            {!(error && error.code !== 404) ? (
              <LinksBar onPageChange={onPageChange} />
            ) : (
              <View style={{ flex: 1, backgroundColor: "#000000" }} />
            )}
          </View>
          {Platform.OS === "android" && softMenuHeight === 0 && !isLandscape && (
            <View
              style={{
                height: portraitNoTouchBarArea,
                width: "100%",
                backgroundColor: "#000000",
              }}
            />
          )}
        </>
      )}
    </Container>
  );
};

const Container: FC<{ isLandscape: boolean }> = ({ children, isLandscape }) => (
  <View style={{ display: "flex", flex: 1, backgroundColor: "black" }}>
    {isLandscape && (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
        }}>
        {children}
      </View>
    )}
    {!isLandscape && <>{children}</>}
  </View>
);
