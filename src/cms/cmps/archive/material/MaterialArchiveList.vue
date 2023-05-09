<template>
  <section class="material-list">
    <v-data-table :headers="headers" :items="materials">
      <template v-slot:body="{ items }">
        <tbody>
          <tr class="tr-material" v-for="item in items" :key="item._id">
            <td class="td-name-img">
              <router-link :to="`/archive/material/${item._id}`">
                <img
                  :src="require(`@/cms/assets/icons/${item.type}.svg`)"
                  :alt="item.type"
                  :title="item.type"
                />
                <span class="text-capitalize">{{item.name}}</span>
              </router-link>
            </td>

            <td class="td-type" width="80">
              <span class="text-capitalize">{{item.type}}</span>
            </td>

            <td width="180" align="center">
                <span v-if="item.deletedAt">{{ new Date(item.deletedAt) | timeFilter('DD/MM/YYYY')  }}</span>
            </td>

            <td class="td-actions" width="180" align="center">
              <v-btn
                class="mr-2"
                small
                color="primary"
                title="Restore material"
                @click="$emit('restore-material', {id: item._id, type: 'material', doRestore: true })"
              >
                <v-icon small>mdi-archive-arrow-up</v-icon>
              </v-btn>
              <v-btn
                small
                color="error"
                title="Delete material"
                @click="$emit('restore-material', { id: item._id, type: 'material', doRestore: false })"
              >
                <v-icon small>mdi-delete</v-icon>
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
  name: "materialList",
  props: {
    materials: Array,
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Type",
          value: "type",
        },
        {
          text: "Deleted At",
          value: "deletedAt",
          align: "center"
        },
        {
          text: "Actions",
          name: "Action",
          value: "action",
          sortable: false,
          align: "center",
        },
      ],
    };
  }
};
</script>