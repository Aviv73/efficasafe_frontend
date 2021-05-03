<template>
    <ul class="reference-list">
        <li
            class="reference-list-item flex-align-center"
            v-for="(ref, idx) in refs"
            :key="idx"
        >
            <span class="num">{{ idx + 1 }}</span>
            <span class="txt">
                <p>{{ ref.txt | ref-txt }}</p>
                <a :href="ref.link" target="_blank" class="ref-link">
                    {{ ref.link }}
                </a>
            </span>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        refs: {
            type: Array,
            required: true
        }
    }
}
</script>