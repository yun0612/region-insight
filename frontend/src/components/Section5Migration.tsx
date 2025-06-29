import React, { useMemo, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import CircularProgress from "@mui/material/CircularProgress";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import "highcharts/modules/sankey";
import HighchartsBar from "highcharts";
import HighchartsReactBar from "highcharts-react-official";

/**
 * 섹션5: 시도 간 인구 이동 흐름 (Sankey Diagram)
 * - Highcharts Sankey로 시각화
 */
function Section5Migration({ year }: { year: number }) {
    // 인구이동 데이터 API 호출
    const { data, loading, error } = useApi<any[]>(
        "/api/migration/flow",
        { year },
        [year]
    );

    // 서울 중심 Sankey 데이터
    const sankeySeoul = useMemo(() => {
        if (!data) return [];
        return data
            .filter(
                (row) =>
                    row.from !== row.to &&
                    (row.from === "서울특별시" || row.to === "서울특별시")
            )
            .map((row) => [row.from, row.to, row.moved]);
    }, [data]);
    const totalSeoul = useMemo(() => {
        if (!data) return 1;
        return data
            .filter(
                (row) =>
                    row.from !== row.to &&
                    (row.from === "서울특별시" || row.to === "서울특별시")
            )
            .reduce((sum, row) => sum + row.moved, 0);
    }, [data]);

    // 경기도 중심 Sankey 데이터
    const sankeyGyeonggi = useMemo(() => {
        if (!data) return [];
        return data
            .filter(
                (row) =>
                    row.from !== row.to &&
                    (row.from === "경기도" || row.to === "경기도")
            )
            .map((row) => [row.from, row.to, row.moved]);
    }, [data]);
    const totalGyeonggi = useMemo(() => {
        if (!data) return 1;
        return data
            .filter(
                (row) =>
                    row.from !== row.to &&
                    (row.from === "경기도" || row.to === "경기도")
            )
            .reduce((sum, row) => sum + row.moved, 0);
    }, [data]);

    // 서울/경기도 중심 전입/전출 통합 Bar Chart 데이터 가공
    const seoulBarData = useMemo(() => {
        if (!data) return { categories: [], inData: [], outData: [] };
        const regions = Array.from(
            new Set(
                data.map((row) => row.from).concat(data.map((row) => row.to))
            )
        ).filter((r) => r !== "서울특별시");
        const inData = regions.map((region) => {
            const found = data.find(
                (row) => row.from === region && row.to === "서울특별시"
            );
            return found ? found.moved : 0; // 음수 제거
        });
        const outData = regions.map((region) => {
            const found = data.find(
                (row) => row.from === "서울특별시" && row.to === region
            );
            return found ? found.moved : 0;
        });
        return { categories: regions, inData, outData };
    }, [data]);

    const gyeonggiBarData = useMemo(() => {
        if (!data) return { categories: [], inData: [], outData: [] };
        const regions = Array.from(
            new Set(
                data.map((row) => row.from).concat(data.map((row) => row.to))
            )
        ).filter((r) => r !== "경기도");
        const inData = regions.map((region) => {
            const found = data.find(
                (row) => row.from === region && row.to === "경기도"
            );
            return found ? found.moved : 0;
        });
        const outData = regions.map((region) => {
            const found = data.find(
                (row) => row.from === "경기도" && row.to === region
            );
            return found ? found.moved : 0;
        });
        return { categories: regions, inData, outData };
    }, [data]);

    // 통합 Bar 차트 옵션 (서울)
    const optionsSeoulBar = useMemo(
        () => ({
            chart: { type: "bar", height: 700 },
            title: { text: `${year}년 서울특별시 중심 전입/전출 분석` },
            xAxis: {
                categories: seoulBarData.categories,
                title: { text: "타지역" },
            },
            yAxis: {
                min: 0,
                title: { text: "이동자 수(명)" },
                labels: {
                    formatter: function (
                        this: Highcharts.AxisLabelsFormatterContextObject
                    ): string {
                        return this.value ? this.value.toLocaleString() : "";
                    },
                },
            },
            tooltip: {
                shared: true,
                formatter: function (this: any): string {
                    const idx = this.points[0].point.index;
                    const regionName = seoulBarData.categories[idx] || this.x;
                    return `<b>${regionName}</b><br/>전입: ${this.points[0].y.toLocaleString()}명<br/>전출: ${this.points[1].y.toLocaleString()}명`;
                },
            },
            series: [
                {
                    name: "전입(타지역→서울)",
                    data: seoulBarData.inData,
                    color: "#43a047",
                },
                {
                    name: "전출(서울→타지역)",
                    data: seoulBarData.outData,
                    color: "#1976d2",
                },
            ],
            credits: { enabled: false },
        }),
        [seoulBarData, year]
    );

    // 통합 Bar 차트 옵션 (경기도)
    const optionsGyeonggiBar = useMemo(
        () => ({
            chart: { type: "bar", height: 700 },
            title: { text: `${year}년 경기도 중심 전입/전출 분석` },
            xAxis: {
                categories: gyeonggiBarData.categories,
                title: { text: "타지역" },
            },
            yAxis: {
                min: 0,
                title: { text: "이동자 수(명)" },
                labels: {
                    formatter: function (
                        this: Highcharts.AxisLabelsFormatterContextObject
                    ): string {
                        return this.value ? this.value.toLocaleString() : "";
                    },
                },
            },
            tooltip: {
                shared: true,
                formatter: function (this: any): string {
                    const idx = this.points[0].point.index;
                    const regionName =
                        gyeonggiBarData.categories[idx] || this.x;
                    return `<b>${regionName}</b><br/>전입: ${this.points[0].y.toLocaleString()}명<br/>전출: ${this.points[1].y.toLocaleString()}명`;
                },
            },
            series: [
                {
                    name: "전입(타지역→경기도)",
                    data: gyeonggiBarData.inData,
                    color: "#43a047",
                },
                {
                    name: "전출(경기도→타지역)",
                    data: gyeonggiBarData.outData,
                    color: "#1976d2",
                },
            ],
            credits: { enabled: false },
        }),
        [gyeonggiBarData, year]
    );

    useEffect(() => {
        if (data) {
            console.log(
                "서울특별시로 전입:",
                data.filter(
                    (row) => row.to === "서울특별시" && row.from !== row.to
                )
            );
            console.log(
                "경기도로 전입:",
                data.filter((row) => row.to === "경기도" && row.from !== row.to)
            );
        }
    }, [data]);

    if (loading) return <CircularProgress />;
    if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    if (!data) return null;

    return (
        <div style={{ marginTop: 40, overflowX: "auto", minWidth: 900 }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 32,
                    margin: "32px 0",
                }}
            >
                <div style={{ flex: 1 }}>
                    <HighchartsReactBar
                        highcharts={HighchartsBar}
                        options={optionsSeoulBar}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <HighchartsReactBar
                        highcharts={HighchartsBar}
                        options={optionsGyeonggiBar}
                    />
                </div>
            </div>
        </div>
    );
}

export default Section5Migration;
