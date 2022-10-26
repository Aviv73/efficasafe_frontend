<template>
    <div
        class="dropdown"
        :class="{ 'active': isActive }"
    >
        <button @click="isActive = !isActive" class="activator-btn">
            <slot name="activator">
                Click me!
            </slot>
            <img
                src="@/client/assets/imgs/dropdown-icon.svg"
                :class="{toggled: isActive}"
                class="dropdown-img"
            />
        </button>
        <transition name="scale">
            <div v-if="isActive" class="dropdown-content" :class="{'to-the-left': isToTheLeft, 'no-hover': dontHover}">
                <slot name="content">
                    Dropdown content :)
                </slot>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        dontHover: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isActive: false,
            isToTheLeft: false
        }
    },
    watch: {
        '$route'() {
            this.isActive = false;
        }
    },
    mounted() {
        if (this.dontHover) return;
        function _getElPosOnScreen(el) {
            const pos = {y: 0, x: 0};
            if (!el) return pos;
            let _el = el;
            while (_el.tagName !== 'BODY') {
                pos.y += _el.offsetTop;
                pos.x += _el.offsetLeft;
                _el = _el.offsetParent;
            }
            return pos;
        }
        const thisElPos = _getElPosOnScreen(this.$el);
        const bodyWidth = document.body.offsetWidth;
        const diff = bodyWidth - thisElPos.x;
        if (diff < 250) this.isToTheLeft = true;  
    }
}
</script>

<style lang="scss" scoped>
.dropdown {
    display: inline-flex;
    flex-direction: column;
    // align-items: center;
    gap: 5px;
    position: relative;

    &-content:not(.no-hover) {
        position: absolute;
        top: calc(100% + 30px);
        left: 0;
        &.to-the-left {
            left: unset;
            right: 0;
        }
        &.no-hover {

        }
    }

    &--animate {
        transition: transform .3s ease;
    }
    &.active &--animate {
        transform: rotateZ(180deg) translateY(2px);
    }

    .activator-btn {
        display: flex;
        align-items: center;
        gap: 5px;
        .dropdown-img {
            width: 7px;
            transition: .3s;
            &.toggled {
                transform: rotate(180deg);
            }
        }
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