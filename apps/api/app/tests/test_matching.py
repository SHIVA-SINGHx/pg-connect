"""
PGConnect API — Unit tests for deterministic roommate matching and scoring.
"""

from datetime import date, timedelta
import pytest
from app.models.roommate import (
    FoodPreference,
    RoommateProfile,
    SleepSchedule,
    SmokingPreference,
)
from app.services.matching_service import calculate_match_score


def test_perfect_compatibility_score():
    today = date.today()
    user_a = RoommateProfile(
        preferred_areas=["Cyber City", "Sector 22"],
        budget_min=15000,
        budget_max=22000,
        move_in_date=today,
        move_in_flexible=False,
        food_preference=FoodPreference.VEGETARIAN,
        sleep_schedule=SleepSchedule.EARLY_BIRD,
        smoking_preference=SmokingPreference.NO_SMOKING,
        has_pets=False,
        ok_with_pets=True,
    )
    user_b = RoommateProfile(
        preferred_areas=["Cyber City", "Udyog Vihar"],
        budget_min=16000,
        budget_max=24000,
        move_in_date=today + timedelta(days=2),
        move_in_flexible=False,
        food_preference=FoodPreference.VEGETARIAN,
        sleep_schedule=SleepSchedule.EARLY_BIRD,
        smoking_preference=SmokingPreference.NO_SMOKING,
        has_pets=False,
        ok_with_pets=True,
    )

    score, reasons = calculate_match_score(user_a, user_b)
    # Area (40) + Budget Overlap (25) + Date <=7d (20) + Lifestyle (15) = 100
    assert score == 100
    assert any("Shared preferred area" in r for r in reasons)
    assert any("Overlapping budget" in r for r in reasons)
    assert any("Move-in dates" in r for r in reasons)


def test_divergent_preferences_lower_score():
    today = date.today()
    user_a = RoommateProfile(
        preferred_areas=["Sector 22"],
        budget_min=8000,
        budget_max=10000,
        move_in_date=today,
        move_in_flexible=False,
        food_preference=FoodPreference.VEGETARIAN,
        sleep_schedule=SleepSchedule.EARLY_BIRD,
        smoking_preference=SmokingPreference.NO_SMOKING,
        has_pets=False,
        ok_with_pets=False,
    )
    user_b = RoommateProfile(
        preferred_areas=["Golf Course Ext"],
        budget_min=30000,
        budget_max=45000,
        move_in_date=today + timedelta(days=90),
        move_in_flexible=False,
        food_preference=FoodPreference.NON_VEGETARIAN,
        sleep_schedule=SleepSchedule.NIGHT_OWL,
        smoking_preference=SmokingPreference.OK_WITH_SMOKING,
        has_pets=True,
        ok_with_pets=True,
    )

    score, reasons = calculate_match_score(user_a, user_b)
    assert score < 30


def test_flexible_move_in_handling():
    user_a = RoommateProfile(
        preferred_areas=["Cyber City"],
        budget_min=15000,
        budget_max=20000,
        move_in_flexible=True,
    )
    user_b = RoommateProfile(
        preferred_areas=["Cyber City"],
        budget_min=15000,
        budget_max=20000,
        move_in_flexible=False,
    )

    score, reasons = calculate_match_score(user_a, user_b)
    assert score >= 75
    assert any("Flexible move-in" in r for r in reasons)
