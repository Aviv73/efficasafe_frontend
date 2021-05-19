<template>
    <div class="bubble">
        <div class="bubble-content">
            <button
                class="bubble-close-btn"
                @click="$emit('close-bubble')"
            >
                <close-icon fillColor="#b1b1b1" :size="16" />
            </button>
            <slot />
        </div>
    </div>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/Close';

export default {
    components: {
        CloseIcon
    }
}
</script>