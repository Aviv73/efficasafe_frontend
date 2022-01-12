<template>
    <div class="update-msg-container" :class="{'show-update-msg': showMsg}">
        <close-icon class="close-btn" @click="onCloseMsg"/>
        <h2>New content is available!</h2>
        <p>Press <span class="highlight">Ctrl+F5</span> or <span class="highlight">Command+Shift+R</span> on mac to update.</p>
        <p class="note">*Not updating will lead to a poor user experience.</p>
    </div>
</template>

<script>
import { eventBus } from '@/cms/services/eventBus.service';
import CloseIcon from 'vue-material-design-icons/Close';


export default {
    data() {
        return {
            showMsg: true
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