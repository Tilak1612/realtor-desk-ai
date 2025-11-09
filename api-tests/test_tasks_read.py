import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# Replace with actual JWT token from authenticated user
JWT_TOKEN = "YOUR_JWT_TOKEN_HERE"

def test_get_all_tasks():
    """Test getting all tasks"""
    url = f"{BASE_URL}/tasks"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("=" * 50)
    print("TEST: Get All Tasks")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        tasks = response.json()
        print(f"Found {len(tasks)} tasks")
        if tasks:
            print(f"Sample task: {json.dumps(tasks[0], indent=2)}")
        print("✅ Test PASSED")
        return tasks
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_get_task_by_id(task_id):
    """Test getting a single task by ID"""
    url = f"{BASE_URL}/tasks?id=eq.{task_id}"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Get Task by ID")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        tasks = response.json()
        if tasks:
            print(f"Response: {json.dumps(tasks[0], indent=2)}")
            print("✅ Test PASSED")
            return tasks[0]
        else:
            print("⚠️  No task found with that ID")
            return None
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_filter_tasks_by_status():
    """Test filtering tasks by status"""
    url = f"{BASE_URL}/tasks?status=eq.pending"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Filter Tasks by Status (pending)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        tasks = response.json()
        print(f"Found {len(tasks)} pending tasks")
        if tasks:
            print(f"Sample task: {json.dumps(tasks[0], indent=2)}")
        print("✅ Test PASSED")
        return tasks
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_filter_tasks_by_priority():
    """Test filtering tasks by priority"""
    url = f"{BASE_URL}/tasks?priority=eq.high"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Filter Tasks by Priority (high)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        tasks = response.json()
        print(f"Found {len(tasks)} high priority tasks")
        if tasks:
            print(f"Sample task: {json.dumps(tasks[0], indent=2)}")
        print("✅ Test PASSED")
        return tasks
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_sort_tasks_by_due_date():
    """Test sorting tasks by due date"""
    url = f"{BASE_URL}/tasks?order=due_date.asc&limit=5"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Sort Tasks by Due Date (Ascending)")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        tasks = response.json()
        print(f"Next {len(tasks)} upcoming tasks:")
        for task in tasks:
            due = task.get('due_date', 'No date')
            print(f"  - {task.get('title')}: {due}")
        print("✅ Test PASSED")
        return tasks
    else:
        print(f"Response: {response.text}")
        print("❌ Test FAILED")
        return None

def test_filter_overdue_tasks():
    """Test filtering overdue tasks"""
    from datetime import datetime
    today = datetime.now().strftime("%Y-%m-%d")
    
    url = f"{BASE_URL}/tasks?due_date=lt.{today}&status=eq.pending"
    headers = {
        "apikey": ANON_KEY,
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    response = requests.get(url, headers=headers)
    
    print("\n" + "=" * 50)
    print("TEST: Filter Overdue Tasks")
    print("=" * 50)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        tasks = response.json()
        print(f"Found {len(tasks)} overdue tasks")
        if tasks:
            print(f"Sample task: {json.dumps(tasks[0], indent=2)}")
        print("✅ Test PASSED")
        return tasks
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
    print("\n🚀 Starting Task Read Tests\n")
    
    # Test 1: Get all tasks
    test_get_all_tasks()
    
    # Test 2: Get task by ID
    task_id = get_first_task()
    if task_id:
        test_get_task_by_id(task_id)
    else:
        print("\n⚠️  No tasks found. Create a task first.")
    
    # Test 3: Filter by status
    test_filter_tasks_by_status()
    
    # Test 4: Filter by priority
    test_filter_tasks_by_priority()
    
    # Test 5: Sort by due date
    test_sort_tasks_by_due_date()
    
    # Test 6: Filter overdue tasks
    test_filter_overdue_tasks()
    
    print("\n" + "=" * 50)
    print("TEST SUMMARY")
    print("=" * 50)
    print("All read operations completed")
