import React, { useMemo } from "react";
import { useApi } from "../hooks/useApi";
import CircularProgress from "@mui/material/CircularProgress";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

/**
 * 섹션3: 시도별 교육 현황 차트 (학생 수 등)
 * - 시도별 학생 수(고등학교+대학) 막대그래프 시각화
 */
function Section3Education({ year }: { year: number }) {
    // 교육 데이터 API 호출
    const { data, loading, error } = useApi<any[]>(
        "/api/education/statistics",
        { year },
        [year]
    );

    // 차트용 데이터 가공
    const chartData = useMemo(() => {
        if (!data)
            return {
                categories: [],
                students: [],
                schools: [],
                studentsMax: 0,
                schoolsMax: 0,
            };
        // 시도명 오름차순 정렬
        const sorted = [...data].sort((a, b) =>
            a.region.localeCompare(b.region, "ko")
        );
        const students = sorted.map((row) => row.students_total);
        const schools = sorted.map((row) => row.schools);
        return {
            categories: sorted.map((row) => row.region),
            students,
            schools,
            studentsMax: Math.ceil(Math.max(...students) / 1000) * 1000,
            schoolsMax: Math.ceil(Math.max(...schools) / 10) * 10,
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
                    title: { text: "학생 수(천명)" },
                    min: 0,
                    max: chartData.studentsMax,
                    labels: {
                        formatter: function (this: any) {
                            return (
                                (this.value / 1000).toLocaleString() + "천명"
                            );
                        },
                    },
                },
                {
                    title: { text: "학교 수(개)" },
                    min: 0,
                    max: chartData.schoolsMax,
                    labels: {
                        formatter: function (this: any) {
                            return this.value.toLocaleString() + "개";
                        },
                    },
                    opposite: true,
                },
            ],
            tooltip: {
                formatter: function (this: any) {
                    const idx = this.point.index;
                    const region = chartData.categories[idx];
                    const students = (
                        chartData.students[idx] / 1000
                    ).toLocaleString();
                    const schools = chartData.schools[idx]?.toLocaleString();
                    return `<b>${region}</b><br/>학생 수: <b>${students}천명</b><br/>학교 수: <b>${schools}개</b>`;
                },
            },
            series: [
                {
                    name: "학생 수",
                    data: chartData.students,
                    yAxis: 0,
                    dataLabels: {
                        enabled: true,
                        formatter: function (this: any) {
                            return (this.y / 1000).toLocaleString() + "천명";
                        },
                        style: { fontSize: "11px" },
                    },
                },
                {
                    name: "학교 수",
                    data: chartData.schools,
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
            <h2>{year}년 시도별 교육 현황</h2>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}

export default Section3Education;
