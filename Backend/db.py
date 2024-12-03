import sqlite3
from flask import g
import os

#create a path to the users and patient database 
userdatabase = os.path.join(os.path.dirname(__file__), 'Database', 'users.db')
patientdb = os.path.join(os.path.dirname(__file__),'Database', 'patient_info.db')

def get_userdb():
    if 'db' not in g:
        g.db = sqlite3.connect(userdatabase)
        g.db.row_factory = sqlite3.Row
    return g.db

def get_patientdb():
    if 'db' not in g:
        g.db = sqlite3.connect(patientdb)
        g.db.row_factory = sqlite3.Row
    return g.db 

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()
        
#test userdb connection
def test_userdb_connection():
    try:
        conn = sqlite3.connect(userdatabase)
        conn.close()
        print("User Database connection successful!")
    except sqlite3.Error as e:
        print(f"User Database connection failed: {e}")
#test patientdb connection
def test_patientdb_connection():
    try:
        conn = sqlite3.connect(patientdb)
        conn.close()
        print("Patient Database connection successful!")
    except sqlite3.Error as e:  
        print(f"Patient Database connection failed: {e}")

#verifying the connection of the database
test_userdb_connection()
test_patientdb_connection()

