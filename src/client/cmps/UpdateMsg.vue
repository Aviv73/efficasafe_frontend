<template>
    <div class="update-msg-container" :class="{'show-update-msg': showMsg}">
        <close-icon class="close-btn" @click="onCloseMsg"/>
        <h2>New content is available!</h2>
        <p>Click on the button to reload the page or press Ctrl+f5 at any time.</p>
        <button @click="hardReloadPage" class="reload-btn">Reload</button>
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
        hardReloadPage(){
            location.reload(true)
        },
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