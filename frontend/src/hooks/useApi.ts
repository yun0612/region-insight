import { useState, useEffect } from "react";
import { fetchApi } from "../utils/api";

/**
 * API 데이터를 가져오는 커스텀 훅
 * @param url API 엔드포인트
 * @param params 쿼리 파라미터
 * @param deps 의존성 배열 (파라미터 변경 시 재호출)
 */
export function useApi<T>(url: string, params?: any, deps: any[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        fetchApi<T>(url, params)
            .then((res) => {
                if (isMounted) setData(res);
            })
            .catch((err) => {
                if (isMounted) setError(err);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { data, loading, error };
}
