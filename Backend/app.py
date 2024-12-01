from flask import Flask, g
from flask_cors import CORS
import logging #for hashing passwords (in development)
from routes.auth import auth_bp # Import the routes after the app is created, from routes.auth import auth_bp

app = Flask(__name__)
CORS(app) 

app.register_blueprint(auth_bp)

# #initialize the keys
# public_key, master_key = setup()


if __name__ == '__main__':
    app.run(debug=True)
