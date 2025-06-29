# 🌐 지역 인사이트 (Region Insight)

## 1. 🧭 개요

**지역 인사이트**는 KOSIS의 시군구 단위 공공 데이터를 활용하여 **대한민국 지역 간 불균형을 시각적으로 분석**하는 웹 기반 대시보드입니다.  
주요 사용자는 정책 입안자, 연구자, 일반 시민이며, 직관적인 데이터 탐색과 시계열 분석 기능을 통해 **교육·의료·경제 자원의 격차**를 파악할 수 있도록 설계됩니다.

---

## 2. 🎯 목표

-   전국 지역 간 인구, 교육, 의료, 경제 격차를 시각화
-   사용자 중심의 대화형 UI로 정보 접근성 향상
-   데이터를 연도별/지역별로 추적 가능하도록 구성
-   지역 불균형 해소를 위한 데이터 기반 정책 참고자료 제공

---

## 3. 🔍 주요 기능 (Features)

### 1. 지역 개요 대시보드

-   전국 시군구를 지도 기반으로 시각화
-   Hover 시 해당 지역의 핵심 지표 툴팁 제공
    -   예: `총인구수 (total_population)`, `경제활동인구 (economically_active)`
-   지역별 종합 점수를 색상으로 시각화한 Choropleth Map 포함 (지역 불균형 종합 지표)

### 2. 지역 격차 분석 대시보드

-   연도별로 주요 지표의 지역 간 격차를 Bar Chart로 비교
-   사용자 선택에 따라 교육 / 의료 / 경제 분야별 지표 선택 가능
-   인구 감소 및 고령화 지표 기반의 소멸위험 시각화 제공

### 3. 테마별 분석 대시보드

-   주제별로 상세한 통계 비교 및 시각화 제공:
    -   **인구**: 성별, 세대수, 순이동자수
    -   **교육**: 유치원부터 대학원까지 교육 인프라
    -   **의료**: 공공의료기관 병상 수 및 기관 수
    -   **경제**: 고용률, 실업률, 경제활동참가율 등

### 4. 지역별 시계열 추이 분석

-   특정 지역 선택 시 연도별 지표 변화를 꺾은선 그래프로 시각화
-   여러 시리즈 비교 가능 (예: 전체 인구 / 남성 / 여성)

### 5. 데이터 처리 및 구조

-   모든 데이터는 Excel → JSON 변환 후 정적 파일로 제공
-   백엔드(FastAPI)에서 연도 및 지역 단위 JSON API 제공
-   프론트엔드는 동적으로 필요한 데이터만 로딩

---

## 🗂️ 데이터 개요

| 분야      | 항목                       | 데이터 기간 | 비고                         |
| --------- | -------------------------- | ----------- | ---------------------------- |
| 인구      | 인구수, 성별 인구, 세대수  | 2000~2024   | 시군구 단위                  |
| 인구 이동 | 이동자수, 순이동자수       | 2000~2024   | 전입/전출                    |
| 교육      | 유치원~대학원 관련 통계    | 2000~2024   | 학교 수, 학급 수, 학생 수 등 |
| 의료      | 공공의료기관 수 및 병상 수 | 2015~2023   | 연도 범위 주의               |
| 경제      | 경제활동참가율, 고용률 등  | 2000~2024   | 시도 단위                    |

※ 결측치는 null 처리, 연도는 Integer로 통일함

### 📄 엑셀 파일 및 출처 목록

1. `유치원_개황_20250626194102.xlsx` – [KOSIS: 유치원 통계](https://kosis.kr/statHtml/statHtml.do?orgId=334&tblId=DT_1963003_001&conn_path=I3)
2. `초등학교_개황_20250626194217.xlsx` – [KOSIS: 초등학교 통계](https://kosis.kr/statHtml/statHtml.do?orgId=334&tblId=DT_1963003_002&conn_path=I3)
3. `중학교_개황_20250626194345.xlsx` – [KOSIS: 중학교 통계](https://kosis.kr/statHtml/statHtml.do?orgId=334&tblId=DT_1963003_003&conn_path=I3)
4. `고등학교_개황_20250626194455.xlsx` – [KOSIS: 고등학교 통계](https://kosis.kr/statHtml/statHtml.do?orgId=334&tblId=DT_1963003_004&conn_path=I3)
5. `대학_개황_20250626194556.xlsx` – [KOSIS: 대학 통계](https://kosis.kr/statHtml/statHtml.do?orgId=334&tblId=DT_1963003_013&conn_path=I3)
6. `대학원_개황_20250626194645.xlsx` – [KOSIS: 대학원 통계](https://kosis.kr/statHtml/statHtml.do?orgId=334&tblId=DT_1963003_014&conn_path=I3)
7. `공공의료기관_기능별_기관_수_20250626194928.xlsx` – [KOSIS: 공공의료기관 기관수](https://kosis.kr/statHtml/statHtml.do?orgId=411&tblId=DT_411002_01&conn_path=I3)
8. `공공의료기관_기능별_병상_수_20250626195003.xlsx` – [KOSIS: 공공의료기관 병상수](https://kosis.kr/statHtml/statHtml.do?orgId=411&tblId=DT_411002_02&conn_path=I3)
9. `전출지_전입지_시도_별_이동자수_20250626193401.xlsx` – [KOSIS: 전입 전출 이동자수](https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1B26003_A01&conn_path=I3)
10. `행정구역_시군구_별__성별_인구수_20250626192009.xlsx` – [KOSIS: 인구수](https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1B040A3&conn_path=I3)
11. `행정구역_시군구_별_주민등록세대수_20250626192321.xlsx` – [KOSIS: 세대수](https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1B040B3&conn_path=I3)
12. `행정구역_시도_별_경제활동인구_20250626195127.xlsx` – [KOSIS: 경제활동인구](https://kosis.kr/statHtml/statHtml.do?orgId=101&tblId=DT_1DA7004S&conn_path=I3)

---

## 🛠️ 기술 스택 및 구성

| 영역       | 도구             |
| ---------- | ---------------- |
| 프론트엔드 | React + Cursor   |
| 백엔드     | Python + FastAPI |
| 시각화     | Highcharts       |
| 저장소     | GitHub           |

---

## 📁 프로젝트 구조

```
region-insight/
│
├── frontend/ # Cursor 기반 대시보드 UI
├── backend/ # FastAPI 서버 및 JSON API
├── data/ # 변환된 JSON 데이터 저장
│ ├── population/
│ ├── education/
│ ├── healthcare/
│ ├── economy/
│ └── migration/
└── docs/ # 기획서 및 문서
```

---

## 📝 특이사항

-   전체 페이지 구성은 [섹션별 구성 파일](detailed_sections.md)을 참고합니다.
-   화면에는 한글 항목명을 표시하고, 내부 처리 및 API에서는 영문 키를 사용합니다.
-   항목명 매핑은 [지표 한글 매핑표](label_map.csv)를 통해 자동 변환됩니다.
-   마크다운 문서에 포함된 항목 설명은 [data_fields_desc 파일](data_fields_desc.md) 에서 사용 가능
-   실시간 데이터 갱신은 지원하지 않음 (정적 JSON 기반)

---

## ✅ 향후 발전 방향

-   AI 기반 유사 지역 클러스터링
-   커스텀 필터 저장 및 사용자 개인화
-   모바일 최적화 UI 제공
-   대시보드 내 공유/다운로드 기능 추가
