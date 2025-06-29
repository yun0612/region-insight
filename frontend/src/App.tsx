import React, { useState } from "react";
import "./App.css";
import Section0Map from "./components/Section0Map";
import Section1Population from "./components/Section1Population";
import Section2Economy from "./components/Section2Economy";

function App() {
    // 연도 선택 상태 (기본값: 2023)
    const [year, setYear] = useState(2023);
    const availableYears = [
        2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
    ];

    return (
        <div className="App">
            {/* region-insight 대시보드 */}
            {/* <Header /> */}
            {/* 연도 선택 UI */}
            <div style={{ margin: "24px 0" }}>
                <label htmlFor="year-select">연도 선택: </label>
                <select
                    id="year-select"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    style={{ fontSize: 16, padding: "4px 8px" }}
                >
                    {availableYears.map((y) => (
                        <option key={y} value={y}>
                            {y}년
                        </option>
                    ))}
                </select>
            </div>
            {/* 섹션0: 지역 불균형 종합 지표 지도 */}
            <Section0Map year={year} />
            {/* Section1: 인구 차트 */}
            <Section1Population year={year} />
            {/* Section2: 고용(경제) 차트 */}
            <Section2Economy year={year} />
            {/* <Section3EducationBar /> */}
            {/* <Section4HealthcareStacked /> */}
            {/* <Section5MigrationSankey /> */}
            {/* <Section6PopulationDonut /> */}
        </div>
    );
}

export default App;
