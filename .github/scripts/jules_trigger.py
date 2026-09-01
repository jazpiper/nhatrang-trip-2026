import os
import time
import requests

JULES_API_KEY = os.environ.get("JULES_API_KEY")
REPO_SOURCE = os.environ.get("JULES_REPO_SOURCE")
TASK_PROMPT = os.environ.get("TASK_PROMPT", "Code cleanup and automated improvements")
TASK_TITLE = os.environ.get("TASK_TITLE", "Jules Automated Task")
BASE_URL = "https://jules.googleapis.com/v1alpha"

if not JULES_API_KEY:
    raise ValueError("JULES_API_KEY environment variable is missing.")

headers = {
    "x-goog-api-key": JULES_API_KEY,
    "Content-Type": "application/json"
}

def create_session():
    payload = {
        "prompt": TASK_PROMPT,
        "title": TASK_TITLE,
        "sourceContext": {
            "source": REPO_SOURCE,
            "githubRepoContext": {
                "startingBranch": "main"
            }
        },
        "automationMode": "AUTO_CREATE_PR",
        "requirePlanApproval": False
    }
    
    resp = requests.post(f"{BASE_URL}/sessions", headers=headers, json=payload)
    resp.raise_for_status()
    session = resp.json()
    print(f"✅ Session Created: {session.get('name')} (URL: {session.get('url')})")
    return session["name"]

def wait_for_completion(session_name, timeout_sec=1800):
    start = time.time()
    print("⏳ Waiting for Jules to complete development...")
    while time.time() - start < timeout_sec:
        resp = requests.get(f"{BASE_URL}/{session_name}", headers=headers)
        resp.raise_for_status()
        data = resp.json()
        state = data.get("state")
        print(f"Current State: {state}")
        
        if state == "COMPLETED":
            outputs = data.get("outputs", [])
            for output in outputs:
                if "pullRequest" in output:
                    print(f"🚀 Created PR: {output['pullRequest']['url']}")
            return data
        elif state in ["FAILED", "PAUSED"]:
            raise RuntimeError(f"Session failed or paused with state: {state}")
            
        time.sleep(30)
    raise TimeoutError("Session timed out.")

if __name__ == "__main__":
    session_id = create_session()
    wait_for_completion(session_id)
