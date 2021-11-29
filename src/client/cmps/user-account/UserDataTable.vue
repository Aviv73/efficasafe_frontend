<template>
    <section class="user-data-table">
        <table>
            <thead>
                <tr>
                    <th
                        v-for="(header, idx) in headers"
                        :key="idx"
                    >
                        <label
                            v-if="header.sortable"
                        >
                            <input
                                type="checkbox"
                                hidden
                                @change="emitSort(header, $event.target.checked)"
                            />
                            <sort-vertical-icon
                                class="sort-icon"
                            />
                        {{ header.title }}
                        </label>
                        <span v-else>{{ header.title }}</span>
                    </th>
                </tr>
                <tr
                    v-for="(item, rowIdx) in items"
                    :key="rowIdx"
                >
                    <td
                        v-for="(header, colIdx) in headers"
                        :key="colIdx"
                    >   
                        <span v-if="header.field === 'title'" class="font-medium">
                            {{ item[header.field] }}
                        </span>
                        <span v-else-if="header.field === 'at'">
                            {{ item[header.field] | moment('DD/MM/YYYY') }}
                        </span>
                        <span v-else-if="header.field === 'price'">
                            ${{ item[header.field] }}
                        </span>
                        <span v-else-if="header.field === 'plan'">
                            {{ item[header.field] }}
                        </span>
                        <span v-else-if="header.field === 'until'">
                            {{ item[header.field] | moment('DD/MM/YYYY')}}
                        </span>
                        <span v-else-if="!header.field && $route.name === 'Purchases'">
                            <button
                                class="end-subscrition-btn"
                                @click="onEndSubscription(item)"
                                v-if="item.until === 'Ongoing'"
                            >
                                End subscription
                            </button>
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
                                @click="onRemove(rowIdx, item.title)"
                            >
                                <delete-icon title="" />
                            </button>
                        </span>
                    </td>
                </tr>
            </thead>
        </table>
        <modal-wrap
            :isActive="isModalActive"
            @close-modal="closeModal"
        >
            <aside class="confirm-delete">
                <confirm-delete
                    @close-modal="closeModal"
                    :name="itemNameToDelete"
                    @delete-confirmed="emitDeleteItem"
                />
            </aside>
        </modal-wrap>
    </section>
</template>

<script>
import ModalWrap from '@/client/cmps/common/ModalWrap';
import ConfirmDelete from '@/client/cmps/shared/modals/ConfirmDelete';

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
    data() {
        return {
            isModalActive: false,
            itemToDelete: null
        }
    },
    computed: {
        itemNameToDelete() {
            return this.itemToDelete ? this.itemToDelete.name : '';
        }
    },
    methods: {
        emitSort(sortBy, isDesc) {
            this.$emit('header-clicked', sortBy, isDesc);
        },
        emitDeleteItem() {
            this.$emit('item-deleted', this.itemToDelete.idx);
            this.closeModal();
        },
        onRemove(idx, name) {
            this.itemToDelete = { idx, name };
            this.isModalActive = true;
        },
        closeModal() {
            this.itemToDelete = null;
            this.isModalActive = false;
        },
        getSearchLink(fullUrl) {
            if (fullUrl.startsWith(window.location.origin)) {
                return fullUrl.substring(window.location.origin.length);
            }
            return fullUrl;
        },
        onEndSubscription(item){
            this.$emit('end-subscription', item);
        }
    },
    components: {
        SortVerticalIcon,
        DeleteIcon,
        ModalWrap,
        ConfirmDelete
    }
}
</script>