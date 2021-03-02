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
              <router-link :to="`/cms/interaction/${item._id}`">
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
              </router-link>
            </td>
            <td class="td-side">
              <router-link :to="`/cms/interaction/${item._id}`">
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
              </router-link>
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

            <td class="td-actions" width="120" align="center">
              <v-btn
                small
                color="primary"
                :to="`/cms/interaction/edit/${item._id}`"
              >
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
    onSort(sortBy, isDesc) {
      this.$emit('header-clicked', { sortBy, isDesc });
    },
    isSortedBy(property) {
      return this.$route.query.sortBy === property;
    }
  }
};
</script>