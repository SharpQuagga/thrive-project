import AsyncStorage from "@react-native-async-storage/async-storage";
import { NewsArticle } from "./components/types";

export const NEXT_BATCH_LENGTH = 5

export const storeNewsArticles = async (value: NewsArticle[]) => {
    try {
      const data = JSON.stringify(value);
      await AsyncStorage.setItem("newsArticles", data);
    } catch (e) {
      console.log("error", e);
    }
  };

export const retrieveNewsArticles = async (index: number) => {
  try {
    const serializedArticles = await AsyncStorage.getItem('newsArticles');
    if (serializedArticles !== null) {
      const data = JSON.parse(serializedArticles)
      return data.slice(index,index + NEXT_BATCH_LENGTH).filter((data,idx) => data.author !== null);
    }
  } catch (error) {
    console.error('Error retrieving news articles:', error);
  }
  return [];
};

export function deleteArticlesWithTitle(articles, title) {
  return articles.filter(article => article.title !== title);
}