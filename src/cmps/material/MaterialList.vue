<template>
  <section class="material-list">
    <v-data-table
      :headers="headers"
      :items="materials"
      :options.sync="options"
      :loading="loading"
    >
      <template v-slot:body="{ items }">
        <tbody>
          <tr class="tr-material" v-for="item in items" :key="item._id">
            <td class="td-name-img">
              <router-link :to="`/material/${item._id}`">
                <img
                  :src="require(`@/assets/icons/${item.type}.svg`)"
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
    materials: Array,
    loading: Boolean,
  },
  data() {
    return {
      isMounted: false,
      search: '',
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
    options: function () {
      if (this.isMounted) {
        this.$emit('options-updated', JSON.parse(JSON.stringify(this.options)));
      } else {
        this.isMounted = true;
      }
    },
  },
};
</script>