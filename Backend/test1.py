from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP, AES
from Crypto.Random import get_random_bytes
import base64
import json

# Test Data
patient_id = "DOE@gmail.com"
policy = "john AND doe AND ML123"
test_data = {
    "firstName": "John",
    "lastName": "Doe",
    "dob": "1990-01-01",
    "bloodType": "O+",
    "healthCard": "1234567890",
    "currentMedicalConditions": "Diabetes",
    "previousSurgery": "Appendectomy",
    "allergies": "Peanuts",
    "familyHistory": "Heart Disease",
    "currentMedications": "Metformin"
}

# Encryption
def encrypt_test(data, policy, public_key):
    data_str = json.dumps(data)
    aes_key = get_random_bytes(32)
    cipher_aes = AES.new(aes_key, AES.MODE_EAX)
    ciphertext, tag = cipher_aes.encrypt_and_digest(data_str.encode('utf-8'))

    recipient_key = RSA.import_key(public_key)
    cipher_rsa = PKCS1_OAEP.new(recipient_key)
    encrypted_aes_key = cipher_rsa.encrypt(aes_key)

    encrypted_package = {
        'encrypted_aes_key': base64.b64encode(encrypted_aes_key).decode('utf-8'),
        'nonce': base64.b64encode(cipher_aes.nonce).decode('utf-8'),
        'tag': base64.b64encode(tag).decode('utf-8'),
        'ciphertext': base64.b64encode(ciphertext).decode('utf-8'),
        'policy': policy
    }
    return json.dumps(encrypted_package)

# Decryption
def decrypt_test(encrypted_data, private_key):
    encrypted_package = json.loads(encrypted_data)
    encrypted_aes_key = base64.b64decode(encrypted_package['encrypted_aes_key'])
    nonce = base64.b64decode(encrypted_package['nonce'])
    tag = base64.b64decode(encrypted_package['tag'])
    ciphertext = base64.b64decode(encrypted_package['ciphertext'])

    private_rsa_key = RSA.import_key(private_key)
    cipher_rsa = PKCS1_OAEP.new(private_rsa_key)
    aes_key = cipher_rsa.decrypt(encrypted_aes_key)

    cipher_aes = AES.new(aes_key, AES.MODE_EAX, nonce=nonce)
    decrypted_data = cipher_aes.decrypt_and_verify(ciphertext, tag)
    return decrypted_data.decode('utf-8')

# Generate RSA Keys
key = RSA.generate(2048)
private_key = key.export_key()
public_key = key.publickey().export_key()

# Simulate Encryption
print("Testing standalone encryption/decryption...")
encrypted = encrypt_test(test_data, policy, public_key)
print("Encrypted Data:", encrypted)

# Simulate Decryption
try:
    decrypted = decrypt_test(encrypted, private_key)
    print("Decrypted Data:", decrypted)
except Exception as e:
    print("Decryption failed:", e)

