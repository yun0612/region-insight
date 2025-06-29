import React, { useState } from "react";
import "./App.css";
import Section0Map from "./components/Section0Map";

function App() {
    // 연도 선택 상태 (기본값: 2023)
    const [year, setYear] = useState(2023);

    return (
        <div className="App">
            {/* region-insight 대시보드 */}
            {/* <Header /> */}
            {/* 연도 선택 UI (임시) */}
            <div style={{ margin: 16 }}>
                <label>연도 선택: </label>
                <input
                    type="number"
                    min={2015}
                    max={2023}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                />
            </div>
            {/* 섹션0: 지역 불균형 종합 지표 지도 */}
            <Section0Map year={year} />
            {/* <Section1PopulationBar /> */}
            {/* <Section2EmploymentLine /> */}
            {/* <Section3EducationBar /> */}
            {/* <Section4HealthcareStacked /> */}
            {/* <Section5MigrationSankey /> */}
            {/* <Section6PopulationDonut /> */}
        </div>
    );
}

export default App;
