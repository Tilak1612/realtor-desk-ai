import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# JWT token extracted from your session
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjRRVDMvSkRoT0hGcUVvaksiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3BzZXFhanJ0Y2dpcGhmbndvcmlpLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzOWMxYTZjMC1hMDQ4LTQ4YmYtOTEzMy0yM2VmMmQwZDU0MDAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYyNjU5MTcwLCJpYXQiOjE3NjI2NTU1NzAsImVtYWlsIjoic210Yy5wb29uYW1AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJjb21wYW55X25hbWUiOiJicmFpbmZ5IiwiZW1haWwiOiJzbXRjLnBvb25hbUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiUG9vbmFtIiwicGhvbmUiOiI3ODAtMzk0LTkxNjgiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjM5YzFhNmMwLWEwNDgtNDhiZi05MTMzLTIzZWYyZDBkNTQwMCIsInN1YnNjcmlwdGlvbl90aWVyIjoiYWdlbnQifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc2MDMxNjg4M31dLCJzZXNzaW9uX2lkIjoiMzFlYmU2N2QtYjIxMS00NjcwLWI2N2ItYzFhNWQ5N2RkMzk0IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.HfhsuLs7Jwlcumkpr-AsMZ0FwghvuamDKx82NmKfkZ8"

def create_test_contact():
    """Create a contact for deletion testing"""
    url = f"{BASE_URL}/contacts"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "first_name": "Test",
        "last_name": "DeleteMe",
        "email": f"test.delete.{requests.utils.quote(str(hash('test')))}@example.com"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    if response.status_code == 201:
        contact = response.json()[0] if isinstance(response.json(), list) else response.json()
        print(f"✅ Created test contact: {contact['id']}")
        return contact['id']
    return None

def test_delete_contact(contact_id):
    """Test deleting a contact by ID"""
    url = f"{BASE_URL}/contacts?id=eq.{contact_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.delete(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Delete Contact")
    print("=" * 50)
    print(f"Contact ID: {contact_id}")
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 204:
        print("✅ Test PASSED - Contact deleted successfully")
        return True
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return False

def test_verify_deletion(contact_id):
    """Verify that the contact was actually deleted"""
    url = f"{BASE_URL}/contacts?id=eq.{contact_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Verify Deletion")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        contacts = response.json()
        if len(contacts) == 0:
            print("✅ Test PASSED - Contact no longer exists")
            return True
        else:
            print("❌ Test FAILED - Contact still exists")
            return False
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED - Could not verify")
        return False

def test_delete_nonexistent_contact():
    """Test deleting a contact that doesn't exist"""
    fake_id = "00000000-0000-0000-0000-000000000000"
    url = f"{BASE_URL}/contacts?id=eq.{fake_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.delete(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Delete Non-existent Contact")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    # 204 is returned even if nothing was deleted
    if response.status_code == 204:
        print("✅ Test PASSED - Handled gracefully")
        return True
    else:
        print(f"Response: {response.text}")
        return False

if __name__ == "__main__":
    print("\n🚀 Starting Contact Delete Tests\n")
    
    print("Creating test contact for deletion...")
    contact_id = create_test_contact()
    
    if not contact_id:
        print("⚠️  Could not create test contact")
    else:
        # Test 1: Delete the contact
        deleted = test_delete_contact(contact_id)
        
        # Test 2: Verify deletion
        if deleted:
            test_verify_deletion(contact_id)
        
        # Test 3: Try to delete non-existent contact
        test_delete_nonexistent_contact()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print("All delete operations completed")
