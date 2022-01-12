<template>
    <div class="update-msg-container" :class="{'show-update-msg': showMsg}">
        <close-icon class="close-btn" @click="onCloseMsg"/>
        <h2>New content is available!</h2>
        <p>Press <span class="highlight">Ctrl+f5</span> to update.</p>
        <p class="note">*Not updating will lead to a poor user experience.</p>
    </div>
</template>

<script>
import { eventBus } from '@/cms/services/eventBus.service';
import CloseIcon from 'vue-material-design-icons/Close';


export default {
    data() {
        return {
            showMsg: false
        }
    },
    methods: {
        onCloseMsg(){
            this.showMsg = false
        }
    },
    created() {
        eventBus.$on('app-updated', () => {
            this.showMsg = true
        });
    },
    components:{
        CloseIcon
    }
}
</script>