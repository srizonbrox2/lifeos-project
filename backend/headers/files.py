import json
import pathlib
import hashlib
from typing import List, Dict, Any, Optional
import os

DASHBOARD_FILE = pathlib.Path("/home/aizen/Desktop/lifeos/backend/database/dashboardData/dashboard.json")
USERS_FILE = pathlib.Path("/home/aizen/Desktop/lifeos/backend/database/sign_up.json")


def _ensure_users_file():
    USERS_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not USERS_FILE.exists():
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)


def _read_users_list() -> List[Dict[str, Any]]:
    _ensure_users_file()
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                return data
    except (json.JSONDecodeError, OSError):
        pass
    return []


def _write_users_list(users: List[Dict[str, Any]]):
    _ensure_users_file()
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, indent=2, ensure_ascii=False)


def _hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def saveLoginedUser(email: str, password: str):
    # legacy fallback: not used for auth persistence anymore
    filePath = pathlib.Path("/home/aizen/Desktop/lifeos/backend/database/users.txt")
    with open(filePath, "a", encoding="utf-8") as main_file:
        query_format = f"\n{email} : {password}"
        main_file.write(query_format)


def readRegisterdUsers() -> List[Dict[str, Any]]:
    """Return list of registered users as dicts."""
    return _read_users_list()


def saveRegisterdUsers(details: Dict[str, Any]) -> Dict[str, Any]:
    """Save a new registered user to sign_up.json.

    Returns dict with keys: success (bool), message (str), user (optional)
    """
    users = _read_users_list()
    email = (details.get("email") or "").strip().lower()
    username = (details.get("username") or details.get("user_name") or "").strip()
    password_raw = details.get("password") or ""
    fullname = details.get("fullname") or details.get("full_name") or ""

    if not email or not password_raw:
        return {"success": False, "message": "Email and password are required"}

    for u in users:
        if (u.get("email") or "").strip().lower() == email:
            return {"success": False, "message": "Account existed with this email"}
        if username and (u.get("username") or "") == username:
            return {"success": False, "message": "Account existed with this username"}

    hashed = _hash_password(password_raw)
    user = {
        "id": len(users) + 1,
        "email": email,
        "username": username,
        "fullname": fullname,
        "password_hash": hashed,
    }
    users.append(user)
    _write_users_list(users)
    return {"success": True, "message": "Signup successful", "user": user}


def saveDashBoard(data: object):
    filePath = DASHBOARD_FILE
    filePath.parent.mkdir(parents=True, exist_ok=True)

    username = (
        data.get("username")
        or data.get("user")
        or data.get("user_id")
        or "guest"
    )

    saved_data = {"users": {}}
    if filePath.exists():
        try:
            with open(filePath, "r", encoding="utf-8") as file:
                loaded_data = json.load(file)
                if isinstance(loaded_data, dict) and isinstance(loaded_data.get("users"), dict):
                    saved_data = loaded_data
        except (json.JSONDecodeError, OSError):
            saved_data = {"users": {}}

    users = saved_data.setdefault("users", {})
    user_entry = users.setdefault(username, {})
    main_goal = user_entry.setdefault("main_goal", {})

    main_goal["goal"] = data.get("goal") or data.get("goal_")
    main_goal["goal_time"] = data.get("goal_time")
    main_goal["goal_desc"] = data.get("goal_desc")

    if data.get("goal_analytications") is not None:
        main_goal["goal_analytications"] = data.get("goal_analytications")
    elif "goal_analytications" not in main_goal:
        main_goal["goal_analytications"] = {}

    for key, value in data.items():
        if key in {"username", "user", "user_id", "goal", "goal_", "goal_time", "goal_desc", "goal_analytications"}:
            continue
        main_goal[key] = value

    with open(filePath, "w", encoding="utf-8") as file:
        json.dump(saved_data, file, indent=2, ensure_ascii=False)
        file.write("\n")


def updatePasswordForEmail(email: str, new_password: str) -> bool:
    users = _read_users_list()
    normalized_email = (email or "").strip().lower()
    found = False
    for u in users:
        if (u.get("email") or "").strip().lower() == normalized_email:
            u["password_hash"] = _hash_password(new_password)
            found = True
            break

    if not found:
        return False

    _write_users_list(users)
    return True


def find_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    users = _read_users_list()
    normalized_email = (email or "").strip().lower()
    for u in users:
        if (u.get("email") or "").strip().lower() == normalized_email:
            return u
    return None


def check_user_credentials(email: str, password: str) -> bool:
    if not email or not password:
        return False
    user = find_user_by_email(email)
    if not user:
        return False
    return user.get("password_hash") == _hash_password(password)



def createNewStatisticDatabase(username: str):
    """
    Creates a new JSON database file for the given username 
    initialized with an empty dictionary if it doesn't already exist.
    """
    filename = pathlib.Path(f"/home/aizen/Desktop/lifeos/backend/database/users_data/{username}.json")
    
    if not os.path.exists(filename):
        with open(filename, 'w', encoding='utf-8') as file:
            json.dump({}, file, indent=4)
        print(f"Database created successfully for user: '{username}'")
    else:
        print(f"Database for '{username}' already exists.")


def writeUserStatisticData(username: str, data: dict):
    """
    Reads the existing user JSON file, updates it with the new 
    statistic data, and saves it back.
    """
    filename = pathlib.Path(f"/home/aizen/Desktop/lifeos/backend/database/users_data/{username}.json")
    # filename = f"{username}.json"
    
    # Auto-create the database file if the user calls write without creating it first
    if not os.path.exists(filename):
        createNewStatisticDatabase(username)
        
    # 1. Read the existing data
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            current_data = json.load(file)
    except json.JSONDecodeError:
        # Fallback if the file exists but is empty or corrupted
        current_data = {}

    # 2. Update the existing dictionary with the new data
    current_data.update(data)

    # 3. Write the updated data back to the JSON file
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(current_data, file, indent=4)
        
    print(f"Successfully updated statistic data for '{username}'.")

# =====================================================================

# 1. Initialize the database for "obito"
# createNewStatisticDatabase("obito")

# 2. Prepare the data payload
statistic = {
    "monthly_progressed": {
        "sub": "Creating an ai agent",
        "details": {
            "frontend": "complete",
            "backend": "complete",
            "database": "complete",
            "core":{
                "dsa": "complete",
                "ml": "complete"
            }
        }
    }
}

# 3. Write the data
# writeUserStatisticData("kakashi", weekly_stats)

def getUserStatisticData(username: str):
    filename = pathlib.Path(f"/home/aizen/Desktop/lifeos/backend/database/users_data/{username}.json")
    with open(filename, "r") as main_file:
        user_data = json.load(main_file)
        # print(user_data)
        return {
            "templete": statistic,
            "data": user_data
        }
        
        
def Innitiate(username: str , data: dict, return_data: bool):
    createNewStatisticDatabase(username)
    writeUserStatisticData(username, data)
    if return_data == True:
        value = getUserStatisticData(username)
        return value
    else:
        pass    
    