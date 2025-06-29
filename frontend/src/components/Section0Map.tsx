import React from "react";
import { useApi } from "../hooks/useApi";
// import HighchartsReact from 'highcharts-react-official';
// import Highcharts from 'highcharts/highmaps';
// import mapDataKorea from '@highcharts/map-collection/countries/kr/kr-all.geo.json';
import CircularProgress from "@mui/material/CircularProgress";

/**
 * 섹션0: 지역 불균형 종합 지표 지도 (Choropleth)
 * - Highcharts Maps 사용 예정
 * - 연도별 RDCI 데이터 시각화
 */
function Section0Map({ year }: { year: number }) {
    // RDCI 데이터 API 호출
    const { data, loading, error } = useApi<any[]>(
        "/api/region/rdci",
        { year },
        [year]
    );

    if (loading) return <CircularProgress />;
    if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    if (!data) return null;

    // TODO: Highcharts Maps로 Choropleth 구현
    return (
        <div style={{ minHeight: 400 }}>
            {/* 지역 불균형 종합 지표 지도 (Highcharts Maps) */}
            <h2>{year}년 시도별 지역 불균형 종합 지표 지도</h2>
            {/* <HighchartsReact
        highcharts={Highcharts}
        constructorType="mapChart"
        options={{ ... }}
      /> */}
            <pre style={{ fontSize: 12, color: "#888" }}>
                {/* 임시: 데이터 미리보기 */}
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}

export default Section0Map;
