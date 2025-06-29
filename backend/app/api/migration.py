from fastapi import APIRouter, Query, HTTPException
from utils.data_loader import get_migration_flow_by_year

router = APIRouter()

@router.get("/flow")
def get_migration_flow(year: int = Query(...)):
    try:
        result = get_migration_flow_by_year(year)
        if not result:
            raise HTTPException(status_code=404, detail="해당 연도 데이터 없음")
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 