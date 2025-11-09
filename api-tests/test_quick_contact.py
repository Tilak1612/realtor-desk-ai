import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# Latest JWT token from your session
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjRRVDMvSkRoT0hGcUVvaksiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3BzZXFhanJ0Y2dpcGhmbndvcmlpLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzOWMxYTZjMC1hMDQ4LTQ4YmYtOTEzMy0yM2VmMmQwZDU0MDAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYyNjkxODEzLCJpYXQiOjE3NjI2ODgyMTMsImVtYWlsIjoic210Yy5wb29uYW1AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJjb21wYW55X25hbWUiOiJicmFpbmZ5IiwiZW1haWwiOiJzbXRjLnBvb25hbUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiUG9vbmFtIiwicGhvbmUiOiI3ODAtMzk0LTkxNjgiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjM5YzFhNmMwLWEwNDgtNDhiZi05MTMzLTIzZWYyZDBkNTQwMCIsInN1YnNjcmlwdGlvbl90aWVyIjoiYWdlbnQifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc2MDMxNjg4M31dLCJzZXNzaW9uX2lkIjoiMzFlYmU2N2QtYjIxMS00NjcwLWI2N2ItYzFhNWQ5N2RkMzk0IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.7jq2E-WLcw1AyxJnQmUF3My3nz6OJhov_hUtnsNrGfg"

def test_create_contact():
    """Test creating a contact with correct schema"""
    url = f"{BASE_URL}/contacts"
    
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Correct schema: first_name, last_name, email, phone, status, source
    contact_data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "johndoe@example.com",
        "phone": "1234567890",
        "status": "lead",
        "source": "api_test",
        "tags": ["test", "api"]
    }
    
    print("=" * 60)
    print("TEST: Create Contact")
    print("=" * 60)
    print(f"URL: {url}")
    print(f"Data: {json.dumps(contact_data, indent=2)}")
    print()
    
    response = requests.post(url, headers=headers, data=json.dumps(contact_data))
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 201:
        print("\n✅ SUCCESS - Contact created!")
        return response.json()[0]
    else:
        print("\n❌ FAILED - Error creating contact")
        return None

if __name__ == "__main__":
    contact = test_create_contact()
    if contact:
        print(f"\n📋 Created Contact ID: {contact['id']}")
