import requests
import json

def test_user_signup():
    """
    Test user signup endpoint with auto-confirm enabled.
    The user will be immediately active without email verification.
    """
    url = "https://pseqajrtcgiphfnworii.supabase.co/auth/v1/signup"
    headers = {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U",
        "Content-Type": "application/json"
    }
    data = {
        "email": "test.agent@testsprite.test",
        "password": "TestAgent123!"
    }
    
    response = requests.post(url, headers=headers, json=data)
    print(f"Response Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
    
    # Basic check to see if the signup was successful based on status code
    assert response.status_code in range(200, 300), f"Expected status code in range 200-299, got {response.status_code}"
    
    print("✅ User signup test passed!")

if __name__ == "__main__":
    test_user_signup()
