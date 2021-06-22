<template>
    <section class="user-data-table">
        <table>
            <thead>
                <tr>
                    <th
                        v-for="(header, idx) in headers"
                        :key="idx"
                    >
                        <button v-if="header.sortable">
                            <sort-vertical-icon
                                class="sort-icon"
                            />
                        {{ header.title }}
                        </button>
                        <span v-else>{{ header.title }}</span>
                    </th>
                </tr>
                <tr
                    v-for="(item, idx) in items"
                    :key="idx"
                >
                    <td
                        v-for="(header, idx) in headers"
                        :key="idx"
                    >   
                        <span v-if="header.field === 'title'" class="font-medium">
                            {{ item[header.field] }}
                        </span>
                        <span v-else-if="header.field === 'at'">
                            {{ item[header.field] | moment('DD/MM/YYYY') }}
                        </span>
                        <span
                            class="flex-space-between td-actions"
                            v-else-if="!header.title"
                        >
                            <router-link
                                class="search-link"
                                :to="getSearchLink(item['url'])"
                                title="View search"
                            >
                                View
                            </router-link>
                            <button
                                class="delete-btn"
                                title="Delete search"
                            >
                                <delete-icon title="" />
                            </button>
                        </span>
                    </td>
                </tr>
            </thead>
        </table>
    </section>
</template>

<script>
import SortVerticalIcon from '@/client/cmps/common/icons/SortVerticalIcon';
import DeleteIcon from 'vue-material-design-icons/Delete';

export default {
    props: {
        headers: {
            type: Array,
            default: () => []
        },
        items: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        getSearchLink(fullUrl) {
            if (fullUrl.startsWith(window.location.origin)) {
                return fullUrl.substring(window.location.origin.length);
            }
            return fullUrl;
        }
    },
    components: {
        SortVerticalIcon,
        DeleteIcon
    }
}
</script>