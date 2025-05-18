import { useEffect, useState } from "react"
import { type PostgrestSingleResponse } from "@supabase/supabase-js"

export function useSupabaseFetch<T>(fetcher: () => Promise<PostgrestSingleResponse<T>>) {
  const [state, setState] = useState<{
    data: T | null
    error: Error | null
    isLoading: boolean
  }>({
    data: null,
    error: null,
    isLoading: true
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await fetcher()

        if (error) {
          setState({ data: null, error, isLoading: false })
          return
        }

        setState({ data, error: null, isLoading: false })
      } catch (error) {
        setState({
          data: null,
          error: error instanceof Error ? error : new Error("Unknown error"),
          isLoading: false
        })
      }
    }

    fetchData()
  }, [fetcher])

  const setData = (updater: (prev: T | null) => T) => {
    setState((prev) => ({
      ...prev,
      data: updater(prev.data)
    }))
  }

  return { ...state, setData }
}
