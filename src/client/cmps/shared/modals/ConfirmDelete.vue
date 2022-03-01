<template>
    <aside v-if="itemToDelete" class="confirm-delete share-modal">
        <header class="share-modal-header flex-space-between">
            <alert-circle-icon
                class="alert-circle-icon"
                :size="18"
                title=""
            />
            <h5>Confirm delete</h5>
            <button
                class="close-btn"
                @click="$emit('close-modal')"
            >
                <close-icon :size="14" title="" />
            </button>
        </header>
        <main class="share-modal-content">
            <div class="share-modal-content-confirm-delete flex-coloumn">
                <template v-if="!isLoading">
                    <p>
                        Are you sure you want to delete <span class="font-medium highlight">'{{ itemToDelete.title }}'</span>?
                    </p>
                    <div class="share-modal-content-confirm-delete-actions flex-space-between">
                        <button
                            @click="$emit('close-modal')"
                        >
                            Cancel
                        </button>
                        <button
                            class="delete-btn"
                            @click="onDelete"
                        >
                            Delete
                        </button>
                    </div>
                </template>
                <template v-else>
                    <loader/>
                </template>
            </div>
        </main>
    </aside>
</template>

<script>
import { eventBus } from '@/cms/services/eventBus.service';
import Loader from '@/client/cmps/common/icons/Loader';

import CloseIcon from 'vue-material-design-icons/Close';
import AlertCircleIcon from 'vue-material-design-icons/AlertCircle';

export default {
    props: {
        itemToDelete: {
            type: Object,
        }
    },
    data(){
        return {
            isLoading: false
        }
    },
    methods:{
        onDelete(){
            this.isLoading = true
            this.$emit('delete-confirmed')
        }
    },
    created(){
        eventBus.$on('close-confirm-delete', () => {
            this.isLoading = false
            this.$emit('close-modal')
        })
    },
    components: {
        CloseIcon,
        AlertCircleIcon,
        Loader
    }
}
</script>