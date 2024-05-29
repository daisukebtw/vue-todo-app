const state = () => ({
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
})

// Getters
const getters = {
    tasksTotalCount: state => state.tasks.length,
    tasksTotalCount: state => state.tasks.filter(task => task.status).length,
    tasksTotalCount: state => state.tasks.filter(task => !task.status).length,
}

// Mutations
const mutations = {
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
}

// Actions
const actions = {
    loadTasks({ commit }) {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]') 
        commit('SET_TASKS', tasks)
    },
    saveTasks({ commit }, tasks) {
        commit('SET_TASKS', tasks)
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


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}