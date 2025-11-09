import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# JWT token extracted from your session
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjRRVDMvSkRoT0hGcUVvaksiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3BzZXFhanJ0Y2dpcGhmbndvcmlpLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzOWMxYTZjMC1hMDQ4LTQ4YmYtOTEzMy0yM2VmMmQwZDU0MDAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYyNjU5MTcwLCJpYXQiOjE3NjI2NTU1NzAsImVtYWlsIjoic210Yy5wb29uYW1AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJjb21wYW55X25hbWUiOiJicmFpbmZ5IiwiZW1haWwiOiJzbXRjLnBvb25hbUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiUG9vbmFtIiwicGhvbmUiOiI3ODAtMzk0LTkxNjgiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjM5YzFhNmMwLWEwNDgtNDhiZi05MTMzLTIzZWYyZDBkNTQwMCIsInN1YnNjcmlwdGlvbl90aWVyIjoiYWdlbnQifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc2MDMxNjg4M31dLCJzZXNzaW9uX2lkIjoiMzFlYmU2N2QtYjIxMS00NjcwLWI2N2ItYzFhNWQ5N2RkMzk0IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.HfhsuLs7Jwlcumkpr-AsMZ0FwghvuamDKx82NmKfkZ8"

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
