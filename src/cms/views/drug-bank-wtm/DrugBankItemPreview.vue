<template>
  <li class="wtm-item-preview width-all" :class="{'marked-row': item.wtmProcessDone}" v-if="state">
    <div class="header width-all flex align-center space-between" @click="state.showInnerList = !state.showInnerList">
      <p>{{item.name}}</p>
      <div class="flex align-center gpa5 justify-end">
        <p>{{item.wtmProcessDoneCount}} / {{item.count}}</p>
        <!-- <v-icon class="icon" :class="{ 'icon-active': state.showInnerList }">mdi-arrow-down</v-icon> -->
      </div>
    </div>
    <div class="inner-list" v-show="state.showInnerList">
      <ItemSearchList
        :itemsData="state.itemsData"
        :initFilterBy="state.filterBy"
        @filter="loadList"
        :singlePreviewCmp="DrugBankInnerItemPreview"
        :isLoading="state.isLoading"
        :showLoader="false"
        :dontRoute="true"
      />
    </div>
  </li>
</template>

<script>
import ItemSearchList from '../../cmps/common/ItemSearchList/ItemSearchList.vue';
import DrugBankInnerItemPreview from './DrugBankInnerItemPreview.vue';
import { eventBus } from '@/cms/services/eventBus.service';

const globalStates = {}

function initState(item) {
  return {
      showInnerList: false,
      isLoading: false,
      filterBy: {
          drugName: item.name,
          filter: {
              search: '',
              params: {}
          },
          pagination: {
              page: 0,
              limit: 10,
          },
          sort: {
              'affected_drug.name': 1
          },
      },
      itemsData: { items: [], total: 0 },
      didLoad: false
    }
}

export default {
  components: { ItemSearchList },
  name: 'DrugBankItemPreview',
  props: {
    item: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      state: null,
      DrugBankInnerItemPreview
    }
  },
  methods: {
    async loadList(filterBy) {
        if (!this.state.showInnerList && !this.state.didLoad) return;
        if (filterBy) this.state.filterBy = JSON.parse(JSON.stringify(filterBy));
        this.state.filterBy.drugName = this.item.name;
        this.state.isLoading = true;
        this.state.itemsData = await this.$store.dispatch({ type: 'getDbankWtmInnerListData', filterBy: this.state.filterBy });
        this.state.isLoading = false;
        this.state.didLoad = true
    },
    toggleIntDone(id, val) {
      const int = this.state.itemsData.items.find(c => c._id === id);
        if (!int) return;
      if (val === undefined) val = !int.wtmProcessDone;
      // int.wtmProcessDone = !int.wtmProcessDone;
      int.wtmProcessDone = val;
    },
    openListEmited(name) {
      if (name !== this.item.name) return;
      this.state.showInnerList = true;
      this.loadList();
    }
  },
  watch: {
    'state.showInnerList'(val) {
      if (!this.state.didLoad) this.loadList();
      eventBus.$emit('viewdListToggled', this.item.name, val);
    }
  },
  created() {
    if (!globalStates[this.item.name]) {
      globalStates[this.item.name] = initState(this.item);
    }
    this.state = globalStates[this.item.name];
    eventBus.$on('doneTogglingInt', this.toggleIntDone);
    eventBus.$on('openDbankMatWtmInnerList', this.openListEmited);
  },
  destroyed() {
    eventBus.$off('doneTogglingInt', this.toggleIntDone);
    eventBus.$off('openDbankMatWtmInnerList', this.openListEmited);
  }
}
</script>

<style lang="scss">
.wtm-item-preview {
  &.marked-row {
    background-color:  rgb(255, 255, 112);
  }
  .header {
    padding: 10px;
    box-shadow: 0px 0px 10px 1px rgba(0,0,0,0.1);
    height: 40px;
  }
  .inner-list {
    background-color: #2196F3;
    padding-inline-start: 30px;
    padding-inline-end: 10px;

    .wtm-inner-item-preview {
      border-radius: 3px;
      .marked-row {
        background-color: rgb(255, 255, 112);
      }
    }
  }
  p {
    margin: 0;
  }
}
</style>