

import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

def sentiment_analysis(file_path, output_path):
    df = pd.read_csv(file_path)
    df['title_content'] = df['review_title'].fillna('') + " " + df['review_content'].fillna('')

    # Apply Vader to detect sentiment and get scores
    def get_sentiment_with_score(text):
        scores = analyzer.polarity_scores(text)
        sentiment = "Positive" if scores['compound'] >= 0.05 else (
            "Negative" if scores['compound'] <= -0.05 else "Neutral"
        )
        return pd.Series([sentiment, scores['compound']], index=['sentiment', 'sentiment_score'])

    # Apply the function to get both sentiment and score
    df[['sentiment', 'sentiment_score']] = df['title_content'].apply(get_sentiment_with_score)

    # Group by product_id, calculate average sentiment score
    avg_sentiment = (
        df.groupby('product_id', as_index=False)
        .agg(avg_sentiment=('sentiment_score', 'mean'))
    )
    
    # Sort the entire DataFrame by sentiment_score in descending order
    sorted_df = df.sort_values(by='sentiment_score', ascending=False)

    # Keep the first row for each product_id after sorting
    first_row = sorted_df.groupby('product_id').first().reset_index()

    # Merge the average sentiment score with the first row
    result = avg_sentiment.merge(first_row, on='product_id')

    # Sort the final result by sentiment_score in descending order
    result = result.sort_values(by='sentiment_score', ascending=False)

    # Save results to a new CSV
    result[['product_id', 'avg_sentiment', 'sentiment', 'sentiment_score']].to_csv(output_path, index=False)





def retrieve(input_path,  output_path):
    # Read the sentiment analysis results
    df = pd.read_csv(input_path)
    original_df = pd.read_csv("uploads/amazon.csv")
    
    # Calculate metrics per product
    product_metrics = df.groupby('product_id').agg({
        'sentiment': lambda x: x.value_counts().to_dict(),
        'sentiment_score': 'mean'
    }).reset_index()
    
    # Convert sentiment dictionary to separate columns
    product_metrics['positive_count'] = product_metrics['sentiment'].apply(lambda x: x.get('Positive', 0))
    product_metrics['negative_count'] = product_metrics['sentiment'].apply(lambda x: x.get('Negative', 0))
    product_metrics['neutral_count'] = product_metrics['sentiment'].apply(lambda x: x.get('Neutral', 0))
    
    # Select metrics columns
    metrics_df = product_metrics[['product_id', 'sentiment_score', 'positive_count', 'negative_count', 'neutral_count']]
    
    # Add total counts row for metrics
    total_counts = pd.DataFrame({
        'product_id': ['Total'],
        'sentiment_score': [metrics_df['sentiment_score'].mean()],
        'positive_count': [metrics_df['positive_count'].sum()],
        'negative_count': [metrics_df['negative_count'].sum()],
        'neutral_count': [metrics_df['neutral_count'].sum()]
    })
    
    # Get original columns we want to include
    original_columns = original_df[["product_id", "product_name", "actual_price", "product_link"]].copy()
    
    # Combine metrics with original data
    final_df = pd.merge(metrics_df, original_columns, on='product_id', how='left')
    
    # Add the totals row
    final_df_with_totals = pd.concat([final_df, total_counts], ignore_index=True)
    
    # For the 'Total' row, fill rating and sentiment with appropriate values
    final_df_with_totals = final_df_with_totals.sort_values(by='sentiment_score', ascending=False)

    result_df = (
    final_df_with_totals
    .groupby('product_id')
    .agg({
        'sentiment_score': 'min',
        'positive_count': 'sum',
        'negative_count': 'sum',
        'neutral_count': 'sum',
        **{col: 'first' for col in final_df_with_totals.columns if col not in ['product_id', 'sentiment_score', 'positive_count', 'negative_count', 'neutral_count']}
    })
    .reset_index()
    )


    # Save to CSV
    result_df.to_csv("result_df", index=False)
    return final_df_with_totals

# Example usage:
# sentiment_analysis('uploads/amazon.csv', 'sentiment_output.csv')
# results = retrieve('sentiment_output.csv', 'uploads/amazon.csv', 'final_sentiment_metrics.csv')