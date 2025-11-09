import requests
import json

# Configuration
BASE_URL = "https://pseqajrtcgiphfnworii.supabase.co/rest/v1"
ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXFhanJ0Y2dpcGhmbndvcmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMTkxNTMsImV4cCI6MjA3NDc5NTE1M30.guJfewEkLB2nI_k313XvIC69HbvFyPW0yZJr9WnU15U"

# JWT token extracted from your session
JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjRRVDMvSkRoT0hGcUVvaksiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3BzZXFhanJ0Y2dpcGhmbndvcmlpLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzOWMxYTZjMC1hMDQ4LTQ4YmYtOTEzMy0yM2VmMmQwZDU0MDAiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYyNjU5MTcwLCJpYXQiOjE3NjI2NTU1NzAsImVtYWlsIjoic210Yy5wb29uYW1AZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJjb21wYW55X25hbWUiOiJicmFpbmZ5IiwiZW1haWwiOiJzbXRjLnBvb25hbUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiUG9vbmFtIiwicGhvbmUiOiI3ODAtMzk0LTkxNjgiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6IjM5YzFhNmMwLWEwNDgtNDhiZi05MTMzLTIzZWYyZDBkNTQwMCIsInN1YnNjcmlwdGlvbl90aWVyIjoiYWdlbnQifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc2MDMxNjg4M31dLCJzZXNzaW9uX2lkIjoiMzFlYmU2N2QtYjIxMS00NjcwLWI2N2ItYzFhNWQ5N2RkMzk0IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.HfhsuLs7Jwlcumkpr-AsMZ0FwghvuamDKx82NmKfkZ8"

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
