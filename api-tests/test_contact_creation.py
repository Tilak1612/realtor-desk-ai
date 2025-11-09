"""
Test script for creating a contact in RealtorDesk AI CRM.

Before running:
1. Login to the RealtorDesk app at: https://9b94f14f-9eff-4f86-a849-5078de07f6bc.lovableproject.com
2. Open browser DevTools (F12) > Console tab
3. Run: JSON.parse(localStorage.getItem('sb-pseqajrtcgiphfnworii-auth-token')).access_token
4. Copy the token and replace JWT_TOKEN below
"""

import requests
import json

# JWT token extracted from your session
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjRRVDMvSkRoT0hGcUVvaksiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3BzZXFhanJ0Y2dpcGhmbndvcmlpLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzOWMxYTZjMC1hMDQ4LTQ4YmYtOTEzMy0yM2VmMmQwZDU0MDAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYyNjU5MTcwLCJpYXQiOjE3NjI2NTU1NzAsImVtYWlsIjoic210Yy5wb29uYW1AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJjb21wYW55X25hbWUiOiJicmFpbmZ5IiwiZW1haWwiOiJzbXRjLnBvb25hbUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiUG9vbmFtIiwicGhvbmUiOiI3ODAtMzk0LTkxNjgiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjM5YzFhNmMwLWEwNDgtNDhiZi05MTMzLTIzZWYyZDBkNTQwMCIsInN1YnNjcmlwdGlvbl90aWVyIjoiYWdlbnQifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc2MDMxNjg4M31dLCJzZXNzaW9uX2lkIjoiMzFlYmU2N2QtYjIxMS00NjcwLWI2N2ItYzFhNWQ5N2RkMzk0IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.HfhsuLs7Jwlcumkpr-AsMZ0FwghvuamDKx82NmKfkZ8"

def test_create_contact():
    """Test creating a new contact via the REST API."""
    
    url = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1/contacts"
    
    headers = {
        "Authorization": f"Bearer {JWT_TOKEN}",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    # Correct data structure for contacts table
    data = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "phone": "123-456-7890",
        "status": "lead",
        "lead_source": "website",
        "notes": "Test contact created via API"
    }
    
    print("=" * 60)
    print("Testing Contact Creation")
    print("=" * 60)
    print(f"Endpoint: {url}")
    print(f"Data: {json.dumps(data, indent=2)}")
    print()
    
    try:
        response = requests.post(url, headers=headers, json=data)
        
        print(f"Status Code: {response.status_code}")
        print()
        
        if response.status_code == 201:
            print("✅ SUCCESS: Contact created!")
            contact = response.json()[0] if isinstance(response.json(), list) else response.json()
            print(f"Contact ID: {contact.get('id')}")
            print(f"Full Response: {json.dumps(contact, indent=2)}")
        elif response.status_code == 401:
            print("❌ ERROR: Authentication failed")
            print("Please update JWT_TOKEN with a valid token from your logged-in session")
        else:
            print(f"❌ ERROR: Request failed")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ EXCEPTION: {str(e)}")
    
    print("=" * 60)


if __name__ == "__main__":
    if JWT_TOKEN == "YOUR_JWT_TOKEN_HERE":
        print("⚠️  WARNING: Please update JWT_TOKEN before running this test!")
        print()
        print("Steps to get your JWT token:")
        print("1. Login to: https://9b94f14f-9eff-4f86-a849-5078de07f6bc.lovableproject.com")
        print("2. Open DevTools (F12) > Console")
        print("3. Run: JSON.parse(localStorage.getItem('sb-pseqajrtcgiphfnworii-auth-token')).access_token")
        print("4. Copy the token and update JWT_TOKEN in this script")
        print()
    else:
        test_create_contact()
