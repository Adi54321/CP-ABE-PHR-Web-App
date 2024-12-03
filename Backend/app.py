from flask import Flask, g
from flask_cors import CORS
import logging #for hashing passwords (in development)
from routes.auth import auth_bp #import the routes after the app is created, from routes.auth import auth_bp
from routes.cpabe import cpabe_bp #import te cpabe from the routes/cpabe

app = Flask(__name__)
CORS(app) 

app.register_blueprint(auth_bp)
app.register_blueprint(cpabe_bp, url_prefix = '/cpabe')

if __name__ == '__main__':
    app.run(debug=True)
