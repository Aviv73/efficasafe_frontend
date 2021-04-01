<template>
    <aside class="tooltip-box">
        <div
            class="tooltip"
            :class="{ 'fade': fade }"
            :style="{
                'transition-duration': duration + 's',
                'top': offsetY + '%',
                'left': offsetX + '%'
            }"
        >
            <slot name="content" />
            <span
                class="txt"
                v-if="!$slots.content"
            >
                {{ txt }}
            </span>
        </div>
        <slot />
    </aside>
</template>

<script>
export default {
    props: {
        txt: {
            type: String,
            default: ''
        },
        fade: {
            type: Boolean,
            default: true
        },
        duration: {
            type: Number,
            default: 0.8
        },
        offsetX: {
            type: Number,
            default: 50
        },
        offsetY: {
            type: Number,
            default: 100
        }
    }
}
</script>

<style lang="scss" scoped>
    .tooltip-box { 
        position: relative;
        display: inline-block;
        opacity: initial;
        color: initial;

        &:hover .tooltip {
            visibility: visible;
            opacity: 1;
        }
    }
    .tooltip { 
        position: absolute;
        top: 100%;
        left: 50%;
        width: max-content;
        visibility: hidden;
        transform: translateX(-50%);
        z-index: 1;
        opacity: 0;

        &.fade {
            transition-property: opacity;
            transition-timing-function: ease;
        }
    }
</style>