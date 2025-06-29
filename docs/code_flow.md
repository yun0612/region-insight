# 📘 Region Insight 프로젝트 개발 가이드

## 1. 📌 프로젝트 개요

-   **목적**: 대한민국의 지역별 **인구, 경제, 교육, 보건, 이동(이주)** 데이터를 시각화 및 분석하는 **웹 서비스** 개발
-   **구성**:
    -   **백엔드**: FastAPI(Python) 기반 REST API 서버 `backend/app/`
    -   **프론트엔드**: React(TypeScript) 기반 SPA `frontend/`
    -   **데이터**: 전처리된 JSON 및 원본 엑셀 파일 `data/`, `data_raw/`
    -   **문서화**: API 명세, 데이터 설명, 개발 기록 등 `docs/`

---

## 2. 🗂️ 폴더 및 파일 구조 (적용 대상: `code_flow.md`)

```
region-insight/
├── backend/
│   └── app/
│       ├── main.py            # FastAPI 앱 진입점
│       ├── api/               # API 라우터 폴더 (도메인별)
│       │   ├── population.py
│       │   ├── economy.py
│       │   └── ...
│       └── utils/
│           └── data_loader.py # JSON 데이터 로딩 유틸
├── frontend/
│   └── src/
│       ├── index.tsx          # 리액트 진입점
│       ├── App.tsx            # 전체 App 구성
│       ├── components/        # 섹션별 컴포넌트
│       │   ├── SectionMap.tsx
│       │   ├── SectionEconomy.tsx
│       │   └── ...
│       ├── hooks/
│       │   └── useApi.ts      # API 통신용 커스텀 훅
│       └── utils/
│           └── api.ts         # axios 설정 및 API 함수
├── data/                      # 전처리된 JSON 파일
├── data_raw/                  # 원본 엑셀 데이터
├── docs/                      # 문서화 디렉토리
│   ├── api-spec.md
│   ├── dataset-guide.md
│   ├── dev-log.md
│   └── plan.md
```

---

## 3. ⚙️ 백엔드 코드 흐름

### 3.1. 진입점: `backend/app/main.py`

-   FastAPI 인스턴스를 생성하고 도메인별 API 라우터 등록

```python
from fastapi import FastAPI
from .api import population, economy

app = FastAPI()

app.include_router(population.router, prefix="/api/population")
app.include_router(economy.router, prefix="/api/economy")
```

---

### 3.2. API 라우터: `backend/app/api/`

-   각 도메인(예: 경제, 인구)에 대응하는 API 파일로 구성
-   라우팅 규칙: `/api/기능명/세부기능`

```python
# 예시: economy.py
@router.get("/active-population")
def get_active_population():
    return load_json_data("economically_active_population.json")
```

---

### 3.3. 유틸리티: `backend/app/utils/data_loader.py`

```python
import json

def load_json_data(filename: str):
    with open(f"data/{filename}", encoding="utf-8") as f:
        return json.load(f)
```

---

## 4. 🎨 프론트엔드 코드 흐름

### 4.1. 진입점: `frontend/src/index.tsx`, `App.tsx`

```tsx
// App.tsx 예시
import SectionMap from "./components/SectionMap";
import SectionEconomy from "./components/SectionEconomy";

function App() {
    return (
        <>
            <SectionMap />
            <SectionEconomy />
        </>
    );
}
```

---

### 4.2. 컴포넌트 구조: `frontend/src/components/`

-   `Section*.tsx`: 지도, 인구, 경제, 교육, 보건, 이동 등
-   각 컴포넌트는 **단일 책임 원칙**을 따름

---

### 4.3. API 통신: `useApi.ts`, `api.ts`

```ts
// api.ts 예시
import axios from "axios";

export const api = axios.create({
    baseURL: "/api",
    timeout: 5000,
});

// useApi.ts 예시
export async function useEconomyData() {
    try {
        const res = await api.get("/economy/active-population");
        return res.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
```

---

## 5. 📚 데이터 및 문서화

-   `/data/`: 전처리된 JSON (API 직접 사용)
-   `/data_raw/`: 원본 엑셀 (수동 전처리 필요)

### 문서 구조

| 파일명             | 설명                      |
| ------------------ | ------------------------- |
| `api-spec.md`      | API 엔드포인트 명세       |
| `dataset-guide.md` | 데이터셋 설명 및 출처     |
| `dev-log.md`       | 주요 변경 기록            |
| `plan.md`          | UI 설계 및 전체 흐름 문서 |

---

## 6. 🚀 실행 및 개발 환경

### 백엔드 실행

```bash
conda activate region-insight
cd backend/app
uvicorn main:app --reload
```

### 프론트엔드 실행

```bash
cd frontend
npm install  # 최초 1회만 실행
npm start
```

---

## 7. 기타

### Q. 데이터 추가/수정은?

1. `/data_raw/`에 엑셀 추가
2. 전처리 후 `/data/`에 JSON 저장
3. API에서 해당 경로 지정

---

### Q. 새로운 API 추가는?

1. `backend/app/api/`에 새로운 `.py` 생성
2. `main.py`에 라우터 등록
3. `docs/api-spec.md` 문서화

---

### Q. 프론트에서 새로운 섹션 추가는?

1. `components/SectionNew.tsx` 생성
2. `App.tsx`에 추가
3. 필요 시 커스텀 훅 또는 유틸 함수 작성

---
