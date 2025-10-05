from fastapi import APIRouter, Depends, HTTPException
from typing import List
from routes.auth import get_current_user, TokenData
from models.core import Goal
from models.schemas import GoalCreate, GoalUpdate
from services.supabase_service import (
    get_user_goals, create_goal as create_goal_db,
    update_goal as update_goal_db, delete_goal as delete_goal_db
)
from errors import NotFoundException

router = APIRouter()

@router.get("/", response_model=List[Goal])
async def get_goals(current_user: TokenData = Depends(get_current_user)):
    """Get all goals for the current user"""
    goals = await get_user_goals(current_user.email)
    return goals

@router.post("/", response_model=Goal)
async def create_goal(goal: GoalCreate, current_user: TokenData = Depends(get_current_user)):
    """Create a new goal for the current user"""
    goal_data = {
        "user_id": current_user.email,
        **goal.dict(),
        "current_amount": 0,
        "is_completed": False
    }
    created_goal = await create_goal_db(goal_data)
    if not created_goal:
        raise HTTPException(status_code=400, detail="Could not create goal")
    return created_goal

@router.put("/{goal_id}", response_model=Goal)
async def update_goal(
    goal_id: str,
    goal_update: GoalUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    """Update a goal by ID"""
    updated_goal = await update_goal_db(goal_id, goal_update.dict(exclude_unset=True), current_user.email)
    if not updated_goal:
        raise NotFoundException(detail=f"Goal with ID {goal_id} not found")
    return updated_goal

@router.delete("/{goal_id}")
async def delete_goal(goal_id: str, current_user: TokenData = Depends(get_current_user)):
    """Delete a goal by ID"""
    result = await delete_goal_db(goal_id, current_user.email)
    if not result:
        raise NotFoundException(detail=f"Goal with ID {goal_id} not found")
    return {"message": "Goal deleted successfully"}