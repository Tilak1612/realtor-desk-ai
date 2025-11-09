import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# Replace with actual JWT token from authenticated user
JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"

def test_delete_deal(deal_id):
    """Test deleting a deal"""
    url = f"{BASE_URL}/deals?id=eq.{deal_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.delete(url, headers=headers)
    
    print("=" * 50)
    print("TEST: Delete Deal")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 204:
        print("✅ Test PASSED - Deal deleted successfully")
        return True
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return False

def test_verify_deletion(deal_id):
    """Test verifying deal was deleted"""
    url = f"{BASE_URL}/deals?id=eq.{deal_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Verify Deal Deletion")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        deals = response.json()
        if len(deals) == 0:
            print("✅ Test PASSED - Deal confirmed deleted")
            return True
        else:
            print(f"❌ Test FAILED - Deal still exists: {json.dumps(deals[0], indent=2)}")
            return False
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED - Error verifying deletion")
        return False

def test_delete_nonexistent_deal():
    """Test deleting a deal that doesn't exist"""
    fake_id = "00000000-0000-0000-0000-000000000000"
    url = f"{BASE_URL}/deals?id=eq.{fake_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.delete(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Delete Non-existent Deal")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 204:
        print("✅ Test PASSED - No error on non-existent deal")
        return True
    else:
        print(f"Response: {response.text}")
        print("⚠️  Unexpected response")
        return False

def create_test_deal():
    """Helper function to create a test deal for deletion"""
    url = f"{BASE_URL}/deals"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "title": "Test Deal for Deletion",
        "stage": "lead",
        "value": 100000
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    if response.status_code == 201:
        return response.json()[0]['id']
    return None

if __name__ == "__main__":
    print("\n🚀 Starting Deal Deletion Tests\n")
    
    # Create a test deal for deletion
    print("Creating test deal for deletion...\n")
    deal_id = create_test_deal()
    
    if not deal_id:
        print("⚠️  Could not create test deal. Check authentication.")
    else:
        print(f"Test deal created: {deal_id}\n")
        
        # Test 1: Delete the deal
        test_delete_deal(deal_id)
        
        # Test 2: Verify deletion
        test_verify_deletion(deal_id)
        
        # Test 3: Delete non-existent deal
        test_delete_nonexistent_deal()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print("All deletion tests completed")
