# import requests
# import json

# def test_team_creation():
#     # API endpoint URL
#     url = "http://localhost:8000/api/team/create/"
    
#     # Headers with auth token
#     headers = {
#         "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MjMyNTM3LCJpYXQiOjE3NDcyMjg5MzcsImp0aSI6IjE1NTYzYzQxMjg3NTRkYzY5MTQ4N2Q1OGRkMmU5M2YzIiwidXNlcl9pZCI6MywidXNlcm5hbWUiOiJuZWtsYXdpIiwiaXNfc3RhZmYiOnRydWUsImlzX3N1cGVydXNlciI6dHJ1ZX0.mg8Sp_ED0g61cHge5tNuCgxvIEM9z4jAMW_CTqMz6ic"  # Replace with your actual auth token
#     }
    
#     # Create the form data
#     form_data = {
#         "name": "team image",
#         "robot_name": "1",
#         "type": "non-profite",
#         "team_leader_name": "leader image",
#         "team_leader_email": "image@gmail.com",
#         "team_leader_phone_number": "+201232699809",
#         "team_number": "23TEAM",
#         "event_name": "string",
        
#         # JSON fields as strings
#         "organization_info": json.dumps({
#             "name": "eme",
#             "address": "string",
#             "type": "string",
#             "email": "string",
#             "contacts": [{"phone_number": "string"}],
#             "phone_number": "string"  # Added this explicitly
#         }),
        
#         "members": json.dumps([{
#             "name": "mem1",
#             "email": "mem1@gmail.com",
#             "phone_number": "+201432099809"
#         }]),
        
#         "sponsors": json.dumps([{
#             "name": "pepsi",
#             "email": "pepsi@mgial.ocm"
#         }]),
        
#         "previous_competition": json.dumps([{
#             "name": "vex_123",
#             "year": "2024"
#         }]),
        
#         "coach": json.dumps([{
#             "name": "coach1",
#             "email": "coach1@gmail.com",
#             "phone_number": "+201282099809",
#             "position": "primary"
#         }]),
        
#         "social_media": json.dumps([{
#             "platform": "facbook",
#             "url": "http://www.ex2ample.com"
#         }])
#     }
    
#     # Add image file - replace with your actual image path
#     files = {
#         'image': ('image.jpg', open('/home/a_neklawii/Django Projects/STEM-AI(Repair)/Backend/repair_backend/rapair_db/static/competition_image/ninja-kamui-oni-mask-joe-higan-4k-wallpaper-uhdpaper.com-240@1@o.jpg', 'rb'), 'image/jpeg')
#     }
    
#     # Make the request
#     response = requests.post(url, data=form_data, files=files, headers=headers)
    
#     # Print response
#     print(f"Status code: {response.status_code}")
#     print(f"Response: {response.json()}")

# if __name__ == "__main__":
#     test_team_creation()

import requests
import os
import json

def test_team_creation():
    # API endpoint URL - adjust to your actual server URL
    url = "http://localhost:8000/api/team/create/"
    
    # Replace with your actual auth token
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3MjMyNTM3LCJpYXQiOjE3NDcyMjg5MzcsImp0aSI6IjE1NTYzYzQxMjg3NTRkYzY5MTQ4N2Q1OGRkMmU5M2YzIiwidXNlcl9pZCI6MywidXNlcm5hbWUiOiJuZWtsYXdpIiwiaXNfc3RhZmYiOnRydWUsImlzX3N1cGVydXNlciI6dHJ1ZX0.mg8Sp_ED0g61cHge5tNuCgxvIEM9z4jAMW_CTqMz6ic"  
    }
    
    # Create the form data with properly formatted JSON strings
    form_data = {
        "name": "team image",
        "robot_name": "1",
        "type": "non-profite",
        "team_leader_name": "leader image",
        "team_leader_email": "image@gmail.com",
        "team_leader_phone_number": "+201232699809",
        "team_number": "23TEAM",
        "event_name": "string",
        
        # JSON fields formatted exactly as in your error output
        "organization_info": '{"name":"eme","address":"string","type":"string","email":"string","contacts":[{"phone_number":"string"}],"phone_number":"string"}',
        "members": '[{"name":"mem1","email":"mem1@gmail.com","phone_number":"+201432099809"}]',
        "sponsors": '[{"name":"pepsi","email":"pepsi@mgial.ocm"}]',
        "previous_competition": '[{"name":"vex_iq","year":"2024-09-12"}]',
        "coach": '[{"name":"coach1","email":"coach1@gmail.com","phone_number":"+201282099809","position":"primary"}]',
        "social_media": '[{"platform":"facebook","url":"http://www.ex2ample.com"}]',
    }
    
    # You can use a sample image or create a temporary one
    # For testing purposes, you might want to use a small placeholder image
    image_path = "test_image.jpg"
    
    # Simple check if we need to create a test image
    if not os.path.exists(image_path):
        try:
            # Create a small placeholder image if needed
            with open(image_path, "wb") as f:
                f.write(b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.' \",#\x1c\x1c(7),01444\x1f'9=82<.342\xff\xdb\x00C\x01\t\t\t\x0c\x0b\x0c\x18\r\r\x182!\x1c!22222222222222222222222222222222222222222222222222\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x03\x01\"\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xc4\x00\xb5\x10\x00\x02\x01\x03\x03\x02\x04\x03\x05\x05\x04\x04\x00\x00\x01}\x01\x02\x03\x00\x04\x11\x05\x12!1A\x06\x13Qa\x07\"q\x142\x81\x91\xa1\x08#B\xb1\xc1\x15R\xd1\xf0$3br\x82\t\n\x16\x17\x18\x19\x1a%&'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\x83\x84\x85\x86\x87\x88\x89\x8a\x92\x93\x94\x95\x96\x97\x98\x99\x9a\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xff\xc4\x00\x1f\x01\x00\x03\x01\x01\x01\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xc4\x00\xb5\x11\x00\x02\x01\x02\x04\x04\x03\x04\x07\x05\x04\x04\x00\x01\x02w\x00\x01\x02\x03\x11\x04\x05!1\x06\x12AQ\x07aq\x13\"2\x81\x08\x14B\x91\xa1\xb1\xc1\t#3R\xf0\x15br\xd1\n\x16$4\xe1%\xf1\x17\x18\x19\x1a&'()*56789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\x82\x83\x84\x85\x86\x87\x88\x89\x8a\x92\x93\x94\x95\x96\x97\x98\x99\x9a\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xff\xda\x00\x0c\x03\x01\x00\x02\x11\x03\x11\x00?\x00\xf9\xfe\x8a(\xa0\x0f\xff\xd9")
        except Exception as e:
            print(f"Error creating test image: {e}")
            # Proceed without the image for testing
            pass
    
    # Create the files part with your image
    try:
        files = {
            'image': ('test_image.jpg', open(image_path, 'rb'), 'image/jpeg')
        }
    except Exception as e:
        print(f"Error opening image file: {e}")
        files = {}  # Proceed without image for testing
    
    print("Sending request with form data:")
    print(json.dumps(form_data, indent=2))
    
    # Make the request
    try:
        response = requests.post(url, data=form_data, files=files, headers=headers)
        
        # Print response
        print(f"Status code: {response.status_code}")
        
        try:
            response_json = response.json()
            print(f"Response JSON: {json.dumps(response_json, indent=2)}")
        except ValueError:
            print(f"Response text: {response.text}")
        
    except Exception as e:
        print(f"Error making request: {e}")

if __name__ == "__main__":
    test_team_creation()