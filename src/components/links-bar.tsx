import React, {
  FC,
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing, Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { infoAreaColor, lightGray, linkColor } from "../utils/colors";
import { getLinkPages } from "../utils";
import { NavigationStatusContext } from "../providers/navigation-status";
import { PageContext } from "../providers/page";
import { SettingsContext } from "../providers/settings";
import Icon from "react-native-vector-icons/MaterialIcons";
import { OrientationTypes, WindowContext } from "../providers/window";
import {
  fontSizeLarge,
  fontSizeMedium,
  iconSizeMedium,
  iconSizeSmall,
} from "../utils/constants";

const validPositiveNumber = (number: any): number => {
  const n = Number(number);

  if (!n || n <= 0.1 || isNaN(n)) {
    return 1;
  }

  return n;
};

const UnmemoizedLinksBar: FunctionComponent<{
  onPageChange: (page: string) => void;
}> = (props) => {
  const [scrollView, setScrollView] = useState<ScrollView>();

  const [completeScrollBarWidth, setCompleteScrollBarWidth] = useState(1);
  const [visibleScrollBarWidth, setVisibleScrollBarWidth] = useState(0);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  const { isLoadingPageData, page, subPage } = useContext(
    NavigationStatusContext,
  );
  const { textTvResponse } = useContext(PageContext);
  const { settings } = useContext(SettingsContext);

  const { applicationWindow, orientation } = useContext(WindowContext);

  const { width } = applicationWindow;

  const isLandscape = orientation === OrientationTypes.Landscape;

  const generatedLinks = useMemo(
    () =>
      isLoadingPageData ? [] : getLinkPages(page, subPage, textTvResponse),
    [isLoadingPageData, page, subPage, textTvResponse?.page],
  );

  const hasFavorites = settings.favorites.length > 0;

  const links = hasFavorites ? settings.favorites : generatedLinks;

  useEffect(() => scrollView?.scrollTo({ x: 0, y: 0, animated: false }), [
    links,
    scrollView,
    settings.favorites,
  ]);

  React.useEffect(() => {
    scaleAnim.setValue(0);

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  }, [scaleAnim, links]);

  const diff = validPositiveNumber(width - visibleScrollBarWidth);

  return (
    <View style={styles.linksBarContainer}>
      {!isLandscape && (
        <View style={styles.headerContainer}>
          <Animated.Text
            onLayout={(event: any) =>
              setVisibleScrollBarWidth(event.nativeEvent.layout.width)
            }
            style={{
              ...styles.text,
              transform: [
                {
                  translateX: Animated.multiply(
                    scrollX,
                    validPositiveNumber(
                      (width - visibleScrollBarWidth) /
                        (completeScrollBarWidth - width),
                    ),
                  ).interpolate({
                    inputRange: [0, diff],
                    outputRange: [0, diff],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}>
            {hasFavorites ? "Suosikkisivut" : "Sivun linkit"}
          </Animated.Text>
        </View>
      )}
      {isLandscape && (
        <View style={styles.headerContainerLandscape}>
          <Text style={styles.textLandscape}>
            {hasFavorites ? "Suosikit" : "Sivun linkit"}
          </Text>
        </View>
      )}
      <ScrollContainer
        isLandscape={isLandscape}
        scrollX={scrollX}
        setCompleteScrollBarWidth={setCompleteScrollBarWidth}
        setScrollView={setScrollView}
        width={width}>
        {links.map((link) => (
          <TouchableOpacity key={link} onPress={() => props.onPageChange(link)}>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.97]}
              colors={["#2b5876", "#4e4376"]}
              style={{
                ...styles.linkContainer,
                marginVertical: isLandscape ? 10 : 0,
              }}>
              {hasFavorites && settings.favoriteIcon !== "none" && (
                <Icon
                  style={styles.icon}
                  name={
                    settings.favoriteIcon === "heart"
                      ? "favorite-border"
                      : "star-border"
                  }
                  size={isLandscape ? iconSizeSmall : iconSizeMedium}
                  color="#FFFFFF"
                />
              )}
              <Animated.Text
                style={{
                  ...styles.link,
                  fontSize:
                    isLandscape && hasFavorites
                      ? fontSizeMedium
                      : fontSizeLarge,
                  opacity: scaleAnim,
                  transform: [{ scale: scaleAnim }],
                }}>
                {link}
              </Animated.Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollContainer>
    </View>
  );
};

export const LinksBar = React.memo(UnmemoizedLinksBar);

const ScrollContainer: FC<{
  isLandscape: boolean;
  width: number;
  setScrollView: React.Dispatch<React.SetStateAction<ScrollView | undefined>>;
  setCompleteScrollBarWidth: React.Dispatch<React.SetStateAction<number>>;
  scrollX: Animated.Value;
}> = ({
  children,
  isLandscape,
  width,
  setCompleteScrollBarWidth,
  setScrollView,
  scrollX,
}) => (
  <>
    {isLandscape && (
      <ScrollView
        horizontal={false}
        style={{
          ...styles.links,
          width: "100%",
          flexDirection: "column",
        }}
        contentContainerStyle={{
          ...styles.container,
          flexDirection: "column",
        }}
        ref={(ref) => ref && setScrollView(ref)}>
        {children}
      </ScrollView>
    )}
    {!isLandscape && (
      <ScrollView
        horizontal
        style={{ ...styles.links, width }}
        ref={(ref) => ref && setScrollView(ref)}
        contentContainerStyle={{
          ...styles.container,
          flexDirection: "row",
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={isLandscape}
        onContentSizeChange={(width) => {
          setCompleteScrollBarWidth(width);
        }}
        onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={10}>
        {children}
      </ScrollView>
    )}
  </>
);

const styles = StyleSheet.create({
  linksBarContainer: {
    display: "flex",
    flex: 1,
    backgroundColor: "#000000",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: infoAreaColor,
    // height: "100%",
  },
  links: {
    backgroundColor: infoAreaColor,
  },
  linkContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: linkColor,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  link: {
    color: "#FFFFFF",
    height: "100%",
    fontFamily: Platform.OS === "ios" ? undefined : "monospace",
  },
  icon: {
    marginRight: 2,
    alignSelf: "center",
  },
  text: {
    fontFamily: Platform.OS === "ios" ? undefined : "Roboto",
    fontSize: 14,
    lineHeight: 14,
    color: lightGray,
    backgroundColor: infoAreaColor,
    paddingHorizontal: 7,
    paddingTop: 5,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    position: "absolute",
  },
  headerContainer: {
    height: 19,
    display: "flex",
    flexDirection: "row",
    transform: [{ translateY: 1 }],
    position: "relative",
  },
  headerContainerLandscape: {
    height: "auto",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    backgroundColor: infoAreaColor,
  },
  textLandscape: {
    fontFamily: Platform.OS === "ios" ? undefined : "Roboto",
    fontSize: 14,
    lineHeight: 14,
    color: lightGray,
    paddingVertical: 4,
  },
});
