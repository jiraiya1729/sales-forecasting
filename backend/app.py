from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from sentiment import sentiment_analysis, retrieve
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = "./uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload-csv/", methods=["POST"])
def upload_csv():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.endswith(".csv"):
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        output_path = "sentiment_analysis.csv"
        sentiment_analysis(file_path, output_path)
        df = pd.read_csv(output_path)
        first_df = df.head(100)
        df2 = pd.read_csv("uploads/amazon.csv")
        df2_unique = df2.drop_duplicates(subset='product_id', keep='first')
        merged_df = pd.merge(first_df, df2_unique, on='product_id', how='inner')
        merged_df.to_csv('final_sales.csv', index=False)
        return jsonify(merged_df.to_dict(orient="records"))
    
    

@app.route("/sales", methods=["GET"])
def sales():
    print("request came")
    
    df = pd.read_csv("final_sales_1.csv")
    df = df.dropna()

    df_send = df.to_dict(orient="records")
    print("done sending")
    
    return jsonify(df_send)

    return jsonify({"error": "Invalid file format. Please upload a CSV file."}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
