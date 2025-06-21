import { jwtDecode } from "jwt-decode";

type Payload = { exp?: number };

export function scheduleSessionExpiry(
    token: string,
    onExpire: () => void,
) {
    const { exp } = jwtDecode<Payload>(token);  // agora ok

    if (!exp) return;

    const ttl = exp * 1000 - Date.now();
    if (ttl <= 0) {
        onExpire();
    } else {
        setTimeout(onExpire, ttl);
    }
}
