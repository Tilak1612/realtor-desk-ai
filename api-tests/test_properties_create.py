import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# Replace with actual JWT token from authenticated user
JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"

def test_create_property_full():
    """Test creating a property listing with all fields"""
    url = f"{BASE_URL}/property_listings"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "title": "Luxury Downtown Condo",
        "description": "Stunning 2-bedroom condo in the heart of downtown with panoramic city views",
        "address": "123 Main Street, Unit 1502",
        "city": "Toronto",
        "province": "ON",
        "postal_code": "M5H 2N2",
        "property_type": "condo",
        "listing_type": "sale",
        "price": 850000,
        "bedrooms": 2,
        "bathrooms": 2,
        "square_feet": 1200,
        "year_built": 2018,
        "status": "active",
        "features": ["parking", "gym", "concierge", "rooftop_terrace"]
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    print("=" * 50)
    print("TEST: Create Property (All Fields)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        property_listing = response.json()[0]
        print(f"Response: {json.dumps(property_listing, indent=2)}")
        print("✅ Test PASSED - Property created successfully")
        return property_listing
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_create_property_minimal():
    """Test creating a property listing with minimal required fields"""
    url = f"{BASE_URL}/property_listings"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "title": "Cozy Family Home",
        "address": "456 Oak Avenue"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Create Property (Minimal Fields)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        property_listing = response.json()[0]
        print(f"Response: {json.dumps(property_listing, indent=2)}")
        print("✅ Test PASSED - Property created with minimal fields")
        return property_listing
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_create_rental_property():
    """Test creating a rental property listing"""
    url = f"{BASE_URL}/property_listings"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "title": "Modern 1BR Apartment for Rent",
        "description": "Bright and spacious 1-bedroom apartment, newly renovated",
        "address": "789 Queen Street West, Unit 304",
        "city": "Toronto",
        "province": "ON",
        "property_type": "apartment",
        "listing_type": "rent",
        "price": 2500,
        "bedrooms": 1,
        "bathrooms": 1,
        "square_feet": 650,
        "status": "active"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Create Property (Rental)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        property_listing = response.json()[0]
        print(f"Response: {json.dumps(property_listing, indent=2)}")
        print("✅ Test PASSED - Rental property created")
        return property_listing
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_create_house_listing():
    """Test creating a single-family house listing"""
    url = f"{BASE_URL}/property_listings"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "title": "Beautiful 4BR Family Home",
        "description": "Spacious family home with backyard and garage",
        "address": "321 Maple Drive",
        "city": "Mississauga",
        "province": "ON",
        "postal_code": "L5B 3Y4",
        "property_type": "house",
        "listing_type": "sale",
        "price": 1250000,
        "bedrooms": 4,
        "bathrooms": 3.5,
        "square_feet": 2800,
        "lot_size": 5000,
        "year_built": 2010,
        "features": ["garage", "backyard", "fireplace", "finished_basement"]
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Create Property (House)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        property_listing = response.json()[0]
        print(f"Response: {json.dumps(property_listing, indent=2)}")
        print("✅ Test PASSED - House listing created")
        return property_listing
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

if __name__ == "__main__":
    print("\n🚀 Starting Property Listing Creation Tests\n")
    
    # Test 1: Create property with all fields
    test_create_property_full()
    
    # Test 2: Create property with minimal fields
    test_create_property_minimal()
    
    # Test 3: Create rental property
    test_create_rental_property()
    
    # Test 4: Create house listing
    test_create_house_listing()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print("All creation tests completed")
