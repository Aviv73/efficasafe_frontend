<template>
    <component :is="rootEl" class="collapse">
        <header
            tabindex="0"
            class="collapse-header"
            @click="isContentVisible = !isContentVisible"
            :class="{ 'open': isContentVisible }"
        >
            <slot name="header">
                Toggle collapse
            </slot>
        </header>
        <transition name="scale-y">
            <main
                class="collapse-content"
                :class="{ 'allow-overflow': allowOverflow }"
                v-show="isContentVisible"
            >
                <slot name="content">
                    Collapse content here!
                </slot>
            </main>
        </transition>
        <transition name="scale-y">
            <button
                v-if="isContentVisible"
                class="close-btn"
                :tabindex="hideDeActivator ? '-1' : '1'"
                @click.prevent="closeCollapse"
            >
                <slot
                    name="de-activator"
                    v-if="!hideDeActivator"
                >
                    <span v-if="showTimes">&times;</span>
                </slot>
            </button>
        </transition>
    </component>
</template>

<script>
export default {
    props: {
        isSolo: {
            type: Boolean,
            default: true
        },
        showTimes: {
            type: Boolean,
            default: false
        },
        hideDeActivator: {
            type: Boolean,
            default: false
        },
        allowOverflow: {
            type: Boolean,
            default: false
        },
        initialIsVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isContentVisible: this.initialIsVisible
        }
    },
    computed: {
        rootEl() {
            return this.isSolo ? 'div' : 'li';
        }
    },
    methods: {
        closeCollapse() {
            this.$emit('collapse-closed');
            this.isContentVisible = false;
        }
    }
}
</script>

<style lang="scss" scoped>
    .collapse {
        position: relative;

        &-header {
            cursor: pointer;
            pointer-events: none;
            padding: .05px 0;
            max-width: 100%;

            &:focus {
                outline: none;
            }
            .de-activator {
                position: absolute;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                
                
                &.inline-start {
                    right: unset;
                    left: 0;
                    top: 24px;
                    transform: translate(-100%, -40%);
                }
                .opened {
                    display: none;
                }
            }
            &.open .de-activator {
                .opened {
                    display: initial;
                }
                .closed {
                    display: none;
                }
            }
        }
        &-content {
            overflow: hidden;

            &.allow-overflow {
                overflow: visible;
            }
        }
        .close-btn {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 50%);
            z-index: 1;
        }
    }
    .scale-y-enter-active, .scale-y-leave-active {
        transform-origin: top;
        transition: transform .3s ease, opacity .3s ease;
    }
    .scale-y-enter, .scale-y-leave-to {
        transform: scaleY(0);
        opacity: 0;
    }
</style>