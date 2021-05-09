<template>
    <section
        class="swiper"
        @keyup="onKey"      
        tabindex="0"
        v-hammer:swipe.horizontal="onSwipe"
        :class="{ 'grab-cursor': cursor }"
    >
        <span
            v-for="(slide, idx) in $slots.default"
            :key="idx"
        >  
            <transition name="fade" mode="out-in">
                <slide
                    :idx="idx"
                    v-if="idx === currSlideIdx"
                />
            </transition>
        </span>
        <i
            v-if="!hideNavigation"
            @click="doSlide(-1)"
            class="chevron chevron-prev"
        >
            <slot name="navigation-prev">
                <span class="navigation-default">&lsaquo;</span>
            </slot>
        </i>
        <i
            v-if="!hideNavigation"
            @click="doSlide(1)"
            class="chevron chevron-next"
        >
            <slot name="navigation-next">
                <span class="navigation-default">&rsaquo;</span>
            </slot>
        </i>
        <slot name="pagination">
            <span class="pagination" v-if="$slots.default">
                <button v-if="paginationPrevNext">
                    A
                </button>
                <label
                    v-for="n in $slots.default.length"
                    :key="n"
                >
                    <input type="radio" name="pagination-btns" v-model="currSlideIdx" :value="n - 1" hidden />
                    <span class="dot" />
                </label>
                <button v-if="paginationPrevNext">
                    B
                </button>
            </span>
        </slot>
    </section>
</template>

<script>
export default {
    intervalId: null,
    name: 'Swiper',
    props: {
        cursor: {
            type: Boolean,
            default: true
        },
        autoPlay: {
            type: Boolean,
            default: false
        },
        delay: {
            type: Number,
            default: 15
        },
        hideNavigation: {
            type: Boolean,
            default: false
        },
        paginationPrevNext: {
            type: Boolean,
            default: false
        }
    },
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
    mounted() {
        if (this.autoPlay) {
            this.$options.intervalId = setInterval(() => {
                this.doSlide(1);
            }, this.delay * 1000);
        }
    },
    beforeDestroy() {
        clearInterval(this.$options.intervalId);
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
    .swiper {
        position: relative;
    }
    .navigation {
        &-default {
            font-size: 36px;
            font-weight: 700;
        }
    }
    .pagination {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 30px);

        label:not(:last-child) {
            display: inline-block;
            margin-inline-end: 10px;
        }

        .dot {
            cursor: pointer;
            display: inline-block;
            height: 10px;
            width: 10px;
            background-color: #fff;
            border-radius: 50%;
            opacity: .3;
            transition: opacity .2s linear;
        }

        [type=radio]:checked+.dot {
            opacity: 1;
        }
    }
    .grab-cursor {
        cursor: grab;
        &:active {
            cursor: grabbing;
        }
    }
    .fade-leave-active,
    .fade-enter-active {
        transition: opacity .6s linear;
    }
    .fade-enter {
        position: absolute;
        top: 0;
        visibility: hidden;
        color: rgba(0, 0, 0, 0);
    }
    .fade-leave-to {
        box-shadow: none;
        position: absolute;
        top: 0;
        opacity: 0;
    }
</style>