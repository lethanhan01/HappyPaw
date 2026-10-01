import { useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initial
    } catch {
      return initial
    }
  })

  const setValue = (value: T) => {
    try {
      setStored(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(`Error saving ${key} to localStorage:`, err)
    }
  }

  return [stored, setValue]
}
