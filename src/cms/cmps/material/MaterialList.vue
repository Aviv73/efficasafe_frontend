<template>
  <section class="material-list">
    <v-data-table
      :headers="headers"
      :items="materials"
      :server-items-length="totalItems"
      disable-sort
      :options.sync="options"
      :loading="loading"
      :items-per-page="15"
      :footer-props="{
        'items-per-page-options': [ 15, 50, -1 ]
      }"
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
                  :src="require(`@/cms/assets/icons/${item.type || 'drug'}.svg`)"
                  :alt="item.type"
                  :title="item.type"
                />
                <span>{{ item.name }}</span>
              </router-link>
            </td>

            <td class="td-type" width="80">
              <router-link class="link-clean" :to="`/material/${item._id}`">
                <span class="text-capitalize">{{ item.type }}</span>
              </router-link>
            </td>

            <td class="td-actions d-flex align-center justify-center"  align="center">
              <v-checkbox
                class="mr-2"
                v-model="selected"
                :value="item._id"
                title="Toggle Material"
              />
              <v-btn small color="primary" :to="`/material/edit/${item._id}`">
                <v-icon small>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
    <v-fab-transition>
      <v-btn
          v-if="selected.length"
          :title="`Delete ${selected.length} materials`"
          @click="confirmDialog = true"
          color="error"
          fab
          fixed
          right
          bottom
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-dialog v-model="confirmDialog" max-width="400">
      <v-card>
          <v-card-title class="primary headline" style="color:white; font-weight:bold;">
            <v-icon dark left>mdi-delete</v-icon>
            Confirm delete
          </v-card-title>
          <v-card-text class="py-4" style="text-align: center;">
            Are you sure you want to delete {{ selected.length }} materials?
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="normal" @click="confirmDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="confirmDelete">Ok</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
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
      confirmDialog: false,
      selected: [],
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
          text: 'Actions',
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
    confirmDelete() {
      this.$emit('delete-many-materials', [ ...this.selected ]);
      this.selected = [];
      this.confirmDialog = false;
    },
    onSort(sortBy, isDesc) {
      this.$emit('header-clicked', { sortBy, isDesc });
    },
    isSortedBy(property) {
      return this.$route.query.sortBy === property;
    }
  }
};
</script>