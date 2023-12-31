<template>
    <span
        class="select"
        tabindex="0"
        @click="isOpen = !isOpen"
        @keypress.enter="isOpen = !isOpen"
        @keydown.prevent.down="shiftFocus(0)"
    >
        <span class="select-trigger">
            {{ activeOption }}
            <svg
                class="select-icon"
                :class="{ 'open': isOpen }"
                width="12"
                height="10"
                viewBox="0 0 12 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M6 10L0 0L12 0L6 10Z" fill="#D5D5D5" />
            </svg>
        </span>
        <transition name="scale">
            <ul
                v-if="isOpen"
                class="select-options"
            >
                <li
                    class="select-options-item"
                    v-for="(option, idx) in options"
                    :key="idx"
                    :ref="`option-${idx}`"
                    tabindex="0"
                    @click.stop="pickOption(option)"
                    @keypress.enter.stop="pickOption(option)"
                    @keydown.stop.prevent.up="shiftFocus(idx - 1)"
                    @keydown.stop.prevent.down="shiftFocus(idx + 1)"
                >
                    {{ option.title }}
                </li>
            </ul>
        </transition>
    </span>
</template>

<script>
export default {
    model: {
        prop: 'value',
        event: 'input'
    },
    props: {
        value: {
            type: [ String, Number ],
            required: true
        },
        options: {
            type: Array,
            default: () => [],
        },
        placeholder:{
            type: String,
            required: false
        }
    },
    data() {
        return {
            isOpen: false,
            activeOption: this.placeholder || (this.options.length ? this.options[0].title : ''),
        };
    },
    methods: {
        shiftFocus(itemIdx) {
            if (!this.isOpen) return;
            
            if (itemIdx < 0) itemIdx = this.options.length - 1;
            else if (itemIdx === this.options.length) itemIdx = 0;
            
            const [ elItem ] = this.$refs[`option-${itemIdx}`];
            elItem.focus();
        },
        pickOption({ title, value }) {
            this.activeOption = title;
            this.isOpen = false;
            this.$emit('input', value);
            this.$emit('changed');
        }
    }
};
</script>

<style lang="scss" scoped>
.select {
    display: inline-block;
    user-select: none;
    position: relative;

    &-trigger {
        display: inline-block;
        width: 9.675rem;
        padding: 0.5rem 2.5rem 0.5rem 1rem;
        background-color: #fff;
        position: relative;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    &-icon {
        position: absolute;
        right: .875rem;
        top: calc(50% - 5px);
        transition: transform .3s ease;

        &.open {
            transform: rotateZ(180deg);
        }
    }
    &-options {
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        margin-block-start: 8px;
        background-color: #fff;
        line-height: 200%;
        box-shadow: 0px 2px 4px rgba(#000, .1);

        &-item {
            padding: 0 1.5rem;

            &:focus {
                outline: none;
                background-color: #EBEBEB;
                text-shadow:0px 0px 1px currentColor;
            }
            @media not all and (pointer: coarse) {
                &:hover {
                    background-color: #EBEBEB;
                    text-shadow:0px 0px 1px currentColor;
                }
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