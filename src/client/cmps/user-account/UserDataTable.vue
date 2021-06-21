<template>
    <table class="user-data-table">
        <thead>
            <tr>
                <th
                    v-for="header in headers"
                    :key="header.field"
                >
                    {{ header.title }}
                </th>
            </tr>
        </thead>
    </table>
</template>

<script>
export default {
    props: {
        headers: {
            type: Array,
            default: () => []
        }
    }
}
</script>