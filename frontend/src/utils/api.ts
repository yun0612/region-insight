import axios from "axios";

// axios 기본 인스턴스 설정
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000", // 백엔드 API 주소
    timeout: 10000, // 10초 타임아웃
});

/**
 * 공통 GET 요청 함수
 * @param url API 엔드포인트
 * @param params 쿼리 파라미터
 * @returns 응답 데이터
 */
export async function fetchApi<T>(url: string, params?: any): Promise<T> {
    try {
        const response = await api.get<T>(url, { params });
        return response.data;
    } catch (error) {
        // 에러는 상위에서 처리하도록 throw
        throw error;
    }
}

export default api;
