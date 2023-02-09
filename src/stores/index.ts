
import { useAppStore } from "./app"
import { useCounterStore } from "./counter"

export default function userStore() {
    return {
        app: useAppStore(),
        counter: useCounterStore()
    }
}