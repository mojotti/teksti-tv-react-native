import React from "react";
import { Linking, Platform, ScrollView, StyleSheet, Text } from "react-native";
import { bodyTextLinkColor, lightGray } from "../utils/colors";
import { Divider } from "./divider";
import packageJson from "../../package.json";
import { Button } from "./button";
import { BackNavigationHOC } from "./back-navigation-hoc";

export const Information = () => {
  return (
    <BackNavigationHOC>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>{`Tietoja sovelluksesta`}</Text>
        <Text
          style={
            styles.body
          }>{`Tämä sovellus näyttää YLE Teksti-TV:n sisältöä.`}</Text>
        <Text style={styles.body}>{`Lisätietoja: `}</Text>
        <Text
          style={{ ...styles.body, ...styles.link, ...styles.indent }}
          onPress={() => Linking.openURL("http://yle.fi")}>
          YLE
        </Text>
        <Text
          style={{ ...styles.body, ...styles.link, ...styles.indent }}
          onPress={() => Linking.openURL("https://yle.fi/aihe/tekstitv")}>
          YLE Teksti-TV
        </Text>

        <Divider />
        <Text style={styles.title}>{`Palaute`}</Text>
        <Text style={styles.body}>
          {"Auta Teksti-TV -sovelluksen kehitystä ja lähetä palautetta!"}
        </Text>
        <Button
          label={"Lähetä palautetta"}
          styles={{ marginVertical: 10 }}
          onPress={() =>
            Linking.openURL(
              `mailto:mojosoft.feedback@gmail.com?subject=Palautetta Teksti-TV:stä&body=Hei,\n\n`,
            )
          }
        />
        <Divider />

        <Text style={styles.title}>{`Versio`}</Text>
        <Text
          style={{
            ...styles.body,
            marginBottom: 60,
          }}>{`Sovelluksen versio: ${packageJson.version}`}</Text>
      </ScrollView>
    </BackNavigationHOC>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#000000",
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontFamily: Platform.OS === "ios" ? undefined : "sans-serif-thin",
    fontSize: 35,
    color: lightGray,
    marginBottom: 30,
  },
  body: {
    marginBottom: 20,
    fontFamily: Platform.OS === "ios" ? undefined : "sans-serif-thin",
    fontSize: 20,
    color: lightGray,
  },
  link: {
    textDecorationLine: "underline",
    fontWeight: "bold",
    color: bodyTextLinkColor,
  },
  indent: {
    paddingLeft: 14,
  },
});
