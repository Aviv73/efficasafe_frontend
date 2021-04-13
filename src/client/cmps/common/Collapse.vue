<template>
    <component :is="rootEl" class="collapse">
        <header
            tabindex="0"
            class="collapse-header"
            @click="isContentVisible = !isContentVisible"
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
    </component>
</template>

<script>
export default {
    props: {
        isSolo: {
            type: Boolean,
            default: false
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
    }
}
</script>

<style lang="scss" scoped>
    .collapse {
        &-header {
            cursor: pointer;
            max-width: 100%;

            &:focus {
                outline: none;
            }
        }
        &-content {
            overflow: hidden;
        }
    }
    .scale-y-enter-active, .scale-y-leave-active {
        transform-origin: top;
        transition: transform .3s ease;
    }
    .scale-y-enter, .scale-y-leave-to {
        transform: scaleY(0);
    }
</style>