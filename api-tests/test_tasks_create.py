import requests
import json
from datetime import datetime, timedelta

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# Replace with actual JWT token from authenticated user
JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"

def test_create_task_full():
    """Test creating a task with all fields"""
    url = f"{BASE_URL}/tasks"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    due_date = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
    
    data = {
        "title": "Follow up with client about property viewing",
        "description": "Schedule a viewing for the downtown condo listing",
        "due_date": due_date,
        "due_time": "14:30:00",
        "priority": "high",
        "status": "pending"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    print("=" * 50)
    print("TEST: Create Task (All Fields)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        task = response.json()[0]
        print(f"Response: {json.dumps(task, indent=2)}")
        print("✅ Test PASSED - Task created successfully")
        return task
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_create_task_minimal():
    """Test creating a task with minimal required fields"""
    url = f"{BASE_URL}/tasks"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "title": "Call potential buyer"
    }
    
    response = requests.post(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Create Task (Minimal Fields)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        task = response.json()[0]
        print(f"Response: {json.dumps(task, indent=2)}")
        print("✅ Test PASSED - Task created with minimal fields")
        return task
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_create_task_with_contact():
    """Test creating a task linked to a contact"""
    # First, get a contact ID
    contact_url = f"{BASE_URL}/contacts?limit=1"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    contact_response = requests.get(contact_url, headers=headers)
    
    if contact_response.status_code == 200 and contact_response.json():
        contact_id = contact_response.json()[0]['id']
        
        # Create task with contact
        url = f"{BASE_URL}/tasks"
        headers["Prefer"] = "return=representation"
        
        due_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        
        data = {
            "title": "Send property brochure",
            "contact_id": contact_id,
            "due_date": due_date,
            "priority": "medium"
        }
        
        response = requests.post(url, headers=headers, data=json.dumps(data))
        
        print("\n" + "=" * 50)
        print("TEST: Create Task (With Contact)")
        print("=" * 50)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            task = response.json()[0]
            print(f"Response: {json.dumps(task, indent=2)}")
            print("✅ Test PASSED - Task created with contact link")
            return task
        else:
            print(f"Response: {response.text}")
            print("❌ Test FAILED")
            return None
    else:
        print("\n⚠️  No contacts found. Create a contact first to test this feature.")
        return None

def test_create_task_with_deal():
    """Test creating a task linked to a deal"""
    # First, get a deal ID
    deal_url = f"{BASE_URL}/deals?limit=1"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    deal_response = requests.get(deal_url, headers=headers)
    
    if deal_response.status_code == 200 and deal_response.json():
        deal_id = deal_response.json()[0]['id']
        
        # Create task with deal
        url = f"{BASE_URL}/tasks"
        headers["Prefer"] = "return=representation"
        
        data = {
            "title": "Prepare closing documents",
            "deal_id": deal_id,
            "priority": "high",
            "description": "Get all paperwork ready for closing"
        }
        
        response = requests.post(url, headers=headers, data=json.dumps(data))
        
        print("\n" + "=" * 50)
        print("TEST: Create Task (With Deal)")
        print("=" * 50)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            task = response.json()[0]
            print(f"Response: {json.dumps(task, indent=2)}")
            print("✅ Test PASSED - Task created with deal link")
            return task
        else:
            print(f"Response: {response.text}")
            print("❌ Test FAILED")
            return None
    else:
        print("\n⚠️  No deals found. Create a deal first to test this feature.")
        return None

if __name__ == "__main__":
    print("\n🚀 Starting Task Creation Tests\n")
    
    # Test 1: Create task with all fields
    test_create_task_full()
    
    # Test 2: Create task with minimal fields
    test_create_task_minimal()
    
    # Test 3: Create task with contact
    test_create_task_with_contact()
    
    # Test 4: Create task with deal
    test_create_task_with_deal()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print("All creation tests completed")
