from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from utils.data_loader import get_rdci_by_year, get_population_by_year_region
import pandas as pd
from pathlib import Path

router = APIRouter()

@router.get("/rdci")
def get_rdci(year: int = Query(..., description="연도")):
    try:
        if year < 2000 or year > 2024:
            raise HTTPException(status_code=400, detail="지원하지 않는 연도입니다 (2000~2024)")
        result = get_rdci_by_year(year)
        if not result:
            raise HTTPException(status_code=404, detail="해당 연도 데이터 없음")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/population")
def get_population(year: int = Query(...), region: Optional[str] = Query(None)):
    try:
        result = get_population_by_year_region(year, region)
        if not result:
            raise HTTPException(status_code=404, detail="해당 연도/지역 데이터 없음")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/rdci/available-years")
def get_rdci_available_years():
    BASE = Path(__file__).parent.parent.parent.parent / 'data'
    beds_df = pd.read_json(BASE / 'healthcare/public_healthcare_beds_statistics_long.json')
    years = sorted(int(y) for y in beds_df['year'].unique())
    return {"years": years} 