const TOKEN_KEY = 'jp_token'
const USER_KEY = 'jp_user'
const PHOTO_PREFIX = 'jp_user_photo:'
const PHOTO_EVENT = 'jp:profile-photo'

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function setUser(user: unknown) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getUser<T>(): T | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function clearUser() {
  localStorage.removeItem(USER_KEY)
}

export function clearAuthStorage() {
  clearToken()
  clearUser()
}

function photoKey(userId: number) {
  return `${PHOTO_PREFIX}${userId}`
}

export function setProfilePhoto(userId: number, dataUrl: string) {
  localStorage.setItem(photoKey(userId), dataUrl)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PHOTO_EVENT, { detail: { userId } }))
  }
}

export function getProfilePhoto(userId: number): string | null {
  return localStorage.getItem(photoKey(userId))
}

export function clearProfilePhoto(userId: number) {
  localStorage.removeItem(photoKey(userId))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PHOTO_EVENT, { detail: { userId } }))
  }
}

export function getProfilePhotoEventName() {
  return PHOTO_EVENT
}
