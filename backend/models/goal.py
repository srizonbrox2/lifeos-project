from fastapi import APIRouter
from schemas import dashboard
from headers import files

router = APIRouter()
schema = dashboard.MainGoal

@router.post('/goal_fetch')
async def handle_goal(data: schema):
    goal = data.goal
    goal_desc = data.goal_desc
    goal_time = data.goal_time
    username = getattr(data, "username", None)
    goal_analytications = getattr(data, "goal_analytications", None)
    try:
        files.saveDashBoard({
            "username": username,
            "goal": goal,
            "goal_time": goal_time,
            "goal_desc": goal_desc,
            "goal_analytications": goal_analytications,
        })
        
        # Creating their own database 
        
        return {
            "status": True,
            "message": "Goal data has been saved in database"
        }
    except Exception:
        return {
            "status": False,
            "message": "An error has occurred in the server. Please try again"
        }