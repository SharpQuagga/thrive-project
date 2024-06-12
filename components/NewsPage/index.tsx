import {
  View,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { API_URL } from "@/constants/ApiEndpoints";
import * as SplashScreen from "expo-splash-screen";
import Topbar from "../Topbar";
import NewsItem from "../NewsItem";
import {
  NEXT_BATCH_LENGTH,
  deleteArticlesWithTitle,
  retrieveNewsArticles,
  storeNewsArticles,
} from "@/utils";
import { NewsArticle } from "../types";
import { headingBoldColor, itemSeparator } from "@/constants/colots";
import { Space } from "@/constants/Space";
import { FontSize } from "@/constants/FontSize";

const styles = StyleSheet.create({
  headingBold: {
    fontSize: FontSize.medium,
    fontWeight: "900",
    padding: Space.small,
    color: headingBoldColor,
  },
  itemSeparator: {
    backgroundColor: itemSeparator,
    height: StyleSheet.hairlineWidth,
  },
  viewFlex: { flex: 1 }
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

let isSplashHidden = false;
export default function NewsPage() {
  const [newsData, setNewsData] = useState<NewsArticle[]>([]);
  const [pinnedArticles, setPinnedArticles] = useState<NewsArticle[]>([]);
  const nextArticleIndex = useRef<number>(0);
  const intervalId = useRef<NodeJS.Timeout>();
  const totalResults = useRef<number>(0);

  useEffect(() => {
    intervalId.current = setInterval(() => {
      if (
        nextArticleIndex.current + NEXT_BATCH_LENGTH >=
        totalResults.current
      ) {
        fetchNewsArticles();
      } else {
        retrieveNewsArticles(nextArticleIndex.current).then((newArticles) => {
          setNewsData([...newArticles, ...newsData]);
          nextArticleIndex.current += NEXT_BATCH_LENGTH;
        });
      }
    }, 5000);

    return () => clearInterval(intervalId.current);
  }, [nextArticleIndex, newsData]);

  useEffect(() => {
    if (newsData && newsData.length > 0 && !isSplashHidden) {
      isSplashHidden = true;
      SplashScreen.hideAsync();
    }
  }, [newsData]);

  const fetchNewsArticles = useCallback(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (data.articles) {
          storeNewsArticles(data.articles);
          setNewsData(data.articles.slice(0, 10));
          totalResults.current = data.totalResults;
          nextArticleIndex.current = 11;
        }
      })
      .catch((err) => console.log("error", err));
  }, []);

  useEffect(() => {
    fetchNewsArticles();
  }, []);

  const getMoreArticles = useCallback(() => {
    if (nextArticleIndex.current + NEXT_BATCH_LENGTH >= totalResults.current) {
      fetchNewsArticles();
    } else if (newsData) {
      retrieveNewsArticles(nextArticleIndex.current).then((newArticles) => {
        setNewsData([...newArticles, ...newsData]);
        nextArticleIndex.current += NEXT_BATCH_LENGTH;
        clearInterval(intervalId.current);
      });
    }
  }, [newsData]);

  const deleteArticle = useCallback(
    (title: string) => {
      setNewsData(deleteArticlesWithTitle(newsData, title));
    },
    [newsData]
  );

  const pinArticle = useCallback(
    (article: NewsArticle) => {
      setNewsData(deleteArticlesWithTitle(newsData, article.title));
      setPinnedArticles([...pinnedArticles, article]);
    },
    [pinnedArticles, newsData]
  );

  return (
    <View style={styles.viewFlex}>
      <Topbar getMoreArticles={getMoreArticles} />
      <>
        {pinnedArticles && pinnedArticles.length > 0 ? (
          <View style={{ minHeight: 70 }}>
            <Text style={styles.headingBold}>Pinned Articles</Text>
            <FlatList
              data={pinnedArticles}
              renderItem={({ item }) => <NewsItem item={item} isPinned />}
              keyExtractor={(item) => item.title}
              ItemSeparatorComponent={() => (
                <View style={styles.itemSeparator} />
              )}
            />
          </View>
        ) : null}
      </>
      {newsData && (
        <View style={styles.viewFlex}>
          <Text style={styles.headingBold}>Latest Articles</Text>
          <FlatList
            data={newsData}
            renderItem={({ item }) => (
              <NewsItem
                deleteArticle={deleteArticle}
                pinArticle={pinArticle}
                item={item}
              />
            )}
            keyExtractor={(item) => item.title}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
        </View>
      )}
    </View>
  );
}
