import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# Replace with actual JWT token from authenticated user
JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"

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
