<template>
  <li class="wtm-item-preview width-all" :class="{'marked-row': item.wtmProcessDone}">
    <div class="header width-all flex align-center space-between" @click="showInnerList = !showInnerList">
      <p>{{item.name}}</p>
      <div class="flex align-center gpa5 justify-end">
        <p>{{item.wtmProcessDoneCount}} / {{item.count}}</p>
        <!-- <v-icon class="icon" :class="{ 'icon-active': showInnerList }">mdi-arrow-down</v-icon> -->
      </div>
    </div>
    <div class="inner-list" v-show="showInnerList">
      <ItemSearchList
        :itemsData="itemsData"
        :initFilterBy="filterBy"
        @filter="loadList"
        :singlePreviewCmp="DrugBankInnerItemPreview"
        :isLoading="isLoading"
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
      DrugBankInnerItemPreview,
      showInnerList: false,
      isLoading: false,
      filterBy: {
          drugName: this.item.name,
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
  },
  methods: {
    async loadList(filterBy) {
        if (!this.showInnerList && !this.didLoad) return;
        if (filterBy) this.filterBy = JSON.parse(JSON.stringify(filterBy));
        this.filterBy.drugName = this.item.name;
        this.isLoading = true;
        this.itemsData = await this.$store.dispatch({ type: 'getDbankWtmInnerListData', filterBy: this.filterBy });
        this.isLoading = false;
        this.didLoad = true
    },
    toggleIntDone(id, val) {
      const int = this.itemsData.items.find(c => c._id === id);
        if (!int) return;
      if (val === undefined) val = !int.wtmProcessDone;
      // int.wtmProcessDone = !int.wtmProcessDone;
      int.wtmProcessDone = val;
    },
    openListEmited(name) {
      if (name !== this.item.name) return;
      this.showInnerList = true;
      this.loadList();
    }
  },
  watch: {
    showInnerList(val) {
      if (!this.didLoad) this.loadList();
      eventBus.$emit('viewdListToggled', this.item.name, val);
    }
  },
  created() {
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