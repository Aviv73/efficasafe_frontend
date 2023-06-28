<template>
  <div class="item-page flex align-center gap15 column flex-1">
    <div class="width-all flex align-center space-between wrap gap10">
      <ItemFilter :initFilter="filterBy" @filtered="setFilter"/>
      <!-- <router-link v-if="newItemPageName" :to="{name: newItemPageName}"><button class="btn secondary mid">{{$t('addNew')}}</button></router-link> -->
    </div>
    <template v-if="!isLoading && items && items.length">
      <ItemList 
        v-if="items"
        class="width-all height-all" :items="items"
        :singlePreviewCmp="singlePreviewCmp"
        :itemDetailesPageName="itemDetailesPageName"
      />
        <!-- @edit="item => $emit('edit', item)"
        @remove="id => $emit('remove', id)" -->
      <PaginationBtns v-if="filterBy" :total="totalItems" :perPage="filterBy.pagination.limit" :initFilter="filterBy" @filtered="setFilter" v-model="filterBy.pagination.page"/>
    </template>
    <div v-else-if="!isLoading" class="flex column space-between align-center no-results-preview">
      <!-- <h3>{{$t('noItemsFound')}}...</h3> -->
      <h3>No items found...</h3>
      <router-link v-if="newItemPageName" :to="{name: newItemPageName}">
        <!-- <button v-if="isFilterEmpty || true" class="btn big primary">{{$t('createNew')}}!</button>   -->
      </router-link>
    </div>
    <Loader v-if="showLoader && isLoading"/>
  </div>
</template>

<script>
import ItemFilter from './ItemFilter.vue';
import ItemList from './ItemList.vue';
import PaginationBtns from './PaginationBtns.vue';
import { setDeepVal, deepIterateWithObj } from './util.service.js';

// import { basicStoreService } from '@/modules/common/services/basic-store.service';
import Loader from '../../../../client/cmps/common/BluredLoader.vue';

export default {
  name: 'ItemSearchList',
  props: {
    initFilterBy: {
      type: Object,
      default: () => {}
    },
    itemsData: [Object],
    itemDetailesPageName: [String],
    newItemPageName: [String],
    singlePreviewCmp: [Object],
    isLoading: [Boolean],
    showLoader: {
      type: Boolean,
      default: true
    },
    dontRoute: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      filterBy: null,
      dontEmit: false
    }
  },
  watch: {
    filterBy: {
      deep: true,
      handler(filterVal) {
        if (this.dontEmit) return;
        if (!this.dontRoute) {
          const query = {};
          deepIterateWithObj(filterVal, (key, val) => {
            if (this.$route.query[key] != val) query[key] = val;
          }, '_');
          if (Object.keys(query).length) this.$router.push({ query: { ...this.$route.query, ...query} });
        }
        this.$emit('filter', this.filterBy);
      }
    },
  },
  methods: {
    setFilter(filter) {
      const newFilter = JSON.parse(JSON.stringify(filter));
      if (![newFilter?.filter?.search, this.filterBy?.filter?.search].includes(undefined)) {
        if (newFilter.filter.search !== this.filterBy.filter.search) newFilter.pagination.page = 0;
      }
      this.filterBy = newFilter;
    },
    initFilter() {
      const filterByToSet = JSON.parse(JSON.stringify(this.initFilterBy));
      if (!this.dontRoute) {
        const queryParams = this.$route.query;
        deepIterateWithObj(filterByToSet, (key) => {
          let valToSet = +queryParams[key];
          if (isNaN(valToSet)) valToSet = queryParams[key]
          if (queryParams[key]) setDeepVal(filterByToSet, key, valToSet, '_');
        }, '_');
      }
      this.dontEmit = true;
      this.filterBy = filterByToSet;
      setTimeout(() => {
        this.dontEmit = false;
      }, 1);
    }
  },
  computed: {
    items() {
      return this.itemsData.items;
    },
    totalItems() {
      return this.itemsData.total;
    },
    // isFilterEmpty() {
    //   return false;
    //   // return JSON.stringify(this.filterBy) === JSON.stringify(basicStoreService.initFilterBy())
    // }
  },
  created() {
    this.initFilter();
  },
  components: { ItemFilter, ItemList, PaginationBtns, Loader, }
}
</script>

<style lang="scss">
// @import '@/assets/styles/global/index';
.dark-theme {
  .item-preview {
    color: black;
  }
}
.item-page {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  // width: 300px;
  width: 100%;
  .item-list {
    // flex: 1;
    overflow-y: auto;
    width: 100%;
    padding: 0;
    .item-preview {
      width: rem(300px);
      max-width: 98%;
      height: 200px;
      border-radius: 5px;
      background-color: #fff;
      color: black;
      input {
        color: black;
      }
      // box-shadow: $light-shadow;
      padding: 20px;
      overflow-y: auto;
      overflow-x: hidden;

      @media (max-width: 400px) {
        width: 98%;
        // max-width: unset;
        // border-radius: 0;
      }
    }
  }

  .no-results-preview {
    // height: 35%;;
    // margin: 100px 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .pagination-btns {
    margin-bottom: 10px;
  }
}
</style>