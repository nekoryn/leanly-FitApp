import { defineStore } from 'pinia';


export const useRegisterStore = defineStore('register', {
    state: () => ({
        nickname: '',
        email: '',
        password: '',

        userWeight: '',
        userHeight: '',
        userAge: '',
        gender: '',

        activity: '',
        goal: '',
        goalWeight: '',
    })
})