<template>
    <div
        class="tooltip-box"
        :class="{
            'hoverable': on === 'hover',
            'tooltip-active': isActive,
        }"
        ref="activator"
        @click="onToggle"
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
            @click.stop=""
        >   
            <button
                class="tooltip-close-btn"
                v-if="closable"
                @click="isActive = false"
            >
                <slot name="close-icon">&#10006;</slot>
            </button>
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
    EV_sibling_toggle: 'ev-sibling-toggle',
    props: {
        on: {
            type: String,
            default: 'hover'
        },
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
        },
        isSolo: {
            type: Boolean,
            default: false
        },
        closable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isActive: false,
            exceedsRight: false,
            exceedsLeft: false
        }
    },
    methods: {
        onToggle() {
            if (this.on !== 'click') return;
            if (this.isSolo) {
                this.$parent.$emit(this.$options.EV_sibling_toggle, !this.isActive);
            }
            this.checkIfInViewport();
            this.isActive = !this.isActive;
        },
        checkIfInViewport() {
            const { activator, tooltip } = this.$refs;
            const { right, left } = activator.getBoundingClientRect();
            const { width } = tooltip.getBoundingClientRect();
            let isExceedsRight = false;
            let isExceedsLeft = false;

            if (right + width > window.innerWidth) {
                isExceedsRight = true;
            } else if (left - width < 0) {
                isExceedsLeft = true;
            }
            this.exceedsRight = isExceedsRight;
            this.exceedsLeft = isExceedsLeft;
        }
    },
    created() {
        if (!this.isSolo) return; 
        this.$parent.$on(this.$options.EV_sibling_toggle, (isSibActivated) => {
            if (this.isActive && isSibActivated) this.isActive = false;
        });
    }
}
</script>

<style lang="scss" scoped>
    .tooltip-box { 
        position: relative;
        display: inline-block;
        opacity: initial;
        color: initial;
        
        &.tooltip-active .tooltip {
            visibility: visible;
            opacity: 1;
        }
        @media not all and (pointer: coarse) {
            &.hoverable:hover {
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
        .tooltip-close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            color: #C1C1C1;
            z-index: 2;
            cursor: pointer;
        }
    }
</style>