import { useEffect, useState } from 'react'

type ToastItem = {
    id: string
    title?: string
    description?: string
    kind?: 'success' | 'error' | 'info'
    variant?: 'default' | 'destructive'
    durationMs?: number
}

type ToastState = {
    toasts: ToastItem[]
}

const listeners = new Set<(state: ToastState) => void>()
let memoryState: ToastState = { toasts: [] }

function emit(next: ToastState) {
    memoryState = next
    for (const listener of listeners) listener(memoryState)
}

function dismiss(id: string) {
    emit({ toasts: memoryState.toasts.filter((t) => t.id !== id) })
}

export function toast(input: Omit<ToastItem, 'id'>) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    emit({ toasts: [{ id, ...input }, ...memoryState.toasts].slice(0, 6) })
    window.setTimeout(() => dismiss(id), input.durationMs ?? 4500)
    return { id, dismiss: () => dismiss(id) }
}

export function useToast() {
    const [state, setState] = useState<ToastState>(memoryState)

    useEffect(() => {
        listeners.add(setState)
        return () => {
            listeners.delete(setState)
        }
    }, [])

    return {
        ...state,
        toast,
        dismiss,
    }
}
