import random
import string

# Function to generate a 6-digit verification code using uppercase letters and digits.
def generate_verification_code():

    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))