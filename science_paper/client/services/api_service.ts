import { REJECT_TIMESTAMP_MS } from "../common/constants";


export async function getWebVitals(body: object) {
    return await request('/api/web-vitals', body);
}

async function request(url: string, body: object): Promise<any> {
    const controller = new AbortController();
    const signal = controller.signal;

    const timeout = window.setTimeout(controller.abort, REJECT_TIMESTAMP_MS);

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            signal,
        });
        return await res.json();
    } catch (e: unknown) {
        controller.abort();
        console.error(e);
    } finally {
        clearTimeout(timeout);
    };
}