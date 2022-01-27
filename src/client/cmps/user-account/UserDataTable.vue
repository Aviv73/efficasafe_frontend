<template>
    <section class="user-data-table">
        <table>
            <thead>
                <tr>
                    <th
                        v-for="(header, idx) in headers"
                        :key="idx"
                        :class="{'txt-center': header.title === 'Link'}"
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
                            <tooltip class="bell-container" v-if="item.updates && item.updates.length" on="focus" bottom>
                                <template #content>
                                    <div class="notification-container">
                                        <div class="rapper" v-for="(update, idx) in item.updates" :key="idx">
                                            <h3>The <span>{{update.interactionName}}</span> interaction has been updated:</h3>
                                            <ul>
                                                <li v-if="update.txt">Some text has been changed</li>
                                                <li v-if="update.newRefs.length">{{refsAddedTxt(update.newRefs)}}</li>
                                                <li v-if="update.loe">{{`The level of evidence has changed from ${update.loe.old} to ${update.loe.new}`}}</li>
                                                <li v-if="update.rec">The recommendation has changed from <span :style="{'background-color': getRecColor(update.rec.old)}">{{update.rec.old}}</span> to <span :style="{'background-color': getRecColor(update.rec.new)}">{{update.rec.new}}</span></li>
                                            </ul>
                                            <hr v-if="idx !== item.updates.length-1">
                                        </div>
                                    </div>
                                </template>
                                <bell-icon @mousedown="removeUpdate(rowIdx, $event)" class="bell-icon" title="Interaction Update"/>
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
                        <span v-else-if="header.field === 'notes'" class="td-actions">
                            <button v-if="item" class="note-btn">
                                <img  title="Notes" v-if="item.notes && item.notes.length" @click.stop="openNoteModal(item)" class="note-img" src="@/client/assets/icons/sticky-note.svg" alt="">
                                <img  title="Add a note" v-else @click.stop="openNoteModal(item)" class="note-img" src="@/client/assets/icons/add-circle.svg" alt="">
                                <div class="notes-container" :id="item.at">
                                    <h3 class="notes-title">{{item.title | capitalize}}</h3>
                                    <button @click="closeNotes" class="close-notes-btn">Close</button>
                                    <div class="note-list">
                                        <div class="note-preview" v-for="(note, idx) in item.notes" :key="note.id">
                                            <button class="remove-note-btn" @click="onRemoveNote(idx)">+</button>
                                            <p class="date">{{note.date | moment('DD MMM YYYY | h:mm A')}}</p>
                                            <p contenteditable="true" @focusout="onSaveEditedNote(idx, $event)" class="txt">{{note.txt}}</p>
                                        </div>
                                    </div>
                                    <div class="add-note-container">
                                        <textarea @focusout="onSaveNote" class="notes-input" placeholder="Add note" v-model="newNoteTxt"></textarea>
                                        <button class="notes-btn" :class="{'show': isShowSaveBtn}" @click="onSaveNote">Save</button>
                                    </div>
                                </div>
                            </button>
                        </span>
                        <span v-else-if="header.field === 'url'" class="td-actions">
                            <router-link
                                class="search-link"
                                :to="getSearchLink(item['url'])"
                                title="View search"
                            >
                                View
                            </router-link>
                        </span>
                        <span v-else-if="!header.field && $route.name === 'Purchases'">
                            <button
                                class="end-subscrition-btn"
                                @click="onEndSubscription(item)"
                                v-if="item.until === 'Ongoing' && item.price !== 0"
                            >
                                End subscription
                            </button>
                            <p v-else-if="item.canceledAt">Subscription Canceled at: {{item.canceledAt | moment('DD/MM/YYYY')}}</p>
                        </span>
                        <span
                            class="flex-space-between td-actions"
                            v-else-if="!header.title"
                        >
                            <!-- <router-link
                                class="search-link"
                                :to="getSearchLink(item['url'])"
                                title="View search"
                            >
                                View
                            </router-link> -->
                            <!-- <button v-if="item" class="note-btn">
                                <img  title="Notes" v-if="item.notes && item.notes.length" @click.stop="openNoteModal(item)" class="note-img" src="@/client/assets/icons/sticky-note.svg" alt="">
                                <img  title="Add a note" v-else @click.stop="openNoteModal(item)" class="note-img" src="@/client/assets/icons/add-circle.svg" alt="">
                                <div class="notes-container" :id="item.at">
                                    <h3 class="notes-title">{{item.title | capitalize}}</h3>
                                    <button @click="closeNotes" class="close-notes-btn">Close</button>
                                    <div class="note-list">
                                        <div class="note-preview" v-for="(note, idx) in item.notes" :key="note.id">
                                            <button class="remove-note-btn" @click="onRemoveNote(idx)">+</button>
                                            <p class="date">{{note.date | moment('DD MMM YYYY | h:mm A')}}</p>
                                            <p contenteditable="true" @focusout="onSaveEditedNote(idx, $event)" class="txt">{{note.txt}}</p>
                                        </div>
                                    </div>
                                    <div class="add-note-container">
                                        <textarea @focusout="onSaveNote" class="notes-input" placeholder="Add note" v-model="newNoteTxt"></textarea>
                                        <button class="notes-btn" :class="{'show': isShowSaveBtn}" @click="onSaveNote">Save</button>
                                    </div>
                                </div>
                            </button> -->
                            <button
                                class="delete-btn"
                                title="Delete search"
                                @click="onRemove(item)"
                            >
                                <delete-icon title="" />
                            </button>
                        </span>
                    </td>
                </tr>
            </thead>
        </table>
        <modal-wrap
            v-if="isModalActive"
            :isActive="isModalActive"
            @close-modal="closeModal"
        >
            <aside class="confirm-delete">
                <confirm-delete
                    @close-modal="closeModal"
                    :itemToDelete="itemToDelete"
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
import { utilService } from '@/cms/services/util.service';

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
            itemToDelete: null,
            notesToShow: null,
            newNoteTxt: ''
        }
    },
    computed:{
        isShowSaveBtn(){
            if(this.newNoteTxt.split('').length) return true
            return false
        }
    },
    methods: {
        onSaveNote(){
            if(this.newNoteTxt === '') return 
            const newNote = {
                date: Date.now(),
                id: utilService.makeId(),
                txt: this.newNoteTxt
            }
            this.notesToShow.notes.unshift(newNote)
            this.$emit('save-note', this.notesToShow)
            this.newNoteTxt = ''
        },
        onSaveEditedNote(idx,ev){
            this.notesToShow.notes[idx].txt = ev.target.innerText
            this.$emit('save-note', this.notesToShow)
        },
        onRemoveNote(idx){
            this.notesToShow.notes.splice(idx, 1)
            this.$emit('save-note', this.notesToShow)
        },
        openNoteModal(item){
            if(this.notesToShow && this.notesToShow.at === item.at){
                this.closeNotes()
                return
            }
            if(this.notesToShow) document.getElementById(this.notesToShow.at).classList.remove('show')
            if(!item.notes) item.notes = []
            this.notesToShow = item
            document.getElementById(item.at).classList.add('show')
        },
        closeNotes(){
            document.getElementById(this.notesToShow.at).classList.remove('show')
            this.notesToShow = null
            this.newNoteTxt = ''
        },
        emitSort(sortBy, isDesc) {
            this.$emit('header-clicked', sortBy, isDesc);
        },
        emitDeleteItem() {
            this.$emit('item-deleted', this.itemToDelete);
            this.closeModal();
        },
        onRemove(item) {
            this.itemToDelete = item;
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
            const refTxt = this.formatRefs(refs)
            if(refs.length === 1) return `Reference ${refTxt} was added`
            return `References ${refTxt} were added`
        },
        formatRefs(refs){
            let refsStr = '';
            let isSequence = false;
            for (let i = 0; i < refs.length; i++) {
                if (refs[i - 1] === undefined) refsStr += refs[i];

                if (Math.abs(refs[i] - refs[i - 1]) > 1) {
                    if (isSequence) refsStr += '-' + (refs[i - 1]);
                    refsStr += ',' + refs[i];
                    isSequence = false;
                } else if (Math.abs(refs[i] - refs[i - 1]) === 1) isSequence = true;

                if (i === (refs.length - 1) && refs[i - 1] !== undefined && isSequence) {
                    refsStr += '-' + refs[i];
                }
            }
            return refsStr
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