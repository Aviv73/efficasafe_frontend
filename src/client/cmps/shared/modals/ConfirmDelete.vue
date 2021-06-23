<template>
    <aside class="confirm-delete share-modal">
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
                <p>
                    Are you sure you want to delete <span class="font-medium highlight">'{{ name }}'</span>?
                </p>
                <div class="share-modal-content-confirm-delete-actions flex-space-between">
                    <button
                        @click="$emit('close-modal')"
                    >
                        Cancel
                    </button>
                    <button
                        class="delete-btn"
                        @click="$emit('delete-confirmed')"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </main>
    </aside>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/Close';
import AlertCircleIcon from 'vue-material-design-icons/AlertCircle';

export default {
    props: {
        name: {
            type: String,
            default: ''
        }
    },
    components: {
        CloseIcon,
        AlertCircleIcon
    }
}
</script>