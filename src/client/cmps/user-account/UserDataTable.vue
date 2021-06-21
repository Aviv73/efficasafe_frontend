<template>
    <table class="user-data-table">
        <thead>
            <tr>
                <th
                    v-for="column in columns"
                    :key="column.field"
                >
                    {{ column.title }}
                </th>
            </tr>
        </thead>
    </table>
</template>

<script>
export default {
    props: {
        columns: {
            type: Array,
            default: () => []
        }
    }
}
</script>