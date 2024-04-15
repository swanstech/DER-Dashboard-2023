# Script for Encrypt Button
# Script has to be altered to match the button functionality
# Comments to be updated 


import os
import boto3
from botocore.exceptions import ClientError
import base64


aws_region = "ap-southeast-2"
aws_id = os.environ.get('AWS_AccessKeyID')
aws_key = os.environ.get('AWS_SecretAccessKey')
key_id = '02d3e693-4235-4586-99df-c67b3e22017d'
kms_client = boto3.client("kms", region_name = aws_region, aws_access_key_id=aws_id, aws_secret_access_key=aws_key)

def encrypt(plain_text):
    """
    Encrypts plaintext into ciphertext by using a KMS key.
    """
    try:
        cipher_text = kms_client.encrypt(
            KeyId = key_id,
            Plaintext=bytes(plain_text, encoding='utf8'),
        )
    except ClientError:
        return 'Could not encrypt the string.'
    else:
        return cipher_text['CiphertextBlob']


def format_data(data):

    b64_enc = base64.b64encode(data)
    # return b64_enc,b64_enc.decode(),base64.b64decode(b64_enc.decode())
    return b64_enc.decode()
   

enc = encrypt("Hello There")
print(format_data(enc))
# print(base64.b64encode(enc))
# print(base64.b64encode(enc).decode())
