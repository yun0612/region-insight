# API 명세서 (Region Insight)

## 주요 엔드포인트

-   `/api/region/rdci` : 연도별 지역 불균형 종합지표(RDCI) 조회
-   `/api/region/rdci/available-years` : RDCI 데이터 지원 연도 목록
-   `/api/population/total` : 연도별 시도별 총인구 조회
-   `/api/economy/employment` : 연도별 시도별 고용/경제 데이터
-   `/api/education/school` : 연도별 시도별 교육(학생/학교수) 데이터
-   `/api/healthcare/public` : 연도별 시도별 공공의료 데이터
-   `/api/migration/flow` : 연도별 시도 간 인구이동 데이터

---

## 인구이동 API: 시도 간 인구 이동 데이터

-   **엔드포인트**: `/api/migration/flow`
-   **메서드**: GET
-   **파라미터**:
    -   `year` (int, 필수): 조회 연도 (예: 2023)
-   **응답 예시**:

```json
[
  { "from": "경기도", "to": "서울특별시", "moved": 227540 },
  { "from": "서울특별시", "to": "경기도", "moved": 312000 },
  { "from": "부산광역시", "to": "서울특별시", "moved": 18432 },
  ...
]
```

-   **필드 설명**:
    -   `from`: 출발 시도명(한글)
    -   `to`: 도착 시도명(한글)
    -   `moved`: 이동자 수(명, 정수)
-   **에러 처리**:
    -   파라미터 누락/형식 오류 시 400 반환
    -   해당 연도 데이터 없을 시 404 반환

---

## 기타

-   모든 API는 `/api/` prefix 사용, RESTful 규칙 준수
-   응답은 JSON, 한글 시도명 사용
-   상세 데이터 구조 및 예시는 `/docs/dataset-guide.md` 참고
