from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from utils.data_loader import get_economy_employment_by_year_region

router = APIRouter()

@router.get("/employment")
def get_economy_employment(year: int = Query(...), region: Optional[str] = Query(None)):
    try:
        result = get_economy_employment_by_year_region(year, region)
        if not result:
            raise HTTPException(status_code=404, detail="해당 연도/지역 데이터 없음")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 