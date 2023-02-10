
import { useAppStore } from "./app"
import { useCounterStore } from "./counter"
import { useUserStore } from "./user"

export default function useStore() {
    return {
        app: useAppStore(),
        counter: useCounterStore(),
        user: useUserStore()
    }
}