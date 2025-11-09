import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# JWT token extracted from your session
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjRRVDMvSkRoT0hGcUVvaksiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3BzZXFhanJ0Y2dpcGhmbndvcmlpLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzOWMxYTZjMC1hMDQ4LTQ4YmYtOTEzMy0yM2VmMmQwZDU0MDAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYyNjU5MTcwLCJpYXQiOjE3NjI2NTU1NzAsImVtYWlsIjoic210Yy5wb29uYW1AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJjb21wYW55X25hbWUiOiJicmFpbmZ5IiwiZW1haWwiOiJzbXRjLnBvb25hbUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiUG9vbmFtIiwicGhvbmUiOiI3ODAtMzk0LTkxNjgiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjM5YzFhNmMwLWEwNDgtNDhiZi05MTMzLTIzZWYyZDBkNTQwMCIsInN1YnNjcmlwdGlvbl90aWVyIjoiYWdlbnQifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc2MDMxNjg4M31dLCJzZXNzaW9uX2lkIjoiMzFlYmU2N2QtYjIxMS00NjcwLWI2N2ItYzFhNWQ5N2RkMzk0IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.HfhsuLs7Jwlcumkpr-AsMZ0FwghvuamDKx82NmKfkZ8"

def test_get_all_contacts():
    """Test retrieving all contacts"""
    url = f"{BASE_URL}/contacts"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("=" * 50)
    print("TEST: Get All Contacts")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        contacts = response.json()
        print(f"Total contacts: {len(contacts)}")
        print(f"Response: {json.dumps(contacts[:2], indent=2)}...")  # Show first 2
        print("✅ Test PASSED - Retrieved contacts successfully")
        return contacts
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return []

def test_get_single_contact(contact_id):
    """Test retrieving a single contact by ID"""
    url = f"{BASE_URL}/contacts?id=eq.{contact_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Get Single Contact")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        contact = response.json()
        print(f"Response: {json.dumps(contact, indent=2)}")
        print("✅ Test PASSED - Retrieved contact successfully")
        return contact[0] if contact else None
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_filter_contacts_by_status():
    """Test filtering contacts by status"""
    url = f"{BASE_URL}/contacts?status=eq.lead"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Filter Contacts by Status (lead)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        contacts = response.json()
        print(f"Lead contacts found: {len(contacts)}")
        print("✅ Test PASSED - Filtered contacts successfully")
        return contacts
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return []

def test_search_contacts_by_email():
    """Test searching contacts by email"""
    url = f"{BASE_URL}/contacts?email=like.*@example.com"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Search Contacts by Email Domain")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        contacts = response.json()
        print(f"Contacts with @example.com: {len(contacts)}")
        print("✅ Test PASSED - Searched contacts successfully")
        return contacts
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return []

if __name__ == "__main__":
    print("\n🚀 Starting Contact Read Tests\n")
    
    # Test 1: Get all contacts
    all_contacts = test_get_all_contacts()
    
    # Test 2: Get single contact (if any exist)
    if all_contacts:
        test_get_single_contact(all_contacts[0]['id'])
    
    # Test 3: Filter by status
    test_filter_contacts_by_status()
    
    # Test 4: Search by email
    test_search_contacts_by_email()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print("All read operations completed")
