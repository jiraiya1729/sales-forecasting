from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from flask import jsonify
import pandas as pd

# Initialize Vader sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Load your CSV with product_id, review_title, and review_content
# df = pd.read_csv("uploads/amazon.csv")

def sentiment_analysis(file_path, output_path):
    df = pd.read_csv(file_path)
    df['title_content'] = df['review_title'].fillna('') + " " + df['review_content'].fillna('')

    # Apply Vader to detect sentiment
    def get_sentiment(text):
        score = analyzer.polarity_scores(text)
        if score['compound'] >= 0.05:
            return "Positive"
        elif score['compound'] <= -0.05:
            return "Negative"
        else:
            return "Neutral"

    df['sentiment'] = df['title_content'].apply(get_sentiment)

    # Save results to a new CSV
    df[['product_id','rating', 'sentiment']].to_csv(output_path, index=False)
    
# sentiment_analysis('upload/amazon.csv')

def retrive(file_path):
    df = pd.read_csv(file_path)
    sentiment_counts = df.groupby(["product_id", "sentiment"]).size().unstack(fill_value=0)
    sentiment_counts = sentiment_counts.rename(columns={0: "Neutral", 1: "Positive", -1: "Negative"})

    # Filter top 10 products with the most positive counts (positive > negative)
    sentiment_counts = sentiment_counts.reset_index()
    top_10_positive_ids = sentiment_counts[sentiment_counts["Positive"] > sentiment_counts["Negative"]] \
        .sort_values(by="Positive", ascending=False) \
        .head(10)["product_id"].tolist()
    print(top_10_positive_ids)
    
    details_df = pd.read_csv('uploads/amazon.csv')  # Replace file_path if you have another CSV for details
    filtered_details = details_df[details_df["product_id"].isin(top_10_positive_ids)][
        ["product_id", "product_name", "category", "actual_price", "product_link"]
    ].drop_duplicates(subset="product_id")

    print(filtered_details.shape)
    return filtered_details

# retrive('sentiment_output_w.csv')
