import { View, Text, Pressable, StyleSheet, GestureResponderEvent } from "react-native";
import React from "react";
import { btnBgColor, whiteTintColor } from "@/constants/colots";
import { Space } from "@/constants/Space";
import { FontSize } from "@/constants/FontSize";

const styles = StyleSheet.create({
  topbar: {
    marginTop: 50,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  topbarHeading: {
    fontSize: FontSize.large,
  },
  buttonWrpr:{
     flexDirection: "row"
  },
  button: {
    flex:1,
    marginHorizontal:Space.small,
    padding: Space.small,
    backgroundColor: btnBgColor, 
    color: whiteTintColor, 
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Space.small,
  },
  buttonText: {
    fontSize: FontSize.medium,
  },
});


type Props = {
  getMoreArticles: (event: GestureResponderEvent) => void
}

export default function Topbar(props: Props) {

  return (
    <>
      <View style={styles.topbar}>
        <Text style={styles.topbarHeading}>News</Text>
      </View>
      <View style={styles.buttonWrpr}>
        <Pressable onPress={props.getMoreArticles} style={styles.button}>
          <Text style={styles.buttonText}>Get More Articles</Text>
        </Pressable>
        {/* <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Reset Drip Timer</Text>
        </Pressable> */}
      </View>
    </>
  );
}
