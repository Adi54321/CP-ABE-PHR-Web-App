from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP, AES
from Crypto.Random import get_random_bytes
from db import get_patientdb, get_userdb
from flask_cors import cross_origin
from flask import Blueprint, request, jsonify
import base64
import sqlite3
import json

#define the blueprint
cpabe_bp = Blueprint('cpabe', __name__)

#key generation for users and authority
key = RSA.generate(2048)
private_key = key.export_key()
public_key = key.public_key().export_key()

#function to get doctor attributes from the database
def get_doc_attributes(doctor_id):
    db = get_userdb
    cursor = db.cursor()
    cursor.execute("""
            SELECT first_name, last_name, specialty, hospital_affiliation, medical_license_number 
            FROM DoctorInfo
            WHERE id = ?
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

#function to store encrypted data and policy in the database
def store_encrypted_data(patient_email, encrypted_data, policy):
    db = get_userdb()
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO EncryptedData (patient_email, encrypted_data, policy)
        VALUES (?, ?, ?)
    """, (patient_email, encrypted_data, policy))
    db.commit()


#used a simplified version of CP-ABE concept encrypt data using RSA and AES
def encrypt_data(data, policy, public_key):
    #symmetric key generation for data encryption
    aes_key = get_random_bytes(32)  # AES key for symmetric encryption
    cipher_aes = AES.new(aes_key, AES.MODE_EAX)
    ciphertext, tag = cipher_aes.encrypt_and_digest(data.encode('utf-8'))

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


#encrypt route for encrypting the patient data
@cpabe_bp.route('/encrypt', methods=['POST'])
@cross_origin()
def encrypt_route():
    data = request.get_json()
    patient_email = data.get('patient_email')
    doctor_id = data.get('doctor_id')
    patient_data = data.get('patient_data')

    if not doctor_id or not patient_data or not patient_email:
        return jsonify({'error': 'Doctor ID, patient data, and patient email are required'}), 400

    try:
        #retrieve doctor attributes from the database
        doctor_attributes = get_doc_attributes(doctor_id)
        policy = f"{doctor_attributes['first_name']} AND {doctor_attributes['last_name']} AND {doctor_attributes['medical_license_number']}"

        #encrypt data using a simplified CP-ABE approach
        encrypted_data = encrypt_data(patient_data, policy, public_key)
        
        #store the encrypted data and policy in the database
        store_encrypted_data(patient_email, encrypted_data, policy)

        return jsonify({'message': 'Data encrypted and stored successfully!'}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Encryption failed!'}), 500

#route to retrieve list of doctors for the patient to choose from    
@cpabe_bp.route('/doctors', methods=['GET'])
@cross_origin()
def get_doctors():
    db = get_userdb()
    cursor = db.cursor()
    cursor.execute("SELECT id, first_name, last_name, specialty, hospital_affiliation, medical_license_number FROM DoctorInfo")
    doctors = cursor.fetchall()
    doctors_list = [
        {
            "id": doctor[0],
            "first_name": doctor[1],
            "last_name": doctor[2],
            "specialty": doctor[3],
            "hospital_affiliation": doctor[4],
            "medical_license_number": doctor[5]
        } for doctor in doctors
    ]
    return jsonify(doctors_list), 200

@cpabe_bp.route('/decrypt', methods=['POST'])
@cross_origin()
def decrypt_route():
    data = request.get_json()
    encrypted_data = data.get('encrypted_data')
    doctor_id = data.get('doctor_id')

    if not encrypted_data or not doctor_id:
        return jsonify({'error': 'Encrypted data and doctor ID are required'}), 400

    try:
        #retrieve doctor attributes from the database
        doctor_attributes = get_doc_attributes(doctor_id)
        policy = f"{doctor_attributes['first_name']} AND {doctor_attributes['last_name']} AND {doctor_attributes['medical_license_number']}"

        #load encrypted package
        encrypted_package = json.loads(encrypted_data)

        #check if the provided policy matches
        if encrypted_package['policy'] != policy:
            return jsonify({'error': 'Attributes do not match the policy'}), 403

        #decrypt AES key using RSA private key if policy matches
        encrypted_aes_key = base64.b64decode(encrypted_package['encrypted_aes_key'])
        nonce = base64.b64decode(encrypted_package['nonce'])
        tag = base64.b64decode(encrypted_package['tag'])
        ciphertext = base64.b64decode(encrypted_package['ciphertext'])

        private_rsa_key = RSA.import_key(private_key)
        cipher_rsa = PKCS1_OAEP.new(private_rsa_key)
        aes_key = cipher_rsa.decrypt(encrypted_aes_key)

        #decrypt the data using AES key
        cipher_aes = AES.new(aes_key, AES.MODE_EAX, nonce=nonce)
        data = cipher_aes.decrypt_and_verify(ciphertext, tag)
        return jsonify({'decrypted_data': data.decode('utf-8')}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Decryption failed!'}), 500

        