<template>
    <section v-if="alertOn" class="alert-messages">
        <v-alert
            class="alert-msg"
            :type="(isError) ? 'error' : (isNotice) ? 'info' : 'success'"
            :value="alertOn"
            @click:close="killAlert"
            dismissible
            close-icon="mdi-close"
            dense
        >
            {{ msgToShow }}
        </v-alert>
    </section>
</template>

<script>
import {
    eventBus,
    EV_addMaterial,
    EV_addLabel,
    EV_addInteraction,
    EV_edit_interaction_failed,
    EV_Unauthenticated
} from '@/cms/services/eventBus.service';

export default {
    timeout: null,
    data() {
        return {
            alertOn: false,
            name: '',
            type: '',
            isError: false,
            isNotice: false
        };
    },
    methods: {
        displayMessage(payload) {
            if (payload.name) {
                this.name = payload.name;
            }
            this.isError = payload.isError || false;
            this.isNotice = payload.isNotice || false;
            this.type = payload.type;
            this.alertOn = true;

            this.$options.timeout = setTimeout(() => {
                this.alertOn = false;
                this.name = '';
                this.type = '';
            }, 3500);
        },
        killAlert() {
            this.alertOn = false;
            this.name = '';
            this.type = '';
            clearTimeout(this.$options.timeout);
        },
    },
    computed:{
        msgToShow(){
            if(this.type === 'Unauthenticated') return `You are unauthenticated, please logout and login again`
            if(this.isError) return `Unable to save ${this.type}`
            return `${this.type} ${this.name} Saved`
        }
    },
    created() {
        eventBus.$on(EV_addMaterial, this.displayMessage);
        eventBus.$on(EV_addLabel, this.displayMessage);
        eventBus.$on(EV_addInteraction, this.displayMessage);
        eventBus.$on(EV_edit_interaction_failed, this.displayMessage);
        eventBus.$on(EV_Unauthenticated, this.displayMessage);
    },
};
</script>