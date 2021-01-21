<template>
  <section class="label-list">
    <v-data-table
      :headers="headers"
      :items="labels" 
      :server-items-length="totalItems"
      :options.sync="options"
      disable-sort
      :loading="loading"
      :items-per-page="15"
      :footer-props="{
        'items-per-page-options': [ 15, 50, -1 ]
      }"
    >
      <template v-slot:[`header.name`]="{ header }">
        <label class="list-header">
          <input type="checkbox" hidden @change="onSort(header.value, $event.target.checked)" />
          {{ header.text }}
          <v-icon class="icon" :class="{ 'icon-active': isSortedBy(header.value) }">mdi-arrow-down</v-icon>
        </label>
      </template>
      <template v-slot:[`header.isSuper`]="{ header }">
        <label class="list-header">
          <input type="checkbox" hidden @change="onSort(header.value, $event.target.checked)" />
          {{ header.text }}
          <v-icon class="icon" :class="{ 'icon-active': isSortedBy(header.value) }">mdi-arrow-down</v-icon>
        </label>
      </template>

      <template v-slot:body="{ items }">
        <tbody>
          <tr class="tr-label" v-for="item in items" :key="item._id">
            <td class="td-name-img">
              <router-link :to="`/label/${item._id}`">
                <img
                  :src="require(`@/assets/icons/custom.svg`)"
                  alt="Label"
                  title="Label"
                />
                <span class="text-capitalize">{{ item.name }}</span>
              </router-link>
            </td>

            <td width="80" class="centered">
              <v-checkbox 
                class="tr-label-checkbox"
                disabled
                readonly 
                :ripple="false"
                :input-value="item.isSuper" 
              ></v-checkbox>
            </td>

            <td class="td-color" width="80">
              <div
                class="color-circle v-chip"
                :style="{ backgroundColor: item.color }"
              ></div>
            </td>

            <td class="td-actions" width="120" align="center">
              <v-btn small color="primary" :to="`/label/edit/${item._id}`">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </section>
</template>

<script>
export default {
  name: 'labelList',
  props: {
    labels: {
      type: Array,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    options() {
      if (this.isMounted) {
        let { itemsPerPage, page } = this.options;
        const filterBy = {
          limit: (itemsPerPage < 0) ? 0 : itemsPerPage,
          page: --page
        };
        this.$emit('options-updated', JSON.parse(JSON.stringify(filterBy)));
      } else {
        this.isMounted = true;
      }
    }
  },
  data() {
    return {
      isMounted: false,
      options: {},
      isDesc: true,
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Is Super',
          value: 'isSuper',
          align: 'center',
          sortable: false
        },
        {
          text: 'Color',
          value: 'color',
          align: 'center',
          sortable: false
        },
        {
          text: 'Action',
          name: 'Action',
          value: 'action',
          sortable: false,
          align: 'center'
        },
      ],
    };
  },
  methods: {
    onSort(sortBy, isDesc) {
      this.$emit('header-clicked', { sortBy, isDesc });
    },
    isSortedBy(property) {
      return this.$route.query.sortBy === property;
    }
  }
};
</script>