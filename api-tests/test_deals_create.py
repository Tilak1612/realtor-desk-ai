import requests
import json
from datetime import datetime, timedelta

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# Replace with actual JWT token from authenticated user
JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"

def test_create_deal_full():
    """Test creating a deal with all fields"""
    url = f"{BASE_URL}/deals"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    future_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
    
    data = {
        "title": "Downtown Condo Sale",
        "stage": "negotiation",
        "value": 450000,
        "probability": 75,
        "expected_close_date": future_date,
        "status": "active",
        "notes": "High-value client, referral from John Smith"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    print("=" * 50)
    print("TEST: Create Deal (All Fields)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        deal = response.json()[0]
        print(f"Response: {json.dumps(deal, indent=2)}")
        print("✅ Test PASSED - Deal created successfully")
        return deal
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_create_deal_minimal():
    """Test creating a deal with minimal required fields"""
    url = f"{BASE_URL}/deals"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "title": "Residential Property Deal",
        "stage": "lead"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Create Deal (Minimal Fields)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        deal = response.json()[0]
        print(f"Response: {json.dumps(deal, indent=2)}")
        print("✅ Test PASSED - Deal created with minimal fields")
        return deal
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_create_deal_with_contact():
    """Test creating a deal linked to a contact"""
    # First, get a contact ID
    contact_url = f"{BASE_URL}/contacts?limit=1"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    contact_response = requests.get(contact_url, headers=headers)
    
    if contact_response.status_code == 200 and contact_response.json():
        contact_id = contact_response.json()[0]['id']
        
        # Create deal with contact
        url = f"{BASE_URL}/deals"
        headers["Prefer"] = "return=representation"
        
        data = {
            "title": "Luxury Home Purchase",
            "stage": "qualified",
            "contact_id": contact_id,
            "value": 850000,
            "probability": 60
        }
        
        response = requests.post(url, headers=headers, data=json.dumps(data))
        
        print("\n" + "=" * 50)
        print("TEST: Create Deal (With Contact)")
        print("=" * 50)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            deal = response.json()[0]
            print(f"Response: {json.dumps(deal, indent=2)}")
            print("✅ Test PASSED - Deal created with contact link")
            return deal
        else:
            print(f"Response: {response.text}")
            print("❌ Test FAILED")
            return None
    else:
        print("\n⚠️  No contacts found. Create a contact first to test this feature.")
        return None

if __name__ == "__main__":
    print("\n🚀 Starting Deal Creation Tests\n")
    
    # Test 1: Create deal with all fields
    test_create_deal_full()
    
    # Test 2: Create deal with minimal fields
    test_create_deal_minimal()
    
    # Test 3: Create deal with contact
    test_create_deal_with_contact()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print("All creation tests completed")
