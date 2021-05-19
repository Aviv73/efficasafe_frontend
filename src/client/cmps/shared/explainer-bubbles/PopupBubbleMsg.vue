<template>
    <aside class="popup-bubble-msg">
        <bubble
            ref="popup"
            :style="{
                top: offsetY + 'px',
                left: finalOffsetX + 'px'
            }"
        >
            <slot />
        </bubble>
    </aside>
</template>

<script>
import Bubble from './Bubble';

export default {
    props: {
        offsetY: {
            type: Number,
            default: 0
        },
        offsetX: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            gapX: 0
        }
    },
    computed: {
        finalOffsetX() {
            return this.offsetX - this.gapX;
        }  
    },
    mounted() {
        const { popup } = this.$refs;
        const { right } = popup.$el.getBoundingClientRect();
        if (right + 20 > window.innerWidth) {
            const margin = right + 20 - window.innerWidth;
            this.gapX = margin + 5;
        }
    },
    components: {
        Bubble
    }
}
</script>