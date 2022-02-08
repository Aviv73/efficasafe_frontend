<template>
    <div
        class="cover"
        ref="cover"
        :class="{ active: isActive }"
        @click.self="closeModal"
    >
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        isActive: {
            type: Boolean,
            default: false
        },
        persistent: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        document.addEventListener('keydown', this.handleKey);
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.handleKey);
    },
    methods: {
        closeModal() {
            if (this.persistent) {
                const content = this.$refs.cover.querySelector('.cover>*');
                content.classList.add('anim-shake');
                setTimeout(() => {
                    content.classList.remove('anim-shake');
                }, 820);
                return;
            }
            this.$emit('close-modal');
        },
        handleKey(ev) {
            if (!this.isActive) return;
            if (ev.keyCode === 27) this.closeModal();
        },
    },
};
</script>

<style lang="scss" scoped>
.cover {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    height: 100%;
    width: 100%;
    background-color: rgba(#000000, 0.6);
    opacity: 0;
    visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.4s linear;

    &.active {
        opacity: 1;
        visibility: visible;
    }
    &.active > * {
        opacity: 1;
        transform: translateY(0);
    }
    & > * {
        opacity: 0;
        transform: translateY(-300px);
        transition: opacity 0.4s linear, transform 0.4s ease-in-out;

        &.anim-shake {
            animation: shake .82s cubic-bezier(.36, .07, .19, .97) both;
        }
    }
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>