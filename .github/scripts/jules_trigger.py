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

headers = {
    "X-Goog-Api-Key": JULES_API_KEY,
    "Content-Type": "application/json"
}

def resolve_source():
    """Jules API의 /sources 목록을 조회하여 적절한 source 리소스명을 결정합니다."""
    print("🔍 Fetching available sources from Jules API...")
    try:
        resp = requests.get(f"{BASE_URL}/sources", headers=headers)
        if resp.status_code != 200:
            print(f"⚠️ Failed to list sources (HTTP {resp.status_code}): {resp.text}")
            return None
        
        data = resp.json()
        sources = data.get("sources", [])
        print(f"📦 Found {len(sources)} source(s) in Jules account:")
        for s in sources:
            print(f"  - name: {s.get('name')}, githubRepo: {s.get('githubRepo', {})}")
        
        # 1. 환경변수 REPO_SOURCE가 목록에 있으면 우선 사용
        if REPO_SOURCE:
            for s in sources:
                if s.get("name") == REPO_SOURCE:
                    return s["name"]

        # 2. 현재 GitHub repository와 매칭되는 소스 검색
        github_repo = os.environ.get("GITHUB_REPOSITORY", "").lower()
        owner = os.environ.get("GITHUB_REPOSITORY_OWNER", "").lower()
        repo_name = github_repo.split("/")[-1] if "/" in github_repo else github_repo

        for s in sources:
            repo_info = s.get("githubRepo", {})
            s_owner = repo_info.get("owner", "").lower()
            s_repo = repo_info.get("repo", "").lower()
            if s_owner == owner and s_repo == repo_name:
                print(f"✅ Matched source by githubRepo: {s.get('name')}")
                return s.get("name")
            if repo_name and repo_name in s.get("name", "").lower():
                print(f"✅ Matched source by name keyword: {s.get('name')}")
                return s.get("name")

        # 만약 소스가 1개뿐이라면 해당 소스 자동 채택
        if len(sources) == 1:
            print(f"ℹ️ Only 1 source exists in Jules account, auto-selecting: {sources[0].get('name')}")
            return sources[0].get("name")
            
    except Exception as e:
        print(f"⚠️ Error while resolving source: {e}")
        
    return REPO_SOURCE or "sources/github-jazpiper-nhatrang-trip-2026"

def parse_task_details():
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
    return task_title, task_prompt

def create_session(source_name, title, prompt):
    payload = {
        "prompt": prompt,
        "title": title,
        "automationMode": "AUTO_CREATE_PR",
        "requirePlanApproval": False
    }
    
    if source_name:
        payload["sourceContext"] = {
            "source": source_name,
            "githubRepoContext": {
                "startingBranch": "main"
            }
        }

    print(f"🚀 Creating session with payload:\n{json.dumps(payload, indent=2)}")
    resp = requests.post(f"{BASE_URL}/sessions", headers=headers, json=payload)
    
    if resp.status_code >= 400:
        print(f"❌ Session creation failed (HTTP {resp.status_code}): {resp.text}")
        resp.raise_for_status()
        
    session = resp.json()
    print(f"✅ Session Created: {session.get('name')} (URL: {session.get('url')})")
    return session["name"]

def wait_for_completion(session_name, timeout_sec=1800):
    start = time.time()
    print("⏳ Waiting for Jules to complete development...")
    while time.time() - start < timeout_sec:
        resp = requests.get(f"{BASE_URL}/{session_name}", headers=headers)
        if resp.status_code >= 400:
            print(f"⚠️ Polling failed (HTTP {resp.status_code}): {resp.text}")
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
    source_name = resolve_source()
    task_title, task_prompt = parse_task_details()
    print(f"📋 Selected Source: {source_name}")
    print(f"📋 Task Title: {task_title}")
    print(f"📋 Task Prompt: {task_prompt[:100]}...")
    
    session_id = create_session(source_name, task_title, task_prompt)
    wait_for_completion(session_id)
