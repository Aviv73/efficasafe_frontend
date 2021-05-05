<template>
    <ul class="reference-list">
        <li
            class="reference-list-item flex-align-center"
            v-for="(ref, idx) in refs"
            :key="idx"
        >
            <span class="num">{{ idx + 1 }}</span>
            <span class="txt" v-if="!DBankRefs">
                <p>{{ ref.txt | ref-txt }}</p>
                <a :href="ref.link" target="_blank" class="ref-link">
                    {{ ref.link }}
                </a>
            </span>
            <span class="txt" v-else>
                <p>{{ ref.citation || ref.title | ref-txt }}</p>
                <a
                    class="ref-link"
                    :href="getDBankRefLink(ref)"
                    target="_blank"
                >
                    {{ getDBankRefLink(ref) }}
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
        },
        DBankRefs: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getDBankRefLink(ref) {
            return ref.pubmed_id ? `https://pubmed.ncbi.nlm.nih.gov/${ref.pubmed_id}` : ref.url;
        }
    }
}
</script>