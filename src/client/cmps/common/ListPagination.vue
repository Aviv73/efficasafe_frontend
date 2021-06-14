<template>
    <footer class="list-pagination">
        <button
            class="first-btn"
            @click="$emit('input', 1)"
        >
            <slot name="first-btn">
                First
            </slot>
        </button>
        <label
            class="list-pagination-page"
            :class="{ 'disabled': disabled }"
            v-for="n in pageCountToDisplay"
            :key="n"
        >   
            <input
                type="radio"
                name="page"
                :value="n"
                hidden
                @input="$emit('input', $event.target.value)"
            />
            <span
                :class="{
                    'active': page === n,
                    'ghost': Math.abs(page - n) > itemPerSide
                }"
            >
                {{ n }}
            </span>
        </label>
        <button
            class="last-btn"
            @click="$emit('input', pageCount)"
        >
            <slot name="last-btn">
                Last
            </slot>
        </button>
    </footer>
</template>

<script>
export default {
    model: {
        prop: 'page',
        event: 'input'
    },
    props: {
        pageCount: {
            type: Number,
            required: true
        },
        page: {
            type: Number,
            required: true
        },
        disabled: {
            type: Boolean,
            required : false
        },
        totalVisible: {
            type: Number,
            default: 5
        }
    },
    data() {
        return {
            itemPerSide: Math.floor(this.totalVisible / 2)
        }
    },
    computed: {
        pageCountToDisplay() {
            const range = this.getRange(1, this.pageCount);
            let from = this.page - (this.itemPerSide + 1);
            if (this.page - (this.itemPerSide + 1) < 0) {
                from = 0;
                const diff = Math.abs(this.page - (this.itemPerSide + 1));
                return [ ...new Set([ ...range.slice(-diff), ...range.slice(from, this.page + this.itemPerSide) ]) ];
            } else if (this.page + this.itemPerSide > this.pageCount) {
                const diff = this.page + this.itemPerSide - this.pageCount;
                return range.slice(from, this.page + this.itemPerSide).concat(range.slice(0, diff));
            }
            return range.slice(from, this.page + this.itemPerSide);
        }
    },
    methods: {
        getRange(from, to) {
            const range = [];
            for (let i = from; i <= to; i++) {
                range.push(i);
            }
            return range;
        }
    }
}
</script>

<style lang="scss" scoped>
    .list-pagination {
        &-page {
            display: inline-block;
            margin: 0 .375rem;
            cursor: pointer;

            &.disabled {
                opacity: .5;
                pointer-events: none;
            }

            & > span {
                &.active {
                    color: #205072;
                    padding-bottom: .125rem;
                    border-bottom: 1px solid #205072;
                }
                &.ghost {
                    opacity: .5;
                }
            }
        }
        .first-btn {
            margin-inline-end: 1rem;

            &.disabled {
                opacity: .5;
                pointer-events: none;
            }
        }
        .last-btn {
            margin-inline-start: 1rem;
            
            &.disabled {
                opacity: .5;
                pointer-events: none;
            }
        }
    }
</style>