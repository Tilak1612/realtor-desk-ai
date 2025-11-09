import requests
import json
from datetime import datetime, timedelta

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# Replace with actual JWT token from authenticated user
JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"

def test_complete_task(task_id):
    """Test marking a task as completed"""
    url = f"{BASE_URL}/tasks?id=eq.{task_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    completed_time = datetime.now().isoformat()
    
    data = {
        "status": "completed",
        "completed_at": completed_time
    }
    
    response = requests.patch(url, headers=headers, data=json.dumps(data))
    
    print("=" * 50)
    print("TEST: Complete Task")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        updated = response.json()
        print(f"Response: {json.dumps(updated, indent=2)}")
        print("✅ Test PASSED - Task marked as completed")
        return updated
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_update_task_priority(task_id):
    """Test updating task priority"""
    url = f"{BASE_URL}/tasks?id=eq.{task_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "priority": "urgent"
    }
    
    response = requests.patch(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Update Task Priority")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        updated = response.json()
        print(f"Response: {json.dumps(updated, indent=2)}")
        print("✅ Test PASSED - Priority updated")
        return updated
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_reschedule_task(task_id):
    """Test rescheduling a task"""
    url = f"{BASE_URL}/tasks?id=eq.{task_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    new_date = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
    
    data = {
        "due_date": new_date,
        "due_time": "10:00:00"
    }
    
    response = requests.patch(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Reschedule Task")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        updated = response.json()
        print(f"Response: {json.dumps(updated, indent=2)}")
        print("✅ Test PASSED - Task rescheduled")
        return updated
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_update_task_description(task_id):
    """Test updating task description"""
    url = f"{BASE_URL}/tasks?id=eq.{task_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    data = {
        "description": "Updated: Need to include virtual tour link and neighborhood stats"
    }
    
    response = requests.patch(url, headers=headers, data=json.dumps(data))
    
    print("\n" + "=" * 50)
    print("TEST: Update Task Description")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        updated = response.json()
        print(f"Response: {json.dumps(updated, indent=2)}")
        print("✅ Test PASSED - Description updated")
        return updated
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def get_first_task():
    """Helper function to get the first task ID"""
    url = f"{BASE_URL}/tasks?limit=1"
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
    print("\n🚀 Starting Task Update Tests\n")
    
    # Get a task ID to test with
    task_id = get_first_task()
    
    if not task_id:
        print("⚠️  No tasks found. Please create a task first.")
    else:
        print(f"Using task ID: {task_id}\n")
        
        # Test 1: Complete task
        test_complete_task(task_id)
        
        # Test 2: Update priority
        test_update_task_priority(task_id)
        
        # Test 3: Reschedule task
        test_reschedule_task(task_id)
        
        # Test 4: Update description
        test_update_task_description(task_id)
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print("All update operations completed")
