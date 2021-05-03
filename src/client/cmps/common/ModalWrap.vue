<template>
    <div class="cover" :class="{ active: isActive }" @click.self="closeModal">
        <slot />
    </div>
</template>

<script>
export default {
    props: {
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        document.addEventListener('keydown', this.handleKey);
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.handleKey);
    },
    methods: {
        closeModal() {
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
    z-index: 98;
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
    }
}
</style>