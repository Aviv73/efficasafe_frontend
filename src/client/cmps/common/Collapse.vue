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
                v-if="isContentVisible"
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
                @click.prevent="isContentVisible = false"
            >
                <slot name="de-activator">
                    <span>&times;</span>
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
        }
    },
    data() {
        return {
            isContentVisible: false
        }
    },
    computed: {
        rootEl() {
            return this.isSolo ? 'div' : 'li';
        }
    },
    created() {
        this.$parent.$on('close-collapse', () => {
            this.isContentVisible = false;
        });
    },
    beforeDestroy() {
        this.$parent.$off('close-collapse');
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