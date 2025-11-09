import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# JWT token extracted from your session
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjRRVDMvSkRoT0hGcUVvaksiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3BzZXFhanJ0Y2dpcGhmbndvcmlpLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzOWMxYTZjMC1hMDQ4LTQ4YmYtOTEzMy0yM2VmMmQwZDU0MDAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYyNjU5MTcwLCJpYXQiOjE3NjI2NTU1NzAsImVtYWlsIjoic210Yy5wb29uYW1AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJjb21wYW55X25hbWUiOiJicmFpbmZ5IiwiZW1haWwiOiJzbXRjLnBvb25hbUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiUG9vbmFtIiwicGhvbmUiOiI3ODAtMzk0LTkxNjgiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjM5YzFhNmMwLWEwNDgtNDhiZi05MTMzLTIzZWYyZDBkNTQwMCIsInN1YnNjcmlwdGlvbl90aWVyIjoiYWdlbnQifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc2MDMxNjg4M31dLCJzZXNzaW9uX2lkIjoiMzFlYmU2N2QtYjIxMS00NjcwLWI2N2ItYzFhNWQ5N2RkMzk0IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.HfhsuLs7Jwlcumkpr-AsMZ0FwghvuamDKx82NmKfkZ8"

def test_delete_property(property_id):
    """Test deleting a property listing"""
    url = f"{BASE_URL}/property_listings?id=eq.{property_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.delete(url, headers=headers)
    
    print("=" * 50)
    print("TEST: Delete Property Listing")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 204:
        print("✅ Test PASSED - Property deleted successfully")
        return True
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return False

def test_verify_deletion(property_id):
    """Test verifying property was deleted"""
    url = f"{BASE_URL}/property_listings?id=eq.{property_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Verify Property Deletion")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        properties = response.json()
        if len(properties) == 0:
            print("✅ Test PASSED - Property confirmed deleted")
            return True
        else:
            print(f"❌ Test FAILED - Property still exists: {json.dumps(properties[0], indent=2)}")
            return False
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED - Error verifying deletion")
        return False

def test_delete_nonexistent_property():
    """Test deleting a property that doesn't exist"""
    fake_id = "00000000-0000-0000-0000-000000000000"
    url = f"{BASE_URL}/property_listings?id=eq.{fake_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.delete(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Delete Non-existent Property")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 204:
        print("✅ Test PASSED - No error on non-existent property")
        return True
    else:
        print(f"Response: {response.text}")
        print("⚠️  Unexpected response")
        return False

def create_test_property():
    """Helper function to create a test property for deletion"""
    url = f"{BASE_URL}/property_listings"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "title": "Test Property for Deletion",
        "address": "999 Test Street",
        "price": 500000
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    if response.status_code == 201:
        return response.json()[0]['id']
    return None

if __name__ == "__main__":
    print("\n🚀 Starting Property Listing Deletion Tests\n")
    
    # Create a test property for deletion
    print("Creating test property for deletion...\n")
    property_id = create_test_property()
    
    if not property_id:
        print("⚠️  Could not create test property. Check authentication.")
    else:
        print(f"Test property created: {property_id}\n")
        
        # Test 1: Delete the property
        test_delete_property(property_id)
        
        # Test 2: Verify deletion
        test_verify_deletion(property_id)
        
        # Test 3: Delete non-existent property
        test_delete_nonexistent_property()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print("All deletion tests completed")
