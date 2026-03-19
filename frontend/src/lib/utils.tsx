import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combine les classes CSS avec tailwind-merge pour éviter les conflits de styles
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}