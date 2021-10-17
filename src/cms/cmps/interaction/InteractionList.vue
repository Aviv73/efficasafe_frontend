<template>
  <section class="interaction-list">
    <v-data-table 
      :headers="headers" 
      :items="interactions" 
      :server-items-length="totalItems"
      :options.sync="options"
      disable-sort
      :loading="loading"
      :items-per-page="50"
      :footer-props="{
        'items-per-page-options': [ 15, 50, -1 ]
      }"
    >
      <template v-slot:[`header.side1Material.name`]="{ header }">
        <label class="list-header">
          <input type="checkbox" hidden @change="onSort(header.value, $event.target.checked)" />
          {{ header.text }}
           <v-icon class="icon" :class="{ 'icon-active': isSortedBy(header.value) }">mdi-arrow-down</v-icon>
        </label>
      </template>
      <template v-slot:[`header.isActive`]="{ header }">
        <label class="list-header">
          <input type="checkbox" hidden @change="onSort(header.value, $event.target.checked)" />
          {{ header.text }}
           <v-icon class="icon" :class="{ 'icon-active': isSortedBy(header.value) }">mdi-arrow-down</v-icon>
        </label>
      </template>
      <template v-slot:body="{ items }">
        <tbody>
          <tr class="tr-interaction" v-for="item in items" :key="item._id">
            <td 
              class="td-side text-no-wrap text-truncate"
              style="max-width: 200px;"
              :title="item.side1Material.name"
            >
              <div @click="goToInteraction(item._id)">
                <div class="side-name-img" v-if="item.side1Material">
                  <img
                    :src="require(`@/cms/assets/icons/${item.side1Material.type}.svg`)"
                    :alt="item.side1Material.type"
                    :title="item.side1Material.type"
                  />
                  <span>
                    {{ item.side1Material.name }}
                  </span>
                </div>
              </div>
            </td>
            <td class="td-side">
              <div @click="goToInteraction(item._id)">
                <div class="side-name-img" v-if="item.side2Material">
                  <img
                    :src="
                      require(`@/cms/assets/icons/${item.side2Material.type}.svg`)
                    "
                    :alt="item.side2Material.type"
                    :title="item.side2Material.type"
                  />
                  <span class="text-capitalize">
                    {{ item.side2Material.name }}
                  </span>
                </div>
                <div class="side-name-img" v-else-if="item.side2Label">
                  <img
                    :src="require(`@/cms/assets/icons/custom.svg`)"
                    :alt="item.side2Label.src"
                    :title="item.side2Label.src"
                  />
                  <span class="text-capitalize">
                    {{ item.side2Label.name }}
                  </span>
                </div>
                <div class="side-name-img" v-else>
                  <img
                    :src="require(`@/cms/assets/icons/draftname.svg`)"
                    :alt="item.side2DraftName"
                    :title="item.side2DraftName"
                  />
                  <span class="text-capitalize">
                    {{ item.side2DraftName }}
                  </span>
                </div>
              </div>
            </td>
            <td
              class="td-active"
              align="center"
              @click="$emit('toggle-is-active', item._id)"
            >
              <v-icon color="info" v-if="item.isActive">
                mdi-check-box-outline
              </v-icon>
              <v-icon v-else>
                mdi-checkbox-blank-off-outline
              </v-icon>
            </td>

            <td class="td-actions d-flex align-center justify-center" align="center">
              <v-checkbox
                class="mr-4"
                v-model="selected"
                :value="item._id"
                title="Toggle Interaction"
              />
              <v-btn
                small
                color="primary"
                :to="`/interaction/edit/${item._id}`"
              >
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
          :title="`Delete ${selected.length} interactions`"
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
            Are you sure you want to delete {{ selected.length }} interactions?
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
  name: 'interactionList',
  props: {
    interactions: {
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
  data() {
    return {
      selected: [],
      confirmDialog: false,
      isMounted: false,
      options: {},
      headers: [
        {
          text: 'Side 1',
          value: 'side1Material.name',
        },
        {
          text: 'Side 2',
          value: 'side2Material.name' || 'side2Label.name',
        },
        {
          text: 'Active',
          value: 'isActive',
          align: 'center',
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
  methods: {
    confirmDelete() {
      this.$emit('delete-many-interactions', [ ...this.selected ]);
      this.selected = [];
      this.confirmDialog = false;
    },
    onSort(sortBy, isDesc) {
      this.$emit('header-clicked', { sortBy, isDesc });
    },
    isSortedBy(property) {
      return this.$route.query.sortBy === property;
    },
    goToInteraction(id){
      this.$store.commit({type:'setInteractionHeight', interactionPageHeight: window.pageYOffset})
      this.$router.push(`/interaction/${id}`)
    }
  }
};
</script>