import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# Replace with actual JWT token from authenticated user
JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"

def test_create_contact():
    """Test creating a new contact"""
    url = f"{BASE_URL}/contacts"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890",
        "source": "website",
        "tags": ["buyer", "first-time"],
        "status": "lead"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    print("=" * 50)
    print("TEST: Create Contact")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 201:
        print("✅ Test PASSED - Contact created successfully")
        return response.json()[0] if isinstance(response.json(), list) else response.json()
    else:
        print("❌ Test FAILED")
        return None

def test_create_minimal_contact():
    """Test creating a contact with minimal required fields"""
    url = f"{BASE_URL}/contacts"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "first_name": "Jane",
        "email": "jane.smith@example.com"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Create Minimal Contact")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 201:
        print("✅ Test PASSED - Minimal contact created successfully")
        return response.json()[0] if isinstance(response.json(), list) else response.json()
    else:
        print("❌ Test FAILED")
        return None

if __name__ == "__main__":
    print("\n🚀 Starting Contact Creation Tests\n")
    
    # Test 1: Full contact creation
    contact1 = test_create_contact()
    
    # Test 2: Minimal contact creation
    contact2 = test_create_minimal_contact()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print(f"Created contacts: {2 if contact1 and contact2 else (1 if contact1 or contact2 else 0)}/2")
