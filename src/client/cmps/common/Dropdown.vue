<template>
    <div class="dropdown">
        <button @click="isActive = !isActive">
            <slot name="activator">
                Click me!
            </slot>
        </button>
        <transition name="scale">
            <div v-if="isActive" class="dropdown-content">
                <slot name="content">
                    Dropdown content :)
                </slot>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isActive: false
        }
    },
    watch: {
        '$route'() {
            this.isActive = false;
        }
    }
}
</script>

<style lang="scss" scoped>
.dropdown {
    display: inline-flex;
    align-items: center;
    position: relative;

    &-content {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
    }
}
.scale-enter-active,
.scale-leave-active {
  transform-origin: top;
  transition: transform .3s ease-in-out, opacity .3s ease-in-out;
}

.scale-enter-to,
.scale-leave {
  transform: scaleY(1);
}

.scale-enter,
.scale-leave-to {
  transform: scaleY(0);
  opacity: 0;
}
</style>