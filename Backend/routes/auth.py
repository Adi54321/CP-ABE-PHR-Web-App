from flask import Blueprint, request, jsonify
from db import get_userdb
import sqlite3
from flask_cors import cross_origin


auth_bp = Blueprint('register', __name__)
#backend logic for registering user of both types patient and doctor
@auth_bp.route('/register', methods=['POST'])
@cross_origin()
def register_user():
    data = request.get_json()

    # Extract data from the request
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')
    password = data.get('password')
    phone_number = data.get('phone_number')
    role = data.get('role')

    #connect to the database
    db = get_userdb()
    cursor = db.cursor()

    #execute the query 
    try:
        cursor.execute('''INSERT INTO UserLogin (first_name, last_name, email, password, phone_number, role)
                          VALUES (?, ?, ?, ?, ?, ?)''',
                       (first_name, last_name, email, password, phone_number, role))
        db.commit()
        print('success on backend') #debugging purposes
        return jsonify({'message': 'User registered successfully!'}), 201
    
    except sqlite3.IntegrityError as e:
        #cancel the transactions if integrity error pops up        
        db.rollback()
        print('integrity error') #debugging purposes
        return jsonify({'error': str(e)}), 400  # Return the error message
    except Exception as e:
        #cancel transactions for any other errors
        db.rollback()
        print(f"Error: {e}")
        return jsonify({'error': 'Registration failed!'}), 500


#backend logic for logging into user accounts for both doctor and patients
@auth_bp.route('/login', methods=['POST'])
@cross_origin()
def login_user():
    #get the user info from the request
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    #if there is no email or password send out an error message
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    #get the db connection using db.py function get_db()
    db = get_userdb()
    db.row_factory = sqlite3.Row

    try:
        #execute the query to check if the user exist then fetch one if it exits
        cursor = db.execute('SELECT password, role FROM UserLogin WHERE email = ?', (email,))
        user = cursor.fetchone()
        
        #in the case where a user does not exist
        if user is None:
            print('user does not exist') #debugging purposes
            return jsonify({'Error':'User does not exist'}), 401
        
        #check if the password matches, the email is the primary key in this case as its unique in the db
        #using a dictionary like access for password row in the db
        stored_passwords = user['password']
        if stored_passwords != password:
            return jsonify({'Error: invalid email or password'}), 401
        
        #return role
        print('Successful login') #debugging purposes
        return jsonify({'role': user['role'],}), 200
        
    #catch any error 
    except Exception as e:
        print(f'Error during login: {e}') #debugging purposes
        #undo the transaction if there is a failure
        db.rollback()
        return jsonify({'Error': 'An error occurred. Please try again later.'}), 500
    

    #logic for storing the additional information if user is a doctor
@auth_bp.route('/register/doctor-info', methods=['POST'])
@cross_origin()
def doctor_info():
    data = request.get_json()

    #store the individual information in object to send them in the database
    email = data.get('email')
    specialization = data.get('specialization_')
    medical_license_number = data.get('medical_license_number')
    years_of_experience = data.get('years_of_experience')
    hospital_affiliation = data.get('hospital_affiliation')
    contact_info = data.get('contact_info')
    preferred_contact_method = data.get('preferred_contact_method')
    languages_spoken = data.get('languages_spoken')
    DOB_ = data.get('DOB')

    #get the connection of the user.db 
    db = get_userdb()
    cursor = db.cursor()

    #execute the query
    try:
        cursor.execute('''
            INSERT INTO DoctorInfo (email, specialization, medical_license_number, years_of_experience, 
                                    hospital_affiliation, contact_info, preferred_contact_method, languages_spoken, DOB)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (email, specialization, medical_license_number, years_of_experience, hospital_affiliation, 
              contact_info, preferred_contact_method, languages_spoken, DOB_))
        #commit to the database
        db.commit()
        print('Doctor additional info successful') #debugging purposes
        return jsonify({'message': 'Doctor information registered successfully!'}), 201
    
    except Exception as e:
        #undo the transaction if there is an error
        db.rollback()
        print(data) #debugging purposes
        print('Failed to register doctor information') #debugging purposes
        return jsonify({'error': 'Failed to register doctor information!'}), 500


#in development 
@auth_bp.route('/submit-patient-data', methods = ['POST'])
@cross_origin()
def submit_patient_data():

    #get the data from the request
    data = request.get_json()

    
