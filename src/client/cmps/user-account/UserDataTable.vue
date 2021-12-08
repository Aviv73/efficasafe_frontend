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
                        <span v-if="header.title === 'Updates'" class="font-medium">
                            <tooltip v-if="item.updates && item.updates.interactionName" on="focus" bottom>
                                <template #content>
                                    <div class="notification-container">
                                        <h3>The <span>{{item.updates.interactionName}}</span> interaction has been updated:</h3>
                                        <ul>
                                            <li v-if="item.updates.txt">Some text has been changed</li>
                                            <li v-if="item.updates.newRefs.length">{{refsAddedTxt(item.updates.newRefs)}}</li>
                                            <li v-if="item.updates.loe">{{`The level of evidence has changed from ${item.updates.loe.old} to ${item.updates.loe.new}`}}</li>
                                            <li v-if="item.updates.rec">The recommendation has changed from <span :style="{color: getRecColor(item.updates.rec.old)}">{{item.updates.rec.old}}</span> to <span :style="{color: getRecColor(item.updates.rec.new)}">{{item.updates.rec.new}}</span></li>
                                        </ul>
                                    </div>
                                </template>
                                <bell-icon @click="removeUpdate(rowIdx, $event)" class="bell-icon" title="Interaction Update"/>
                            </tooltip>
                        </span>
                        <span v-else-if="header.field === 'at'">
                            {{ item[header.field] | moment('DD/MM/YYYY') }}
                        </span>
                        <span v-else-if="header.field === 'price'">
                            {{item.coin || '$'}}{{ item[header.field] }}
                        </span>
                        <span v-else-if="header.field === 'plan'">
                            {{ item[header.field] }}
                        </span>
                        <span v-else-if="header.field === 'until'">
                            {{ item[header.field] | moment('DD/MM/YYYY') }}
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
import Tooltip from '@/client/cmps/common/Tooltip';
import { interactionUIService } from '@/cms/services/interaction-ui.service';

import SortVerticalIcon from '@/client/cmps/common/icons/SortVerticalIcon';
import DeleteIcon from 'vue-material-design-icons/Delete';
import BellIcon from 'vue-material-design-icons/Bell';

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
        },
        removeUpdate(idx, ev){
            ev.target.style.color = '#133146'
            this.$emit('remove-update', idx)
        },
        refsAddedTxt(refs){
            const refTxt = refs.join()
            if(refs.length === 1) return `Reference ${refTxt} was added`
            return `References ${refTxt} were added`
        },
        getRecColor(rec){
            return interactionUIService.getInteractionColor(rec)
        }
    },
    components: {
        Tooltip,
        SortVerticalIcon,
        DeleteIcon,
        BellIcon,
        ModalWrap,
        ConfirmDelete
    }
}
</script>