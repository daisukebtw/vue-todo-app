<template>
    <div v-show="showHelp" class="w-80 lg:w-96 h-96 flex flex-col items-center justify-start bg-dark border-2 border-light shadow-xl shadow-dark p-2 fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-xl">
        <span class="font-PoppinsBold text-xl">Need Help ? </span>
        <div class="w-full h-1 bg-gray"></div>
        <div class="flex flex-col gap-2 w-full overflow-auto p-2">
            <span class="w-full break-words text-start indent-2 p-1 bg-gray rounded-xl">
                <span class="text-red">Offline mode</span> is to manage tasks locally without internet connection.
            </span>
            <span class="w-full break-words text-start indent-2 p-1 bg-gray rounded-xl">
                <span class="text-green">Online mode</span> is to sync tasks to cloud storage and manage tasks online. 
                By enabling online mode locally saved tasks automatically syncs to cloud.
            </span>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    computed: {
        ...mapState({
            showHelp: state => state.showHelp,
        })
    },
}
</script>