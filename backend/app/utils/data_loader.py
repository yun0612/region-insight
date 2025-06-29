import pandas as pd
from pathlib import Path
from typing import List, Dict
import json

def load_json_data(filepath: str) -> pd.DataFrame:
    """지정 경로의 JSON 파일을 DataFrame으로 로드"""
    path = Path(filepath)
    if not path.exists():
        raise FileNotFoundError(f"파일 없음: {filepath}")
    return pd.read_json(filepath)

# RDCI 계산 함수

def get_rdci_by_year(year: int) -> List[Dict]:
    """
    detailed_sections.md의 RDCI 공식에 따라, 해당 연도 시도별 RDCI 및 주요 지표 반환
    반환: [ {region, rdci, total_population, students_total, schools, total_beds, total_count, employment_rate_15_64, net_moved, ...} ]
    """
    # 파일 경로
    BASE = Path(__file__).parent.parent.parent.parent / 'data'
    # 인구
    pop_df = pd.read_json(BASE / 'population/population_by_region_gender_long.json')
    # 교육(고등학교, 대학)
    hs_df = pd.read_json(BASE / 'education/high_school_statistics_long.json')
    univ_df = pd.read_json(BASE / 'education/university_statistics_long.json')
    # 의료
    beds_df = pd.read_json(BASE / 'healthcare/public_healthcare_beds_statistics_long.json')
    hc_df = pd.read_json(BASE / 'healthcare/public_healthcare_statistics_long.json')
    # 경제
    econ_df = pd.read_json(BASE / 'economy/economically_active_population_long.json')
    # 이동
    mig_df = pd.read_json(BASE / 'migration/migration_by_city_long.json')

    # 1. 총인구
    pop = pop_df[(pop_df['year'] == year) & (pop_df['region'] != '전국') & (pop_df['item'] == 'total_population')]
    pop = pop[['region', 'value']].rename(columns={'value': 'total_population'})

    # 2. 학생수/학교수(고등학교+대학)
    hs = hs_df[(hs_df['year'] == year) & (hs_df['region'] != '전국')]
    univ = univ_df[(univ_df['year'] == year) & (univ_df['region'] != '전국')]
    # 고등학교
    hs_students = hs[hs['item'] == 'students_total'].groupby('region')['value'].sum()
    hs_schools = hs[hs['item'] == 'schools'].groupby('region')['value'].sum()
    # 대학
    univ_students = univ[univ['item'] == 'students_total'].groupby('region')['value'].sum()
    univ_schools = univ[univ['item'] == 'schools'].groupby('region')['value'].sum()
    # 합산
    students = hs_students.add(univ_students, fill_value=0)
    schools = hs_schools.add(univ_schools, fill_value=0)
    edu = pd.DataFrame({'region': students.index, 'students_total': students.values, 'schools': schools.values})

    # 3. 의료기관당 병상수
    beds = beds_df[(beds_df['year'] == year) & (beds_df['region'] != '전국')]
    hc = hc_df[(hc_df['year'] == year) & (hc_df['region'] != '전국')]
    beds_sum = beds[beds['item'] == 'total_beds'].groupby('region')['value'].sum()
    count_sum = hc[hc['item'] == 'total_count'].groupby('region')['value'].sum()
    healthcare = pd.DataFrame({'region': beds_sum.index, 'total_beds': beds_sum.values, 'total_count': count_sum.values})

    # 4. 고용률(15~64)
    emp = econ_df[(econ_df['year'] == year) & (econ_df['region'] != '전국') & (econ_df['item'] == 'employment_rate_15_64')]
    emp = emp[['region', 'value']].rename(columns={'value': 'employment_rate_15_64'})

    # 5. 순이동자수(절대값)
    mig = mig_df[(mig_df['year'] == year) & (mig_df['item'] == 'moved') & (mig_df['from'] != '전국') & (mig_df['to'] != '전국')]
    net_moved = mig.groupby('to')['value'].sum() - mig.groupby('from')['value'].sum()
    net_moved = net_moved.abs().reset_index().rename(columns={'to': 'region', 0: 'net_moved'})
    net_moved.columns = ['region', 'net_moved']

    # 데이터 병합
    df = pop.merge(edu, on='region', how='inner')
    df = df.merge(healthcare, on='region', how='inner')
    df = df.merge(emp, on='region', how='inner')
    df = df.merge(net_moved, on='region', how='inner')

    # 결측치 제거
    df = df.dropna()

    # 정규화 함수
    def normalize(series):
        return (series - series.min()) / (series.max() - series.min())

    # 정규화
    df['norm_population'] = normalize(df['total_population'])
    df['norm_education'] = normalize(df['students_total'] / df['schools'])
    df['norm_healthcare'] = normalize(df['total_beds'] / df['total_count'])
    df['norm_employment'] = normalize(df['employment_rate_15_64'])
    df['norm_mobility'] = normalize(df['net_moved'].abs())

    # RDCI 계산
    df['rdci'] = (
        df['norm_population']   * 0.20 +
        df['norm_education']    * 0.25 +
        df['norm_healthcare']   * 0.25 +
        df['norm_employment']   * 0.20 +
        df['norm_mobility']     * 0.10
    ) * 100

    # 반환: 주요 지표 + RDCI
    result = df[['region', 'rdci', 'total_population', 'students_total', 'schools', 'total_beds', 'total_count', 'employment_rate_15_64', 'net_moved']]
    return result.to_dict(orient='records')

def get_population_by_year_region(year: int, region: str = None):
    """
    year, region(옵션)에 해당하는 total_population, male_population, female_population 반환
    region이 None이면 전체 시도별 리스트 반환
    """
    BASE = Path(__file__).parent.parent.parent.parent / 'data'
    pop_df = pd.read_json(BASE / 'population/population_by_region_gender_long.json')
    df = pop_df[(pop_df['year'] == year) & (pop_df['region'] != '전국')]
    # 피벗: region, item -> value
    pivot = df.pivot_table(index='region', columns='item', values='value', aggfunc='sum').reset_index()
    if region:
        row = pivot[pivot['region'] == region]
        if row.empty:
            return None
        return row.to_dict(orient='records')[0]
    else:
        return pivot.to_dict(orient='records')

def get_education_statistics_by_year_region(year: int, region: str = None):
    """
    year, region(옵션)에 해당하는 고등학교+대학 students_total, schools 등 주요 지표 반환
    region이 None이면 전체 시도별 리스트 반환
    """
    BASE = Path(__file__).parent.parent.parent.parent / 'data'
    hs_df = pd.read_json(BASE / 'education/high_school_statistics_long.json')
    univ_df = pd.read_json(BASE / 'education/university_statistics_long.json')
    # 고등학교
    hs = hs_df[(hs_df['year'] == year) & (hs_df['region'] != '전국')]
    hs_students = hs[hs['item'] == 'students_total'].groupby('region')['value'].sum()
    hs_schools = hs[hs['item'] == 'schools'].groupby('region')['value'].sum()
    # 대학
    univ = univ_df[(univ_df['year'] == year) & (univ_df['region'] != '전국')]
    univ_students = univ[univ['item'] == 'students_total'].groupby('region')['value'].sum()
    univ_schools = univ[univ['item'] == 'schools'].groupby('region')['value'].sum()
    # 합산
    students = hs_students.add(univ_students, fill_value=0)
    schools = hs_schools.add(univ_schools, fill_value=0)
    edu = pd.DataFrame({'region': students.index, 'students_total': students.values, 'schools': schools.values})
    if region:
        row = edu[edu['region'] == region]
        if row.empty:
            return None
        return row.to_dict(orient='records')[0]
    else:
        return edu.to_dict(orient='records')

def get_healthcare_beds_by_year_region(year: int, region: str = None):
    """
    year, region(옵션)에 해당하는 total_beds, total_count 등 주요 지표 반환
    region이 None이면 전체 시도별 리스트 반환
    """
    BASE = Path(__file__).parent.parent.parent.parent / 'data'
    beds_df = pd.read_json(BASE / 'healthcare/public_healthcare_beds_statistics_long.json')
    hc_df = pd.read_json(BASE / 'healthcare/public_healthcare_statistics_long.json')
    # 병상
    beds = beds_df[(beds_df['year'] == year) & (beds_df['region'] != '전국')]
    beds_sum = beds[beds['item'] == 'total_beds'].groupby('region')['value'].sum()
    # 기관
    hc = hc_df[(hc_df['year'] == year) & (hc_df['region'] != '전국')]
    count_sum = hc[hc['item'] == 'total_count'].groupby('region')['value'].sum()
    df = pd.DataFrame({'region': beds_sum.index, 'total_beds': beds_sum.values, 'total_count': count_sum.values})
    if region:
        row = df[df['region'] == region]
        if row.empty:
            return None
        return row.to_dict(orient='records')[0]
    else:
        return df.to_dict(orient='records')

def get_economy_employment_by_year_region(year: int, region: str = None):
    """
    year, region(옵션)에 해당하는 employment_rate_15_64 등 주요 지표 반환
    region이 None이면 전체 시도별 리스트 반환
    """
    BASE = Path(__file__).parent.parent.parent.parent / 'data'
    econ_df = pd.read_json(BASE / 'economy/economically_active_population_long.json')
    df = econ_df[(econ_df['year'] == year) & (econ_df['region'] != '전국')]
    # 피벗: region, item -> value
    pivot = df.pivot_table(index='region', columns='item', values='value', aggfunc='sum').reset_index()
    if region:
        row = pivot[pivot['region'] == region]
        if row.empty:
            return None
        return row.to_dict(orient='records')[0]
    else:
        return pivot.to_dict(orient='records')

def get_migration_flow_by_year(year: int):
    """
    year에 해당하는 from, to, moved 등 시도 간 이동 데이터 반환 (전국→시도, 시도→전국 제외)
    """
    BASE = Path(__file__).parent.parent.parent.parent / 'data'
    mig_df = pd.read_json(BASE / 'migration/migration_by_city_long.json')
    df = mig_df[(mig_df['year'] == year) & (mig_df['item'] == 'moved') & (mig_df['from'] != '전국') & (mig_df['to'] != '전국')]
    # 필요한 컬럼만 반환
    return df[['from', 'to', 'value']].rename(columns={'value': 'moved'}).to_dict(orient='records')

# TODO: 각종 전처리/정규화 함수 추가 예정 