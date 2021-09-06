import Icon from "react-native-vector-icons/MaterialIcons";
import { StyleSheet, TouchableOpacity, Text, Platform } from "react-native";
import React from "react";
import { HomeScreenNavigationProp } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { NavBar } from "./navbar";
import { iconSizeMedium, pageInfoHeight } from "../utils/constants";

export const Header = (props: { title: string }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <NavBar style={styles.container}>
      <TouchableOpacity onPress={navigation.openDrawer}>
        <Icon name={"menu"} size={iconSizeMedium} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.title}>{props.title}</Text>
    </NavBar>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
    height: pageInfoHeight,
  },
  title: {
    marginLeft: 20,
    fontFamily: Platform.OS === "ios" ? undefined : "sans-serif-thin",
    fontWeight: "bold",
    fontSize: 20,
    color: "#ebebeb",
  },
});
