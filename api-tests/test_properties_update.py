import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# Replace with actual JWT token from authenticated user
JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"

def test_update_property_price(property_id):
    """Test updating property price"""
    url = f"{BASE_URL}/property_listings?id=eq.{property_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "price": 875000
    }
    
    response = requests.patch(url, headers=headers, data=json.dumps(data))
    
    print("=" * 50)
    print("TEST: Update Property Price")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        updated = response.json()
        print(f"Response: {json.dumps(updated, indent=2)}")
        print("✅ Test PASSED - Price updated")
        return updated
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_update_property_status(property_id):
    """Test updating property status"""
    url = f"{BASE_URL}/property_listings?id=eq.{property_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "status": "sold"
    }
    
    response = requests.patch(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Update Property Status")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        updated = response.json()
        print(f"Response: {json.dumps(updated, indent=2)}")
        print("✅ Test PASSED - Status updated")
        return updated
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_update_property_description(property_id):
    """Test updating property description"""
    url = f"{BASE_URL}/property_listings?id=eq.{property_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "description": "Updated: Now includes all new stainless steel appliances and fresh paint throughout"
    }
    
    response = requests.patch(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Update Property Description")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        updated = response.json()
        print(f"Response: {json.dumps(updated, indent=2)}")
        print("✅ Test PASSED - Description updated")
        return updated
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_update_property_features(property_id):
    """Test updating property features"""
    url = f"{BASE_URL}/property_listings?id=eq.{property_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "features": ["parking", "gym", "concierge", "rooftop_terrace", "pet_friendly", "storage"]
    }
    
    response = requests.patch(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Update Property Features")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        updated = response.json()
        print(f"Response: {json.dumps(updated, indent=2)}")
        print("✅ Test PASSED - Features updated")
        return updated
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def get_first_property():
    """Helper function to get the first property ID"""
    url = f"{BASE_URL}/property_listings?limit=1"
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
    print("\n🚀 Starting Property Listing Update Tests\n")
    
    # Get a property ID to test with
    property_id = get_first_property()
    
    if not property_id:
        print("⚠️  No properties found. Please create a property first.")
    else:
        print(f"Using property ID: {property_id}\n")
        
        # Test 1: Update price
        test_update_property_price(property_id)
        
        # Test 2: Update status
        test_update_property_status(property_id)
        
        # Test 3: Update description
        test_update_property_description(property_id)
        
        # Test 4: Update features
        test_update_property_features(property_id)
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print("All update operations completed")
