<script>
    import Header from './Header.vue'
    import Footer from './Footer.vue'
    import moment from 'moment'

    import { mapState, mapGetters, mapActions } from 'vuex'

    export default {
        components: {
            Header,
            Footer,
        },
        data() {
            return {
                taskInput:'',
                showPending: true,
                showCompleted: true,
                showWarning: false,
                currentDateTime: moment(new Date()).format('MMMM DD, YYYY, h:mm:ss a'),
            }
        },
        watch:{
            tasks: {
                handler(newTasks) {
                    this.saveTasks(newTasks)                  
                },
                deep: true,
            },
            showWarning(isShowing){
                if(isShowing){
                    setTimeout(() => {
                        this.showWarning = false
                    }, 3000)
                }
            },
        },
        computed: {
            ...mapState({
                tasks: state => state.tasks
            }),
            ...mapGetters([
                'tasksTotalCount',
                'tasksCompletedCount',
                'tasksPendingCount',
            ])
        },
        methods: {
            ...mapActions(['loadTasks', 'saveTasks', 'addTask', 'updateTask', 'deleteTask']),
            updateDate(date){
                return moment(date).format('LLL')
            },
            updateCurrentDateTime(){
                this.currentDateTime = moment(new Date()).format('MMMM DD, YYYY, h:mm:ss a')
            },
            handleAddTask() {
                if(this.taskInput != '') {
                    const newTask = {
                        'id': this.tasks.length,
                        'task': this.taskInput,
                        'status': false,
                        'edit': false,
                        'created_at': new Date(),
                        'updated_at': new Date(),
                    }
                    this.addTask(newTask)
                    this.taskInput = ''
                    this.showWarning = false
                } else {
                    this.showWarning = true
                }
            },
            handleUpdateTask(index, item) {
                this.tasks[index].edit = false
                const task = {
                        'id': item.id,
                        'task': item.task,
                        'status': item.status,
                        'edit': false,
                        'updated_at': new Date(),
                    }
                this.updateTask(index, task)
            },
            handleTaskClick(index){
                this.tasks[index].updated_at = new Date()
            },
            handleEditClick(index){
                // this.hideUpdateButton(index)
            },
            hideUpdateButton(index){
                if(!this.tasks[index].edit){
                    setTimeout(() => {
                        this.tasks[index].edit = false
                    }, 5000)
                }
            },
        },
        mounted() {
            this.$refs.taskInput.focus()
            this.timer = setInterval(this.updateCurrentDateTime, 1000)
            this.loadTasks()
        },
        beforeDestroy() {
            clearInterval(this.timer)
        },
    }
</script>

<template>
    <Header />
    <Footer />
    <div class="flex flex-row items-start justify-start gap-4 w-[90%] md:w-[60%] lg:w-[40%] text-center">
        <div class="flex flex-col gap-4 w-full">
            <div class="w-full flex flex-col items-center justify-center">
                <span class="text-xs md:text-md">{{ currentDateTime }}</span>
                <span class="font-PoppinsBold text-sm md:text-xl">Welcome to My<span class="text-red">Todo</span> App. Have Nice Day &#128522;</span>
            </div>
            <div class="w-full h-auto p-2 lg:p-10 flex flex-row gap-2 lg:gap-10 items-center justify-center bg-dark border-2 border-light rounded-3xl shadow-md font-PoppinsBold">
                <p class="font-bold text-2xl md:text-3xl">
                    Todo Done <br>
                    <span class="font-Poppins font-thin text-lg md:text-xl text-red">keep it up</span>
                </p>
                <span class="bg-red w-20 h-20 md:w-32 md:h-32 p-2 flex items-center justify-center text-dark text-3xl md:text-4xl rounded-full">{{ tasksCompletedCount }}/{{ tasksTotalCount }}</span>
            </div>
            <span class="text-red text-center" v-if="showWarning">&#9888;&#65039; Write your task first. Then press enter or click Add button.</span>
            <div class="relative w-full">
                <input 
                    v-model="taskInput"
                    class="w-full bg-gray text-light font-Poppins p-4 pr-24 outline-none rounded-3xl"
                    type="text" 
                    name="task-input" 
                    id="task-input"
                    placeholder="Add Task Here"
                    ref="taskInput"
                    @keyup.enter="handleAddTask"
                />
                <button 
                    class="absolute top-1/2 -translate-y-1/2 right-3 bg-red hover:bg-opacity-50 transition-all duration-200 rounded-xl text-dark font-PoppinsBold p-1 pl-4 pr-4"
                    @click="handleAddTask"
                >
                    Add
                </button>
                <div class="absolute top-1/2 -translate-y-1/2 -right-24 hidden md:flex items-center">
                    <span>Enter</span>
                    <img class="w-8 h-8" src="/src/assets/icons/enter.png" alt="">
                </div>
            </div>
            <div v-if="true" class="tasks flex flex-col w-full h-[40vh] overflow-y-auto overflow-hidden">
                <!-- Pending tasks -->
                <div class="rounded-xl mr-2 bg-dark transition-all duration-500 tasks" v-if="true">
                    <div class="text-red flex flex-row items-end justify-start gap-2 w-full cursor-pointer p-1" @click="showPending=!showPending">
                        <img v-if="showPending" class="w-5 h-5 lg:w-6 lg:h-6" src="/src/assets/icons/down-red.png" alt="">
                        <img v-else class="w-5 h-5 lg:w-6 lg:h-6" src="/src/assets/icons/up-red.png" alt="">
                        <span class="font-PoppinsBold text-md lg:text-xl">
                            Todo
                        </span>
                        <span class="text-opacity-5"> {{ tasksPendingCount }} item{{tasksPendingCount>1?'s':''}}</span>
                    </div>
                    <div v-if="showPending" class="w-full h-[2px] bg-gray mb-2"></div>
                    <div v-if="showPending" v-for="(item, index) in tasks" :key="index" class="flex flex-row pl-2">
                        <div class="tasks relative flex flex-row flex-wrap items-start justify-start gap-4 w-full text-xl hover:bg-gray transition-all duration-200 rounded-xl p-4" v-if="!item.status">
                            <label 
                                class="hidden md:block cursor-pointer"
                                :for="'check'+index"
                            >
                                <img class="w-7 h-7" src="/src/assets/icons/circle.png" alt="">
                                <input 
                                    type="checkbox" 
                                    v-model="item.status" 
                                    :id="'check' + index" 
                                    class="cursor-pointer w-full" 
                                    @change="handleTaskClick(index)"
                                />
                            </label>
                            <div class="flex flex-col w-[100%] lg:w-[70%] break-words text-wrap text-start text-sm lg:text-xl">
                                <textarea
                                    v-if="item.edit"
                                    class="font-PoppinsBold bg-transparent outline-none w-full h-20"
                                    type="text"
                                    v-model="item.task"
                                    :ref="'task'+index"
                                />
                                <span v-else class="font-PoppinsBold">{{ item.task }}</span>
                                <div class="flex flex-col w-full">
                                    <span class="w-full break-words text-wrap text-sm opacity-70">
                                        Created on {{ updateDate(item.created_at) }}
                                    </span>
                                    <span class="w-full break-words text-wrap text-sm opacity-70">
                                        Updated on {{ updateDate(item.updated_at) }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex flex-row gap-2 ml-auto w-full md:w-auto">
                                <label 
                                    class="block md:hidden cursor-pointer mr-auto"
                                    :for="'check'+index"
                                >
                                    <img class="w-5 h-5" src="/src/assets/icons/circle.png" alt="">
                                    <input 
                                        type="checkbox" 
                                        v-model="item.status" 
                                        :id="'check' + index" 
                                        class="cursor-pointer w-full" 
                                        @change="handleTaskClick(index)"
                                    />
                                </label>
                                <input type="checkbox" name="edit" :id="'edit'+index" v-model="item.edit">
                                <label v-if="!item.edit" :for="'edit'+index">
                                    <img
                                        class="w-5 h-5 md:w-7 md:h-7 cursor-pointer" 
                                        src="/src/assets/icons/edit.png" 
                                        alt=""
                                        @click="handleEditClick(index)"  
                                    >
                                </label>
                                <button 
                                    v-else 
                                    class="bg-green text-dark text-sm p-1 pl-2 pr-2 font-PoppinsBold rounded-lg" 
                                    @click="handleUpdateTask(index, item)"
                                >Update</button>
                                <img 
                                    @click="deleteTask(index)" 
                                    class="w-5 h-5 md:w-7 md:h-7 cursor-pointer" 
                                    src="/src/assets/icons/delete.png" 
                                    alt=""
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Completed tasks -->
                <div class="flex flex-col rounded-xl mr-2 bg-dark transition-all duration-500 tasks" v-if="true">
                    <div 
                        class="text-green flex flex-row items-end justify-start gap-2 w-full cursor-pointer p-1" 
                        @click="showCompleted=!showCompleted"
                    >
                        <img v-if="showCompleted" class="w-5 h-5 lg:w-6 lg:h-6" src="/src/assets/icons/down-green.png" alt="">
                        <img v-else class="w-5 h-5 lg:w-6 lg:h-6" src="/src/assets/icons/up-green.png" alt="">
                        <span class="font-PoppinsBold text-md lg:text-xl">
                            Completed
                        </span>
                        <span class="text-opacity-50"> {{ tasksCompletedCount }} item{{tasksCompletedCount>1?'s':''}}</span>
                    </div>
                    <div v-if="showCompleted" class="w-full h-[2px] bg-gray mb-2"></div>
                    <div v-if="showCompleted" v-for="(item, index) in tasks" :key="index" class="flex flex-row">
                        <div 
                            class="tasks relative flex flex-row flex-wrap items-start justify-start gap-4 w-full text-xl hover:bg-gray transition-all duration-200 rounded-xl p-4" 
                            v-if="item.status"
                        >
                            <label
                                class="hidden md:block cursor-pointer"
                                :for="'check'+index"  
                            >
                                <img class="w-9 h-9" src="/src/assets/icons/tick.png" alt="">
                                <input type="checkbox" v-model="item.status" :id="'check' + index" class="cursor-pointer w-full" @change="handleTaskClick(index)"/>
                            </label>
                            <div class="w-[100%] lg:w-[70%] break-words text-wrap text-start text-sm lg:text-xl">
                                <textarea
                                    v-if="item.edit"
                                    class="font-PoppinsBold bg-transparent outline-none w-full h-20"
                                    type="text"
                                    v-model="item.task"
                                    :ref="'task'+index"
                                />
                                <span v-else class="line-through">{{ item.task }}</span>
                                <div class="flex flex-col w-full">
                                    <span class="w-96 break-words text-wrap text-sm opacity-70">Created on {{ updateDate(item.created_at) }}</span>
                                    <span class="w-96 break-words text-wrap text-sm opacity-70">Updated on {{ updateDate(item.updated_at) }}</span>
                                </div>
                            </div>
                            <div class="flex flex-row gap-2 ml-auto md:w-auto w-full">
                                <label
                                    class="md:hidden block cursor-pointer mr-auto"
                                    :for="'check'+index"  
                                >
                                    <img class="w-6 h-6 md:w-9 md:h-9" src="/src/assets/icons/tick.png" alt="">
                                    <input type="checkbox" v-model="item.status" :id="'check' + index" class="cursor-pointer w-full" @change="handleTaskClick(index)"/>
                                </label>
                                <input type="checkbox" name="edit" :id="'edit'+index" v-model="item.edit">
                                <label v-if="!item.edit" :for="'edit'+index">
                                    <img
                                        class="w-5 h-5 md:w-7 md:h-7 cursor-pointer" 
                                        src="/src/assets/icons/edit.png" 
                                        alt=""
                                        @click="handleEditClick(index)"  
                                    >
                                </label>
                                <button 
                                    v-else 
                                    class="bg-green text-dark text-sm p-1 pl-2 pr-2 font-PoppinsBold rounded-lg" 
                                    @click="handleUpdateTask(index, item)"
                                >Update</button>
                                <img 
                                    @click="deleteTask(index)" 
                                    class="w-5 h-5 md:w-7 md:h-7 cursor-pointer" 
                                    src="/src/assets/icons/delete.png" 
                                    alt=""
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
    input[type="checkbox"] {
        display: none;
    }
    .tasks {
        animation: scaleVertically .3s ease-out;
    }
</style>