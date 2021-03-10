<template>
    <section class="swiper">
        <span
            v-for="(slide, idx) in $slots.default"
            :key="idx"
        >   
            <div 
                class="swipe-target"
                v-hammer:swipe.horizontal="onSwipe"
                @keyup="onKey"
                tabindex="0"
            >
                <transition name="fade" mode="out-in">
                    <slide
                        :idx="idx"
                        v-if="idx === currSlideIdx"
                    />
                </transition>
            </div>
        </span>
        <slot name="navigation-prev">
            <font-awesome-icon
                icon="chevron-left"
                class="chevron chevron-prev"
                @click="doSlide(-1)"
            />
        </slot>
        <slot name="navigation-next">
            <font-awesome-icon
                icon="chevron-right"
                class="chevron chevron-next"
                @click="doSlide(1)"
            />
        </slot>
        <slot name="pagination">
            <span class="pagination">
                <label
                    v-for="n in $slots.default.length"
                    :key="n"
                >
                    <input type="radio" name="pagination-btns" v-model="currSlideIdx" :value="n - 1" hidden />
                    <span class="dot" />
                </label>
            </span>
        </slot>
    </section>
</template>

<script>
export default {
    name: 'Swiper',
    data: () => ({
        currSlideIdx: 0,
    }),
    methods: {
        doSlide(diff) {
            this.currSlideIdx += diff;
            if (this.currSlideIdx < 0) this.currSlideIdx = this.$slots.default.length - 1;
            else if (this.currSlideIdx === this.$slots.default.length) this.currSlideIdx = 0;
        },
        onSwipe({ type }) {
            switch (type) {
                case 'swiperight':
                    this.doSlide(1);
                    break;
                case 'swipeleft':
                    this.doSlide(-1);
                    break;
            }
        },
        onKey({ key }) {
            switch (key) {
                case 'ArrowRight':
                    this.doSlide(1);
                    break;
                case 'ArrowLeft':
                    this.doSlide(-1);
                    break;
            }
        }
    },
    components: {
        Slide: {
            functional: true,
            render: (h, ctx) => {
                return ctx.parent.$slots.default[ctx.data.attrs.idx];
            }
        }
    }
};
</script>

<style lang="scss" scoped>
    .swipe-target {
        cursor: grab;
        &:active {
            cursor: grabbing;
        }
    }
    .fade-leave-active,
    .fade-enter-active {
        transition: opacity .4s linear;
    }
    .fade-enter {
        position: absolute;
        top: 0;
        visibility: hidden;
    }
    .fade-leave-to {
        box-shadow: none;
        position: absolute;
        top: 0;
        opacity: 0;
    }
</style>