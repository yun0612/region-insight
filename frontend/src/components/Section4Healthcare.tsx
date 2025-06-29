import React, { useMemo } from "react";
import { useApi } from "../hooks/useApi";
import CircularProgress from "@mui/material/CircularProgress";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

/**
 * 섹션4: 시도별 공공의료 현황 차트 (병상 수, 기관 수 등)
 * - 시도별 병상 수(천 단위) + 기관 수(개수) 이중축 막대그래프 시각화
 */
function Section4Healthcare({ year }: { year: number }) {
    // 의료 데이터 API 호출
    const { data, loading, error } = useApi<any[]>(
        "/api/healthcare/beds",
        { year },
        [year]
    );

    // 차트용 데이터 가공
    const chartData = useMemo(() => {
        if (!data)
            return {
                categories: [],
                beds: [],
                counts: [],
                bedsMax: 0,
                countsMax: 0,
            };
        // 시도명 오름차순 정렬
        const sorted = [...data].sort((a, b) =>
            a.region.localeCompare(b.region, "ko")
        );
        const beds = sorted.map((row) => row.total_beds);
        const counts = sorted.map((row) => row.total_count);
        return {
            categories: sorted.map((row) => row.region),
            beds,
            counts,
            bedsMax: Math.ceil(Math.max(...beds) / 1000) * 1000,
            countsMax: Math.ceil(Math.max(...counts) / 5) * 5,
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
            yAxis: [
                {
                    title: { text: "병상 수(천개)" },
                    min: 0,
                    max: chartData.bedsMax,
                    labels: {
                        formatter: function (this: any) {
                            return (
                                (this.value / 1000).toLocaleString() + "천개"
                            );
                        },
                    },
                },
                {
                    title: { text: "기관 수(개)" },
                    min: 0,
                    max: chartData.countsMax,
                    labels: {
                        formatter: function (this: any) {
                            return this.value.toLocaleString() + "개";
                        },
                    },
                    opposite: true,
                },
            ],
            tooltip: {
                shared: true,
                formatter: function (this: any) {
                    const idx = this.points?.[0]?.point?.index ?? this.x;
                    const region = chartData.categories[idx];
                    const beds = (chartData.beds[idx] / 1000).toLocaleString();
                    const counts = chartData.counts[idx]?.toLocaleString();
                    return `<b>${region}</b><br/>병상 수: <b>${beds}천개</b><br/>기관 수: <b>${counts}개</b>`;
                },
            },
            series: [
                {
                    name: "병상 수",
                    data: chartData.beds,
                    yAxis: 0,
                    dataLabels: {
                        enabled: true,
                        formatter: function (this: any) {
                            return (this.y / 1000).toLocaleString() + "천개";
                        },
                        style: { fontSize: "11px" },
                    },
                },
                {
                    name: "기관 수",
                    data: chartData.counts,
                    yAxis: 1,
                    dataLabels: {
                        enabled: true,
                        formatter: function (this: any) {
                            return this.y.toLocaleString() + "개";
                        },
                        style: { fontSize: "11px" },
                    },
                },
            ],
            legend: {
                enabled: true,
                align: "center",
                verticalAlign: "bottom",
                layout: "horizontal",
            },
            credits: { enabled: false },
        }),
        [chartData]
    );

    if (loading) return <CircularProgress />;
    if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    if (!data) return null;

    return (
        <div style={{ marginTop: 40 }}>
            <h2>{year}년 시도별 공공의료 현황</h2>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}

export default Section4Healthcare;
