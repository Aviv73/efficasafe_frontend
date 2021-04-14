<template>
    <p
        class="long-txt"
        @click="toggleTxt"
        :class="{
            'clipped': !isShown,
            'expandable': expandable
        }"
        v-html="isHTML ? txtToDisplay : ''"
    >
        {{ isHTML ? '' : txtToDisplay }}
    </p>
</template>

<script>
export default {
    props: {
        txt: {
            type: String,
            required: true
        },
        maxChars: {
            type: Number,
            default: 50
        },
        overflowSymb: {
            type: String,
            default: '...'
        },
        isHTML: {
            type: Boolean,
            default: false
        },
        expandable: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isLong: false,
            isShown: false
        }
    },
    computed: {
         txtToDisplay() {
            if (!this.isLong) return this.txt;
            return (this.isShown) ? this.txt : this.txt.substring(0, this.maxChars) + this.overflowSymb;
        }
    },
    methods: {
        toggleTxt() {
            if (!this.expandable || !this.isLong) return;
            this.isShown = !this.isShown;
        }
    },
    created() {
        this.isLong = (this.txt.length > this.maxChars);
        this.isShown = !this.isLong;
    }
};
</script>

<style lang="scss">
    .long-txt {
        display: inline-block;

        &.expandable {
            cursor: pointer;
        }
    }
</style>