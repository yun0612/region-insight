# 📝 지역 불균형 대시보드 설계 요약 (2024)

## 1. 목적 및 전체 UI/데이터 흐름

-   대한민국 17개 시도별 인구, 교육, 의료, 경제, 인구 이동 등 주요 지표의 불균형을 시각적으로 분석
-   정적 JSON → FastAPI API → React(axios) → Highcharts 렌더링

## 2. 폴더/파일 구조 (SOLID, 모듈화 설계)

```
region-insight/
├── backend/app/
│   ├── main.py                # FastAPI 엔트리포인트
│   ├── api/                   # 분야별 라우트
│   └── utils/data_loader.py   # JSON 데이터 로딩/전처리
├── frontend/src/
│   ├── components/Section*.tsx
│   ├── hooks/useApi.ts
│   ├── utils/api.ts, chartUtils.ts
│   └── App.tsx
└── data/ (json)
```

## 3. 섹션별 차트/데이터/Highcharts 적용

-   **Section 0**: Choropleth (종합지표 지도, Highcharts Maps)
-   **Section 1~4**: Bar/Line/Stacked (분야별 격차)
-   **Section 5**: Sankey (인구 이동, Highcharts Sankey)
-   모든 차트는 detailed_sections.md 기준 툴팁/범례/색상/옵션 일관 적용

## 4. API 설계 예시 (FastAPI)

-   /api/region/rdci?year=2024
-   /api/region/population?year=2024&region=서울특별시
-   /api/education/statistics?year=2024
-   /api/healthcare/beds?year=2023
-   /api/economy/employment?year=2024
-   /api/migration/flow?year=2024

## 5. 프론트엔드 컴포넌트/데이터 흐름

-   axios 기반 API 호출 (try/catch, 로딩/에러 처리)
-   컴포넌트별 Skeleton/CircularProgress 적용
-   Highcharts: styledMode, 한글 폰트, 반응형 옵션

## 6. 문서화/작업 규칙

-   /docs/plan.md: 설계 요약
-   /docs/api-spec.md: API 명세
-   /docs/dev-log.md: 주요 변경사항 기록
-   커밋 전 포맷터 적용, 커밋 여부 사용자 확인

## 7. 구현 단계 제안

1. 설계 요약 문서화 (본 내용)
2. 백엔드(main.py, api/, utils/) 구현
3. 프론트엔드(App.tsx, hooks, utils, Section 컴포넌트) 구현
4. Highcharts 차트 옵션/스타일 적용
5. API/컴포넌트 연결 및 UI/UX 마감
6. 문서화/테스트/최종 검증
