
import { useAppStore } from "./app"
import { useCounterStore } from "./counter"
import { useThemeStore } from "./theme"
import { useUserStore } from "./user"

export default function useStore() {
    return {
        app: useAppStore(),
        counter: useCounterStore(),
        user: useUserStore(),
        theme: useThemeStore()
    }
}