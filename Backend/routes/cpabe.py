from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP, AES
from Crypto.Random import get_random_bytes
from db import get_userdb
from flask_cors import cross_origin
from flask import Blueprint, request, jsonify
import base64
import sqlite3
import json

#define the blueprint
cpabe_bp = Blueprint('cpabe', __name__)

#function to get doctor attributes from the database
def get_doc_attributes(doctor_id):
    db = get_userdb()
    cursor = db.cursor()
    try:
        cursor.execute("""
            SELECT UserLogin.first_name, UserLogin.last_name, DoctorInfo.specialization, DoctorInfo.hospital_affiliation, DoctorInfo.medical_license_number 
            FROM DoctorInfo
            JOIN UserLogin ON DoctorInfo.user_id = UserLogin.id
            WHERE DoctorInfo.user_id = ?
        """, (doctor_id,))
        result = cursor.fetchone()
        if result:
            return {
                    "first_name": result[0],
                    "last_name": result[1],
                    "specialty": result[2],
                    "hospital_affiliation": result[3],
                    "medical_license_number": result[4]
                }
        else:
            raise ValueError("Doctor not found")
    except Exception as e:
        print(f'Error in get_doc_attributes function: {e}') #debugging purposes
        raise

#function to store encrypted data and policy in the database
def store_encrypted_data(patient_email, encrypted_data, policy):
    db = get_userdb()
    cursor = db.cursor()
    try:         
            #insert encrypted data into the database
            cursor.execute("""
                INSERT INTO EncryptedData (patient_id, encrypted_data, policy)
                VALUES (?, ?, ?)
            """, (patient_email, encrypted_data, policy))
            
            #commit the transaction
            db.commit()
            print('Data successfully stored in the database.') #debug

    except sqlite3.Error as db_error:
        #handle database errors
        print(f"Database error: {db_error}")
        raise

#used a simplified version of CP-ABE concept to encrypt data using RSA and AES
def encrypt_data(data, policy, public_key):
    try:
        #convert the data dict to JSON string
        data_str = json.dumps(data)
        #symmetric key generation for data encryption
        aes_key = get_random_bytes(32)
        cipher_aes = AES.new(aes_key, AES.MODE_EAX)
        ciphertext, tag = cipher_aes.encrypt_and_digest(data_str.encode('utf-8'))

        #encrypt AES key using RSA and policy as a content
        recipient_key = RSA.import_key(public_key)
        cipher_rsa = PKCS1_OAEP.new(recipient_key)
        encrypted_aes_key = cipher_rsa.encrypt(aes_key)

        #combine the encrypted data and policy
        encrypted_package = {
            'encrypted_aes_key': base64.b64encode(encrypted_aes_key).decode('utf-8'),
            'nonce': base64.b64encode(cipher_aes.nonce).decode('utf-8'),
            'tag': base64.b64encode(tag).decode('utf-8'),
            'ciphertext': base64.b64encode(ciphertext).decode('utf-8'),
            'policy': policy
        }
        return json.dumps(encrypted_package)
    except Exception as e:
        print(f'Error in encrypt_data: {e}') #debugging purposes
        raise

def decrypt_data(encrypted_data, private_key):
    try:
        #load encrypted package
        encrypted_package = json.loads(encrypted_data)

        #debug print statements for encrypted package
        print(f"DEBUG: Encrypted package contents: {encrypted_package}")

        #decode Base64 components
        encrypted_aes_key = base64.b64decode(encrypted_package['encrypted_aes_key'])
        nonce = base64.b64decode(encrypted_package['nonce'])
        tag = base64.b64decode(encrypted_package['tag'])
        ciphertext = base64.b64decode(encrypted_package['ciphertext'])

        #dload RSA private key
        private_rsa_key = RSA.import_key(private_key)
        print(f"DEBUG: Loaded RSA private key: {private_rsa_key.export_key().decode('utf-8')[:100]}...")

        #decrypt AES key
        cipher_rsa = PKCS1_OAEP.new(private_rsa_key)
        try:
            aes_key = cipher_rsa.decrypt(encrypted_aes_key)
        except ValueError:
            raise ValueError("Decryption failed. The encrypted AES key could not be decrypted with the provided private key.")

        print(f"DEBUG: Decrypted AES key length: {len(aes_key)}")
        if len(aes_key) not in (16, 24, 32):
            raise ValueError("Invalid AES key length")

        #decrypt data using AES
        cipher_aes = AES.new(aes_key, AES.MODE_EAX, nonce=nonce)
        decrypted_data = cipher_aes.decrypt_and_verify(ciphertext, tag)
        return decrypted_data.decode('utf-8')

    except ValueError as ve:
        print(f"ValueError in decrypt_data: {ve}")
        raise
    except Exception as e:
        print(f"Error in decrypt_data: {e}")
        raise

#encrypt route for encrypting the patient data
@cpabe_bp.route('/encrypt', methods=['POST'])
@cross_origin()
def encrypt_route():
    try:    
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data received'}), 400
        
        patient_email = data.get('patient_email')
        doctor_id = data.get('doctor_id')
        patient_data = data.get('patient_data')
        
        if not doctor_id or not patient_data or not patient_email:
            return jsonify({'error': 'Doctor ID, patient data, and patient email are required'}), 400

        #check to see if RSA keys already exist for the patient
        db = get_userdb()
        cursor = db.cursor()
        cursor.execute('SELECT private_key, public_key FROM RSAKeys WHERE user_id = ?', (patient_email,))
        result = cursor.fetchone()

        #if keys exist, retrieve them; otherwise, generate new keys
        if result:
            private_key = result[0].encode('utf-8')
            public_key = result[1].encode('utf-8')
        else:
            key = RSA.generate(2048)
            private_key = key.export_key()
            public_key = key.publickey().export_key()

            #save generated keys to the database
            cursor.execute('''
                INSERT INTO RSAKeys (user_id, private_key, public_key)
                VALUES (?, ?, ?)
            ''', (patient_email, private_key.decode('utf-8'), public_key.decode('utf-8')))
            db.commit()

        #debug print statements for keys
        print(f"DEBUG: Public key used for encryption: {public_key.decode('utf-8')[:100]}...")

        #get doctor attributes
        try:
            doctor_attributes = get_doc_attributes(doctor_id)
        except ValueError as ve:
            return jsonify({'error': str(ve)}), 400

        #set the policy
        policy = f"{doctor_attributes['first_name']} AND {doctor_attributes['last_name']} AND {doctor_attributes['medical_license_number']}"

        #encrypt data using a simplified CP-ABE approach
        try:
            encrypted_data = encrypt_data(patient_data, policy, public_key)
        except Exception as encrypt_err:
            return jsonify({'error': 'Failed to encrypt data'}), 500
    
        #store the encrypted data and policy in the database
        try:
            store_encrypted_data(patient_email, encrypted_data, policy)
        except Exception as store_err:
            return jsonify({'error': 'Failed to store encrypted data'}), 500
        
        return jsonify({'message': 'Data encrypted and stored successfully!'}), 201
    
    except Exception as e:
        print(f"General Exception in encrypt_route: {e}")
        return jsonify({'error': 'Encryption failed!'}), 500

#route to retrieve list of doctors for the patient to choose from    
@cpabe_bp.route('/doctors', methods=['GET'])
@cross_origin()
def get_doctors():
    db = get_userdb()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT DoctorInfo.user_id, UserLogin.first_name, UserLogin.last_name, DoctorInfo.specialization, DoctorInfo.hospital_affiliation, DoctorInfo.medical_license_number FROM DoctorInfo JOIN UserLogin ON UserLogin.id = DoctorInfo.user_id")
        doctors = cursor.fetchall()
        doctors_list = [
            {
                "id": doctor[0],
                "first_name": doctor[1],
                "last_name": doctor[2],
                "specialization": doctor[3],
                "hospital_affiliation": doctor[4],
                "medical_license_number": doctor[5]
            } for doctor in doctors
        ]
        return jsonify(doctors_list), 200
    except Exception as e:
        print(f'Error retrieving doctors {e}') #debugging purposes
        return jsonify({'error': 'Unable to retrieve doctors'}), 500

#route for decrypting the data if a doctor is accessing the patient data
@cpabe_bp.route('/decrypt', methods=['POST'])
@cross_origin()
def decrypt_route():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data received'}), 400

    doctor_id = data.get('doctor_id')
    patient_id = data.get('patient_id')

    print(doctor_id)
    print(patient_id)

    if not doctor_id or not patient_id:
        return jsonify({'error': 'Doctor ID and Patient ID are required'}), 400

    db = get_userdb()
    cursor = db.cursor()

    # Retrieve encrypted data and policy
    cursor.execute("""
        SELECT encrypted_data, policy
        FROM EncryptedData
        WHERE patient_id = ?
    """, (patient_id,))
    result = cursor.fetchone()

    if not result:
        return jsonify({'error': 'No encrypted data found for the patient'}), 404

    encrypted_data, stored_policy = result

    #validate doctor's policy
    doctor_attributes = get_doc_attributes(doctor_id)
    generated_policy = f"{doctor_attributes['first_name']} AND {doctor_attributes['last_name']} AND {doctor_attributes['medical_license_number']}"

    if generated_policy != stored_policy:
        return jsonify({'error': 'Policy mismatch'}), 403

    #retrieve patient's private key
    cursor.execute("SELECT private_key FROM RSAKeys WHERE user_id = ?", (patient_id,))
    key_result = cursor.fetchone()
    if not key_result:
        return jsonify({'error': 'Private key not found for the patient'}), 500

    private_key = key_result[0].encode('utf-8')
    print(f"DEBUG: Private key used for decryption: {private_key.decode('utf-8')[:100]}...")

    #decrypt the data
    try:
        decrypted_data = decrypt_data(encrypted_data, private_key)
    except Exception as e:
        print(f"Error during decryption: {e}")
        return jsonify({'error': 'Failed to decrypt data'}), 500

    return jsonify({'decrypted_data': decrypted_data}), 200

#route for retrieving patients list based on the doctor's policy
@cpabe_bp.route('/patients', methods=['GET'])
@cross_origin()
def get_patients():
    doctor_email = request.args.get('email')
    if not doctor_email:
        return jsonify({'error': 'Doctor email is required'}), 400

    db = get_userdb()
    cursor = db.cursor()
    
    # Retrieve doctor information using the provided email
    cursor.execute("""
        SELECT first_name, last_name, medical_license_number
        FROM UserLogin
        JOIN DoctorInfo ON UserLogin.id = DoctorInfo.user_id
        WHERE UserLogin.email = ?
    """, (doctor_email,))
    doctor_info = cursor.fetchone()

    if not doctor_info:
        print("Doctor not found for email:", doctor_email)
        return jsonify({'error': 'Doctor not found'}), 404

    first_name, last_name, medical_license_number = doctor_info
    generated_policy = f"{first_name} AND {last_name} AND {medical_license_number}"
    print(f"Generated Policy: {generated_policy}")

    # Retrieve the encrypted data that matches the generated policy
    cursor.execute("""
        SELECT Userlogin.email, UserLogin.first_name, UserLogin.last_name, EncryptedData.encrypted_data, EncryptedData.policy
        FROM EncryptedData
        JOIN UserLogin ON EncryptedData.patient_id = UserLogin.email
        WHERE EncryptedData.policy = ?
    """, (generated_policy,))
    patients = cursor.fetchall()

    if not patients:
        print("No patients found for policy:", generated_policy)
        return jsonify([]), 200

    patients_list = [
        {
            "patient_id": patient[0],
            "name": f"{patient[1]} {patient[2]}",
            "encrypted_data": patient[3],
            "policy": patient[4]
        } for patient in patients
    ]
    print(f"Patients found: {patients_list}")
    return jsonify(patients_list), 200

#simple route that returns the doctor_Id in userlogin
@cpabe_bp.route('/get_doctor_id', methods=['GET'])
@cross_origin()
def get_doctor_id():
    doctor_email = request.args.get('email')
    if not doctor_email:
        return jsonify({'error': 'Doctor email is required'}), 400

    db = get_userdb()
    cursor = db.cursor()
    
    # Retrieve doctor_id using the provided email
    cursor.execute("""
        SELECT DoctorInfo.user_id
        FROM UserLogin
        JOIN DoctorInfo ON UserLogin.id = DoctorInfo.user_id
        WHERE UserLogin.email = ?
    """, (doctor_email,))
    result = cursor.fetchone()

    if not result:
        return jsonify({'error': 'Doctor not found'}), 404

    doctor_id = result[0]
    return jsonify({'doctor_id': doctor_id}), 200

