import React, { useMemo } from "react";
import { useApi } from "../hooks/useApi";
import CircularProgress from "@mui/material/CircularProgress";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

/**
 * 섹션2: 시도별 고용(경제) 현황 차트 (15세 이상 인구 + 고용률)
 * - 막대: 15세 이상 인구 수, 라인: 고용률(%)
 */
function Section2Economy({ year }: { year: number }) {
    // 경제 데이터 API 호출
    const { data, loading, error } = useApi<any[]>(
        "/api/economy/employment",
        { year },
        [year]
    );

    // 차트용 데이터 가공
    const chartData = useMemo(() => {
        if (!data)
            return { categories: [], population: [], employmentRate: [] };
        // 시도명 오름차순 정렬
        const sorted = [...data].sort((a, b) =>
            a.region.localeCompare(b.region, "ko")
        );
        const population = sorted.map((row) => row.population_15_over);
        const employmentRate = sorted.map((row) => row.employment_rate_15_64);
        return {
            categories: sorted.map((row) => row.region),
            population,
            employmentRate,
            populationMax: Math.ceil(Math.max(...population) / 1000) * 1000,
        };
    }, [data]);

    // Highcharts 옵션
    const options = useMemo(
        () => ({
            chart: { height: 400 },
            title: { text: "" },
            xAxis: {
                categories: chartData.categories,
                title: { text: "시도" },
                labels: { style: { fontSize: "13px" } },
            },
            yAxis: [
                {
                    title: { text: "15세 이상 인구 수(천명)" },
                    labels: {
                        formatter: function (this: any) {
                            return (
                                (this.value / 1000).toLocaleString() + "천명"
                            );
                        },
                    },
                    min: 0,
                    max: chartData.populationMax,
                },
                {
                    title: { text: "고용률(%)" },
                    opposite: true,
                    min: 0,
                    max: 100,
                    labels: {
                        formatter: function (this: any) {
                            return this.value + "%";
                        },
                    },
                },
            ],
            tooltip: {
                shared: true,
                formatter: function (this: any) {
                    const idx = this.points?.[0]?.point?.index ?? this.x;
                    const region = chartData.categories[idx];
                    const pop = (
                        chartData.population[idx] / 1000
                    ).toLocaleString();
                    const rate = chartData.employmentRate[idx];
                    return `<b>${region}</b><br/>15세 이상 인구: <b>${pop}천명</b><br/>고용률: <b>${rate}%</b>`;
                },
            },
            series: [
                {
                    type: "column",
                    name: "15세 이상 인구 수",
                    data: chartData.population,
                    yAxis: 0,
                    dataLabels: {
                        enabled: true,
                        formatter: function (this: any) {
                            const idx = this.point.index;
                            return chartData.employmentRate[idx] + "%";
                        },
                        style: { fontSize: "11px" },
                    },
                },
                {
                    type: "spline",
                    name: "고용률(%)",
                    data: chartData.employmentRate,
                    yAxis: 1,
                    marker: { enabled: true },
                    dataLabels: {
                        enabled: false,
                    },
                },
            ],
            legend: { enabled: true },
            credits: { enabled: false },
        }),
        [chartData]
    );

    if (loading) return <CircularProgress />;
    if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    if (!data) return null;

    return (
        <div style={{ marginTop: 40 }}>
            <h2>{year}년 시도별 고용 현황</h2>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}

export default Section2Economy;
