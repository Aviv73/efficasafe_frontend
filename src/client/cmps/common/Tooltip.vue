<template>
    <div
        class="tooltip-box"
        @mouseenter="checkIfInViewport"
    >
        <aside
            class="tooltip"
            ref="tooltip"
            :class="{
                'fade': fade,
                'exceed-right': exceedsRight,
                'exceed-left': exceedsLeft,
                bottom,
                top,
                left,
                right
            }"
            :style="{
                'transition-duration': duration + 's',
                'margin-top': offsetY + 'px',
                'margin-left': offsetX + 'px'
            }"
        >
            <slot name="content" />
            <span
                class="txt"
                v-if="!$slots.content"
            >
                {{ txt }}
            </span>
        </aside>
        <slot />
    </div>
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
            default: 0
        },
        offsetY: {
            type: Number,
            default: 0
        },
        bottom: {
            type: Boolean,
            default: false
        },
        top: {
            type: Boolean,
            default: false
        },
        left: {
            type: Boolean,
            default: false
        },
        right: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            exceedsRight: false,
            exceedsLeft: false
        }
    },
    methods: {
        checkIfInViewport() {
            const el = this.$refs.tooltip;
            const { right, left } = el.getBoundingClientRect();
            let isExceedsRight = false;
            let isExceedsLeft = false;

            if (right > window.innerWidth) {
                isExceedsRight = true;
            } else if (left < 0) {
                isExceedsLeft = true;
            }
            this.exceedsRight = isExceedsRight;
            this.exceedsLeft = isExceedsLeft;
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

        @media not all and (pointer: coarse) {
            &:hover {
                .tooltip {
                    visibility: visible;
                    opacity: 1;
                }
            }
        }
    }
    .tooltip { 
        position: absolute;
        width: max-content;
        visibility: hidden;
        z-index: 1;
        opacity: 0;

        &.fade {
            transition-property: opacity;
            transition-timing-function: ease;
        }
        &.bottom {
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
        }
        &.top {
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
        }
        &.left {
            left: 100%;
            top: 50%;
            transform: translateY(-50%);

            &.exceed-right {
                left: unset;
                right: 100%;
                transform: translateY(-50%);
            }
        }
        &.right {
            right: 100%;
            top: 50%;
            transform: translateY(-50%);

            &.exceed-left {
                right: unset;
                left: 100%;
                transform: translateY(-50%);
            }
        }
    }
</style>