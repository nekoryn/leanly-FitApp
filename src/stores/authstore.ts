import type { User } from '@/types/user'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        user: null as User | null,
        isAuthChecked: false,
    }), 
    
    actions: {
        setToken(token: string) {
            this.token = token
            localStorage.setItem('token', token)
            this.checkAuth()
        },

        logOut() {
            this.token = ''
            this.user = null
            localStorage.removeItem('token')
        },
        async checkAuth() {
            if (!this.token) {
                this.user = null
                this.isAuthChecked = true
                return
            } 

            try {
                const res = await fetch('https://leanlyapi.duckdns.org/api/profile', {
                    headers: { Authorization: `Bearer ${this.token}`}
                })

                if (!res.ok) {
                    throw new Error('Invalid token')
                }

                this.user = await res.json()
            } catch (err) {
                this.logOut()
            } finally {
                this.isAuthChecked = true
            }
        }
    },
})