import json
import os
import sys
import time
import requests

JULES_API_KEY = os.environ.get("JULES_API_KEY")
REPO_SOURCE = os.environ.get("JULES_REPO_SOURCE")
BASE_URL = "https://jules.googleapis.com/v1alpha"

if not JULES_API_KEY:
    raise ValueError("JULES_API_KEY environment variable is missing.")

# REPO_SOURCE fallback
if not REPO_SOURCE:
    github_repo = os.environ.get("GITHUB_REPOSITORY")
    if github_repo and "/" in github_repo:
        owner, name = github_repo.split("/")
        REPO_SOURCE = f"sources/github-{owner}-{name}"

# GitHub Actions event payload parsing
task_title = os.environ.get("TASK_TITLE")
task_prompt = os.environ.get("TASK_PROMPT")

event_path = os.environ.get("GITHUB_EVENT_PATH")
if event_path and os.path.exists(event_path):
    try:
        with open(event_path, "r", encoding="utf-8") as f:
            event_data = json.load(f)

        if "inputs" in event_data and event_data["inputs"]:
            task_title = event_data["inputs"].get("task_title") or task_title
            task_prompt = event_data["inputs"].get("task_prompt") or task_prompt
        elif "issue" in event_data:
            issue = event_data["issue"]
            task_title = f"Issue #{issue.get('number')}: {issue.get('title', '')}"
            task_prompt = f"{issue.get('title', '')}\n\n{issue.get('body', '') or ''}"
    except Exception as e:
        print(f"⚠️ Failed to parse GITHUB_EVENT_PATH: {e}")

task_title = task_title or "Jules Automated Task"
task_prompt = task_prompt or "Code cleanup and automated improvements"

print(f"📋 Source: {REPO_SOURCE}")
print(f"📋 Task Title: {task_title}")
print(f"📋 Task Prompt: {task_prompt[:100]}...")

headers = {
    "x-goog-api-key": JULES_API_KEY,
    "Content-Type": "application/json"
}

def create_session():
    payload = {
        "prompt": task_prompt,
        "title": task_title,
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
