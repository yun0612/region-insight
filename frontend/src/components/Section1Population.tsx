import React, { useMemo } from "react";
import { useApi } from "../hooks/useApi";
import CircularProgress from "@mui/material/CircularProgress";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

/**
 * 섹션1: 시도별 인구 현황 차트 (총인구, 성별 등)
 * - 시도별 총인구 막대그래프 시각화
 */
function Section1Population({ year }: { year: number }) {
    // 인구 데이터 API 호출
    const { data, loading, error } = useApi<any[]>(
        "/api/region/population",
        { year },
        [year]
    );

    // 차트용 데이터 가공
    const chartData = useMemo(() => {
        if (!data) return { categories: [], series: [] };
        // 시도명 오름차순 정렬
        const sorted = [...data].sort((a, b) =>
            a.region.localeCompare(b.region, "ko")
        );
        return {
            categories: sorted.map((row) => row.region),
            series: [
                {
                    name: "총인구",
                    data: sorted.map((row) => row.total_population),
                },
            ],
        };
    }, [data]);

    // Highcharts 옵션
    const options = useMemo(
        () => ({
            chart: { type: "column", height: 400 },
            title: { text: "" },
            xAxis: {
                categories: chartData.categories,
                title: { text: "시도" },
                labels: { style: { fontSize: "13px" } },
            },
            yAxis: {
                min: 0,
                title: { text: "총인구(명)" },
                labels: {
                    formatter: function (this: any) {
                        return this.value.toLocaleString();
                    },
                },
            },
            tooltip: {
                formatter: function (this: any) {
                    // this.x는 인덱스, this.series.xAxis.categories에서 지역명 추출
                    const region =
                        this.series.xAxis.categories[this.point.index];
                    return `<b>${region}</b><br/>총인구: <b>${this.y.toLocaleString()}명</b>`;
                },
            },
            series: chartData.series,
            legend: { enabled: false },
            credits: { enabled: false },
            plotOptions: {
                column: {
                    colorByPoint: true,
                    dataLabels: {
                        enabled: true,
                        formatter: function (this: any) {
                            return this.y.toLocaleString();
                        },
                        style: { fontSize: "11px" },
                    },
                },
            },
        }),
        [chartData]
    );

    if (loading) return <CircularProgress />;
    if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    if (!data) return null;

    return (
        <div style={{ marginTop: 40 }}>
            <h2>{year}년 시도별 인구 현황</h2>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}

export default Section1Population;
