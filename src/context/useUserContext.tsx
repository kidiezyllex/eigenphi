"use client"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

import { clearToken, setTokenToLocalStorage } from "@/helper/tokenStorage"
import { useProfile } from "@/hooks/authentication"
import { IProfileResponse } from "@/interface/response/authentication"
import { QueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

const queryClient = new QueryClient()

type UserContextType = {
  user: null | Record<string, any>
  profile: IProfileResponse | null
  loginUser: (userInfo: any, token: string) => void
  logoutUser: () => void
  fetchUserProfile: () => Promise<void>
  isLoadingProfile: boolean
}

const UserContext = createContext<UserContextType | null>(null)

const setCookie = (name: string, value: string, days = 30) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { profileData, refetch: refetchProfile, isLoading: isProfileLoading } = useProfile()
  const [user, setUser] = useState<null | Record<string, any>>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      return storedUser ? JSON.parse(storedUser) : null
    }
    return null
  })
  const [profile, setProfile] = useState<IProfileResponse | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false)

  const loginUser = (userInfo: any, token: string) => {
    setUser(userInfo)
    setTokenToLocalStorage(token)
    setCookie("accessToken", token)
    // Fetch profile after login
    fetchUserProfile()
  }

  const fetchUserProfile = async () => {
    try {
      setIsLoadingProfile(true)
      await refetchProfile()
      if (typeof window !== "undefined" && profileData) {
        localStorage.setItem("userProfile", JSON.stringify(profileData))
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // Load profile from localStorage on initial render
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("userProfile")
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile))
      }
    }
  }, [])

  // Update profile state when profileData changes
  useEffect(() => {
    if (profileData) {
      setProfile(profileData)
    }
  }, [profileData])

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
      } else {
        localStorage.removeItem("user")
      }
    }
  }, [user])

  const logoutUser = () => {
    clearToken()
    setUser(null)
    setProfile(null)
    // Clear profile from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("userProfile")
    }
    // Also clear the cookie
    deleteCookie("accessToken")
    router.push("/sign-in")
    queryClient.clear()
  }

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loginUser,
        logoutUser,
        fetchUserProfile,
        isLoadingProfile: isProfileLoading || isLoadingProfile
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

