import { createStore } from "vuex"
// import tasks from "./modules/tasks"


const store = createStore({
    state: {
        tasks: [],
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
        ADD_TASK(state, task) {
            state.tasks.unshift(task)
        },
        UPDATE_TASK(state, {index, task}) {
            state.tasks[index] = task
        },
        DELETE_TASK(state, index) {
            state.tasks.splice(index, 1)
        },
    },
    actions: {
        loadTasks({ commit }) {
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]') 
            commit('SET_TASKS', tasks)
        },
        saveTasks({ state }) {
            localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },
        addTask({ commit }, task) {
            commit('ADD_TASK', task)
        },
        updateTask({ commit }, {index, task}) {
            commit('UPDATE_TASK', {index, task})
        },
        deleteTask({ commit }, index) {
            commit('DELETE_TASK', index)
        },
    }
})

export default store