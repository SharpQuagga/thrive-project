import { View, Text, StyleSheet, Image, Animated } from "react-native";
import React, { memo, useMemo } from "react";
import { NewsArticle } from "../types";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { newsItemBgColor } from "@/constants/colots";
import { Space } from "@/constants/Space";
import { FontSize } from "@/constants/FontSize";

const styles = StyleSheet.create({
  newsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Space.small,
    backgroundColor: newsItemBgColor,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: Space.small,
    flex: 3,
  },
  title: {
    fontSize: FontSize.medium,
    fontWeight: "bold",
  },
  leftItems: {
    flex: 7,
    marginRight: Space.medium,
  },
  description: {
    fontSize: FontSize.small,
  },
});

type Props = {
  item: NewsArticle;
  deleteArticle: Function | undefined;
  pinArticle: Function | undefined;
  isPinned: boolean | undefined;
};

export default function NewsItem(props: Props) {
  const { pinArticle, deleteArticle, isPinned } = props;
  const { title, description, author, urlToImage } = props.item;

  const swipeActions = (text: string) => {
    return (
      <View
        style={{
          backgroundColor: "#ff8303",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Text
          style={{
            color: "#1b1a17",
            fontWeight: "600",
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}
        >
          {text}
        </Text>
      </View>
    );
  };

  const swipeFromLeftOpen = () => {
    pinArticle && pinArticle(props.item);
  };
  const swipeFromRightOpen = () => {
    deleteArticle && deleteArticle(title);
  };

  const newsArticle = useMemo(() => {
    return (
      <View style={styles.newsItem}>
        <View style={styles.leftItems}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
          <Text
            style={styles.description}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {description}
          </Text>
        </View>

        <Image
          source={{ uri: urlToImage }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }, []);

  if (isPinned) {
    return <>{newsArticle}</>;
  }

  return (
    <GestureHandlerRootView>
      <Swipeable
        key={title}
        friction={2}
        leftThreshold={80}
        rightThreshold={80}
        renderLeftActions={() => swipeActions("Pin")}
        renderRightActions={() => swipeActions("Delete")}
        onSwipeableRightOpen={swipeFromRightOpen}
        onSwipeableLeftOpen={swipeFromLeftOpen}
      >
        {newsArticle}
      </Swipeable>
    </GestureHandlerRootView>
  );
}
