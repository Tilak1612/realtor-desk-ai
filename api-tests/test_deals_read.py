import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# JWT token extracted from your session
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjRRVDMvSkRoT0hGcUVvaksiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3BzZXFhanJ0Y2dpcGhmbndvcmlpLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzOWMxYTZjMC1hMDQ4LTQ4YmYtOTEzMy0yM2VmMmQwZDU0MDAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYyNjU5MTcwLCJpYXQiOjE3NjI2NTU1NzAsImVtYWlsIjoic210Yy5wb29uYW1AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJjb21wYW55X25hbWUiOiJicmFpbmZ5IiwiZW1haWwiOiJzbXRjLnBvb25hbUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiUG9vbmFtIiwicGhvbmUiOiI3ODAtMzk0LTkxNjgiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjM5YzFhNmMwLWEwNDgtNDhiZi05MTMzLTIzZWYyZDBkNTQwMCIsInN1YnNjcmlwdGlvbl90aWVyIjoiYWdlbnQifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc2MDMxNjg4M31dLCJzZXNzaW9uX2lkIjoiMzFlYmU2N2QtYjIxMS00NjcwLWI2N2ItYzFhNWQ5N2RkMzk0IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.HfhsuLs7Jwlcumkpr-AsMZ0FwghvuamDKx82NmKfkZ8"

def test_get_all_deals():
    """Test getting all deals"""
    url = f"{BASE_URL}/deals"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("=" * 50)
    print("TEST: Get All Deals")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        deals = response.json()
        print(f"Found {len(deals)} deals")
        if deals:
            print(f"Sample deal: {json.dumps(deals[0], indent=2)}")
        print("✅ Test PASSED")
        return deals
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_get_deal_by_id(deal_id):
    """Test getting a single deal by ID"""
    url = f"{BASE_URL}/deals?id=eq.{deal_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Get Deal by ID")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        deals = response.json()
        if deals:
            print(f"Response: {json.dumps(deals[0], indent=2)}")
            print("✅ Test PASSED")
            return deals[0]
        else:
            print("⚠️  No deal found with that ID")
            return None
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_filter_deals_by_stage():
    """Test filtering deals by stage"""
    url = f"{BASE_URL}/deals?stage=eq.negotiation"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Filter Deals by Stage (negotiation)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        deals = response.json()
        print(f"Found {len(deals)} deals in negotiation stage")
        if deals:
            print(f"Sample deal: {json.dumps(deals[0], indent=2)}")
        print("✅ Test PASSED")
        return deals
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_filter_deals_by_value():
    """Test filtering deals by value range"""
    url = f"{BASE_URL}/deals?value=gte.500000&value=lte.1000000"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Filter Deals by Value ($500k-$1M)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        deals = response.json()
        print(f"Found {len(deals)} deals in value range")
        if deals:
            print(f"Sample deal: {json.dumps(deals[0], indent=2)}")
        print("✅ Test PASSED")
        return deals
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_sort_deals_by_value():
    """Test sorting deals by value descending"""
    url = f"{BASE_URL}/deals?order=value.desc&limit=5"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Sort Deals by Value (Descending)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        deals = response.json()
        print(f"Top {len(deals)} highest value deals:")
        for deal in deals:
            print(f"  - {deal.get('title')}: ${deal.get('value', 0):,.2f}")
        print("✅ Test PASSED")
        return deals
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def get_first_deal():
    """Helper function to get the first deal ID"""
    url = f"{BASE_URL}/deals?limit=1"
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
    print("\n🚀 Starting Deal Read Tests\n")
    
    # Test 1: Get all deals
    test_get_all_deals()
    
    # Test 2: Get deal by ID
    deal_id = get_first_deal()
    if deal_id:
        test_get_deal_by_id(deal_id)
    else:
        print("\n⚠️  No deals found. Create a deal first.")
    
    # Test 3: Filter by stage
    test_filter_deals_by_stage()
    
    # Test 4: Filter by value range
    test_filter_deals_by_value()
    
    # Test 5: Sort by value
    test_sort_deals_by_value()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print("All read operations completed")
