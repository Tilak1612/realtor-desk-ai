import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# Replace with actual JWT token from authenticated user
JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"

def test_get_all_properties():
    """Test getting all property listings"""
    url = f"{BASE_URL}/property_listings"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("=" * 50)
    print("TEST: Get All Property Listings")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        properties = response.json()
        print(f"Found {len(properties)} property listings")
        if properties:
            print(f"Sample property: {json.dumps(properties[0], indent=2)}")
        print("✅ Test PASSED")
        return properties
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_get_property_by_id(property_id):
    """Test getting a single property listing by ID"""
    url = f"{BASE_URL}/property_listings?id=eq.{property_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Get Property by ID")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        properties = response.json()
        if properties:
            print(f"Response: {json.dumps(properties[0], indent=2)}")
            print("✅ Test PASSED")
            return properties[0]
        else:
            print("⚠️  No property found with that ID")
            return None
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_filter_by_property_type():
    """Test filtering properties by type"""
    url = f"{BASE_URL}/property_listings?property_type=eq.condo"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Filter by Property Type (condo)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        properties = response.json()
        print(f"Found {len(properties)} condo listings")
        if properties:
            print(f"Sample property: {json.dumps(properties[0], indent=2)}")
        print("✅ Test PASSED")
        return properties
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_filter_by_price_range():
    """Test filtering properties by price range"""
    url = f"{BASE_URL}/property_listings?price=gte.500000&price=lte.1000000"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Filter by Price Range ($500k-$1M)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        properties = response.json()
        print(f"Found {len(properties)} properties in price range")
        if properties:
            print(f"Sample property: {json.dumps(properties[0], indent=2)}")
        print("✅ Test PASSED")
        return properties
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_filter_by_bedrooms():
    """Test filtering properties by number of bedrooms"""
    url = f"{BASE_URL}/property_listings?bedrooms=gte.3"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Filter by Bedrooms (3+)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        properties = response.json()
        print(f"Found {len(properties)} properties with 3+ bedrooms")
        if properties:
            for prop in properties[:3]:
                print(f"  - {prop.get('title')}: {prop.get('bedrooms')} BR, ${prop.get('price', 0):,.0f}")
        print("✅ Test PASSED")
        return properties
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_filter_by_city():
    """Test filtering properties by city"""
    url = f"{BASE_URL}/property_listings?city=eq.Toronto"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Filter by City (Toronto)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        properties = response.json()
        print(f"Found {len(properties)} properties in Toronto")
        if properties:
            print(f"Sample property: {json.dumps(properties[0], indent=2)}")
        print("✅ Test PASSED")
        return properties
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_filter_active_listings():
    """Test filtering active property listings"""
    url = f"{BASE_URL}/property_listings?status=eq.active"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Filter Active Listings")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        properties = response.json()
        print(f"Found {len(properties)} active listings")
        if properties:
            print(f"Sample property: {json.dumps(properties[0], indent=2)}")
        print("✅ Test PASSED")
        return properties
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
    print("\n🚀 Starting Property Listing Read Tests\n")
    
    # Test 1: Get all properties
    test_get_all_properties()
    
    # Test 2: Get property by ID
    property_id = get_first_property()
    if property_id:
        test_get_property_by_id(property_id)
    else:
        print("\n⚠️  No properties found. Create a property first.")
    
    # Test 3: Filter by property type
    test_filter_by_property_type()
    
    # Test 4: Filter by price range
    test_filter_by_price_range()
    
    # Test 5: Filter by bedrooms
    test_filter_by_bedrooms()
    
    # Test 6: Filter by city
    test_filter_by_city()
    
    # Test 7: Filter active listings
    test_filter_active_listings()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print("All read operations completed")
