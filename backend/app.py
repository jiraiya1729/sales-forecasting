from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from sentiment import sentiment_analysis, retrive

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
        top_products = retrive(output_path)
        print(top_products)
        return jsonify(top_products.to_dict(orient="records"))

    return jsonify({"error": "Invalid file format. Please upload a CSV file."}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
