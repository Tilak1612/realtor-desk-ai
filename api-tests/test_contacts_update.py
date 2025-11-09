import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# Replace with actual JWT token from authenticated user
JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"

def test_update_contact_full(contact_id):
    """Test updating multiple fields of a contact"""
    url = f"{BASE_URL}/contacts?id=eq.{contact_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "first_name": "John",
        "last_name": "Smith",
        "phone": "+1987654321",
        "status": "client",
        "tags": ["buyer", "hot-lead"],
        "lead_score": 85
    }
    
    response = requests.patch(url, headers=headers, data=json.dumps(data))
    
    print("=" * 50)
    print("TEST: Update Contact (Multiple Fields)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        updated = response.json()
        print(f"Response: {json.dumps(updated, indent=2)}")
        print("✅ Test PASSED - Contact updated successfully")
        return updated
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_update_contact_single_field(contact_id):
    """Test updating a single field"""
    url = f"{BASE_URL}/contacts?id=eq.{contact_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "lead_score": 90
    }
    
    response = requests.patch(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Update Contact (Single Field)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        updated = response.json()
        print(f"Response: {json.dumps(updated, indent=2)}")
        print("✅ Test PASSED - Lead score updated successfully")
        return updated
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_update_contact_status(contact_id):
    """Test updating contact status"""
    url = f"{BASE_URL}/contacts?id=eq.{contact_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "status": "active"
    }
    
    response = requests.patch(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Update Contact Status")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        updated = response.json()
        print(f"Response: {json.dumps(updated, indent=2)}")
        print("✅ Test PASSED - Status updated successfully")
        return updated
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def get_first_contact():
    """Helper function to get the first contact ID"""
    url = f"{BASE_URL}/contacts?limit=1"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200 and response.json():
        return response.json()[0]['id']
    return None

if __name__ == "__main__":
    print("\n🚀 Starting Contact Update Tests\n")
    
    # Get a contact ID to test with
    contact_id = get_first_contact()
    
    if not contact_id:
        print("⚠️  No contacts found. Please create a contact first.")
    else:
        print(f"Using contact ID: {contact_id}\n")
        
        # Test 1: Update multiple fields
        test_update_contact_full(contact_id)
        
        # Test 2: Update single field
        test_update_contact_single_field(contact_id)
        
        # Test 3: Update status
        test_update_contact_status(contact_id)
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print("All update operations completed")
