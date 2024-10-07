from flask import Flask, jsonify
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)

# Add CORS support to allow requests from the frontend
CORS(app)

# Define the home route
@app.route('/')
def home():
    return "Hello, Flask!"

# Set up an API route to handle requests from the frontend
@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Data from backend"})

# Run the app only if this script is executed directly
if __name__ == '__main__':
    app.run(debug=True)
