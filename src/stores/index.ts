
import { useAppStore } from "./app"
import { useCompanyStore } from "./company"
import { useCounterStore } from "./counter"
import { useStaticRouterStore } from "./staticRouter"
import { useThemeStore } from "./theme"
import { useUserStore } from "./user"

export default function useStore() {
    return {
        app: useAppStore(),
        counter: useCounterStore(),
        user: useUserStore(),
        theme: useThemeStore(),
        staticRouter: useStaticRouterStore(),
        company: useCompanyStore()
    }
}