import { CACHE_TOKEN } from "@/enums/cacheEnum";

export function getToken() {
    return localStorage.getItem(CACHE_TOKEN);
}