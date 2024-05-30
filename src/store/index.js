import { createStore } from "vuex"
import { 
    loadTasksFromFirestore, 
    addTaskToFirestore, 
    updateTaskInFirestore,
    deleteTaskFromFirestore, 
    syncTasksToFirestore,
} from "@/firebase/api"

import { auth } from "@/firebase/init"
import { signInAnonymously } from "firebase/auth"

const store = createStore({
    state: {
        tasks: [],
        localTasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
        online: false,
        loading: true,
        syncing: false,
        userId: null,
    },
    getters: {
        tasksTotalCount: state => state.tasks.length,
        tasksCompletedCount: state => state.tasks.filter(task => task.status).length,
        tasksPendingCount: state => state.tasks.filter(task => !task.status).length,
    },
    mutations: {
        SET_TASKS(state, tasks) {
            state.tasks = tasks
        },
        SET_TASKS_LOCAL(state, tasks) {
            state.localTasks = tasks
        },
        ADD_TASK(state, task) {
            state.tasks.unshift(task)
        },
        UPDATE_TASK(state, {index, task}) {
            state.tasks[index] = task
        },
        DELETE_TASK(state, index) {
            state.tasks.splice(index, 1)
        },
        SET_LOADING(state, status){
            state.loading = status
        },
        SET_SYNCING(state, status){
            state.syncing = status
        },
        SET_ONLINE(state, status){
            state.online = status
        },
        SET_USER(state, user){
            state.userId = user
        },
    },
    actions: {
        setLoading({ commit }, status) {
            commit('SET_LOADING', status)
        },
        updateOnlineStatus({ commit }, status) {
            commit('SET_ONLINE', status)
            localStorage.setItem('online', JSON.stringify(status))
        },
        async loadTasks({ commit, state }) {
            if(state.online){
                if(!auth.currentUser){
                    // Sign in anonymously
                    await signInAnonymously(auth)
                    commit('SET_USER', auth.currentUser.uid)
                }
                if (state.localTasks.length>0) {
                    commit('SET_SYNCING', true)
                    const status = await syncTasksToFirestore(state.localTasks, state.userId)
                    if (status) {
                        commit('SET_SYNCING', false)
                    }
                }
            try {
                const tasks = await loadTasksFromFirestore(state.userId)
                commit('SET_TASKS', tasks)
                commit('SET_TASKS_LOCAL', tasks)
            } catch (error) {
                console.error("Error during loading tasks from firestore!", error);
            }
            } else {
                const tasks = JSON.parse(localStorage.getItem('tasks') || '[]') 
                commit('SET_TASKS', tasks)
                commit('SET_TASKS_LOCAL', tasks)
            }
        },
        async addTask({ commit, state }, task) {
            if(state.online){
                try {
                    const newTask = await addTaskToFirestore(task)
                    commit('ADD_TASK', newTask)
                } catch (error) {
                    console.error("Error during adding task to firestore!", error)
                }
            } else {
                commit('ADD_TASK', task)
            }
        },
        async updateTask({ commit, state }, {index, task}) {
            if(state.online){
                try {
                    await updateTaskInFirestore(task.task_id, task)
                    commit('UPDATE_TASK', {index, task})
                } catch (error) {
                    console.error("Error during updating task in firestore!", error)
                }
            } else {
                commit('UPDATE_TASK', {index, task})
            }
        },
        async deleteTask({ commit, state }, {index, id}) {
            if(state.online){
                try {
                    await deleteTaskFromFirestore(id, state.userId)
                    commit('DELETE_TASK', index)
                } catch (error) {
                    console.error("Error during deleting task from firestore!", error)
                }
            } else {
                commit('DELETE_TASK', index)
            }
        },
        saveTasksLocal({ commit, state }) {
            localStorage.setItem('tasks', JSON.stringify(state.localTasks))
            commit('SET_TASKS_LOCAL', state.localTasks)
        },
    }
})

export default store