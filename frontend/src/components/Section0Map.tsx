import React, { useMemo, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
// 대한민국 지도 geojson
// @ts-ignore
import mapDataKorea from "@highcharts/map-collection/countries/kr/kr-all.geo.json";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * 섹션0: 지역 불균형 종합 지표 지도 (Choropleth)
 * - Highcharts Maps로 RDCI 데이터 시각화
 */
function Section0Map({ year }: { year: number }) {
    // RDCI 데이터 API 호출
    const { data, loading, error } = useApi<any[]>(
        "/api/region/rdci",
        { year },
        [year]
    );

    // geojson에서 name → hc-key 매핑 테이블 생성
    const nameToKey: Record<string, string> = useMemo(() => {
        const map: Record<string, string> = {};
        mapDataKorea.features.forEach((f: any) => {
            map[f.properties.name] = f.properties["hc-key"];
        });
        return map;
    }, []);

    // API region명과 geojson name이 다를 경우 변환 테이블
    const regionNameMap: Record<string, string> = {
        서울특별시: "Seoul",
        부산광역시: "Busan",
        대구광역시: "Daegu",
        인천광역시: "Incheon",
        광주광역시: "Gwangju",
        대전광역시: "Daejeon",
        울산광역시: "Ulsan",
        세종특별자치시: "Sejong",
        경기도: "Gyeonggi",
        강원특별자치도: "Gangwon",
        충청북도: "North Chungcheong",
        충청남도: "South Chungcheong",
        전북특별자치도: "North Jeolla",
        전라남도: "South Jeolla",
        경상북도: "North Gyeongsang",
        경상남도: "South Gyeongsang",
        제주특별자치도: "Jeju",
    };

    // 지도에 매핑할 데이터 준비
    const mapSeriesData = useMemo(() => {
        if (!data) return [];
        return data.map((row) => {
            // region명 변환(필요시)
            const geoName = regionNameMap[row.region] || row.region;
            return {
                "hc-key": nameToKey[geoName],
                value: row.rdci,
                region: row.region,
                total_population: row.total_population,
                employment_rate_15_64: row.employment_rate_15_64,
                students_total: row.students_total,
                total_beds: row.total_beds,
                net_moved: row.net_moved,
            };
        });
    }, [data, nameToKey]);

    // Highcharts 옵션
    const options = useMemo(
        () => ({
            chart: {
                map: mapDataKorea,
                height: 700,
            },
            title: { text: "" },
            legend: {
                title: {
                    text: "RDCI(지역 불균형 종합 지표)",
                    style: { fontWeight: "bold" },
                },
                align: "center",
                verticalAlign: "bottom",
                floating: false,
                layout: "horizontal",
                x: 0,
                y: 0,
                valueDecimals: 0,
                backgroundColor: "rgba(255,255,255,0.8)",
            },
            colorAxis: {
                min: 0,
                max: 100,
                orientation: "horizontal",
                width: 500,
                height: 20,
                stops: [
                    [0, "#e74c3c"], // 0~50: 붉은색
                    [0.5, "#f39c12"], // 50~70: 주황
                    [0.7, "#b6e880"], // 70~90: 연두
                    [0.9, "#27ae60"], // 90~100: 녹색
                ],
            },
            tooltip: {
                useHTML: true,
                formatter: function (this: any) {
                    return `
          <b>${this.point.region}</b><br/>
          종합 점수(RDCI): <b>${this.point.value.toFixed(1)}</b><br/>
          총인구: ${this.point.total_population?.toLocaleString()}<br/>
          고용률(15-64): ${this.point.employment_rate_15_64}%<br/>
          학생 수: ${this.point.students_total?.toLocaleString()}<br/>
          공공 병상 수: ${this.point.total_beds?.toLocaleString()}<br/>
          순이동자수: ${this.point.net_moved?.toLocaleString()}
        `;
                },
            },
            series: [
                {
                    type: "map",
                    name: "RDCI",
                    data: mapSeriesData,
                    joinBy: "hc-key",
                    states: {
                        hover: { color: "#2980b9" },
                    },
                    dataLabels: {
                        enabled: true,
                        format: "{point.region}",
                        style: { fontSize: "11px" },
                    },
                },
            ],
            credits: { enabled: false },
        }),
        [mapSeriesData]
    );

    useEffect(() => {
        if (mapDataKorea && mapDataKorea.features) {
            console.log("=== geojson name/hc-key 목록 ===");
            mapDataKorea.features.forEach((f: any) => {
                console.log({
                    key: f.properties["hc-key"],
                    name: f.properties.name,
                });
            });
        } else {
            console.log("mapDataKorea 또는 features가 없습니다.");
        }
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
    if (!data) return null;

    return (
        <div style={{ minHeight: 500 }}>
            <h2>{year}년 시도별 지역 불균형 종합 지표 지도</h2>
            <HighchartsReact
                highcharts={Highcharts}
                constructorType="mapChart"
                options={options}
            />
        </div>
    );
}

export default Section0Map;
