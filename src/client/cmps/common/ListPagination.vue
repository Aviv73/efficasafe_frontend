<template>
    <footer class="list-pagination">
        <button
            v-for="n in length"
            :key="n"
            
        >
            {{ n }}
        </button>
    </footer>
</template>

<script>
export default {
    props: {
        length: {
            type: Number,
            default: 0
        }
    }
}
</script>