<template>
  <section class="material-list">
    <v-data-table
      :headers="headers"
      :items="materials"
      :server-items-length="totalItems"
      disable-sort
      :options.sync="options"
      :loading="loading"
    >
      <template v-slot:[`header.name`]="{ header }">
        <th>
          <label class="list-header">
            <input type="checkbox" hidden @change="onSort('name', $event.target.checked)">
            {{ header.text }}
            <v-icon class="icon" :class="{ 'icon-active': isSortedBy(header.value) }">mdi-arrow-down</v-icon>
          </label>
        </th>
      </template>
      <template v-slot:[`header.type`]="{ header }">
        <th>
          <label class="list-header">
            <input type="checkbox" hidden @change="onSort('type', $event.target.checked)">
            {{ header.text }}
            <v-icon class="icon" :class="{ 'icon-active': isSortedBy(header.value) }">mdi-arrow-down</v-icon>
          </label>
        </th>
      </template>
      <template v-slot:body="{ items }">
        <tbody>
          <tr class="tr-material" v-for="item in items" :key="item._id">
            <td class="td-name-img">
              <router-link :to="`/material/${item._id}`">
                <img
                  :src="require(`@/assets/icons/${item.type || 'drug'}.svg`)"
                  :alt="item.type"
                  :title="item.type"
                />
                <span class="text-capitalize">{{ item.name }}</span>
              </router-link>
            </td>

            <td class="td-type" width="80">
              <router-link class="link-clean" :to="`/material/${item._id}`">
                <span class="text-capitalize">{{ item.type }}</span>
              </router-link>
            </td>

            <td class="td-actions" width="120" align="center">
              <v-btn small color="primary" :to="`/material/edit/${item._id}`">
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
  name: 'materialList',
  props: {
    materials: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isMounted: false,
      options: {},
      headers: [
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Type',
          value: 'type',
        },
        {
          text: 'Action',
          name: 'Action',
          value: 'action',
          sortable: false,
          align: 'center',
        },
      ],
    };
  },
  watch: {
    options () {
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
    },
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