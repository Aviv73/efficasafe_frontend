<template>
  <section class="material-list">
    <v-data-table :headers="headers" :items="materials">
      <template v-slot:body="{ items }">
        <tbody>
          <tr class="tr-material" v-for="item in items" :key="item._id">
            <td class="td-name-img">
              <router-link :to="`/archive/material/${item._id}`">
                <img
                  :src="require(`@/assets/icons/${item.type}.svg`)"
                  :alt="item.type"
                  :title="item.type"
                />
                <span class="text-capitalize">{{item.name}}</span>
              </router-link>
            </td>

            <td class="td-type" width="80">
              <span class="text-capitalize">{{item.type}}</span>
            </td>

            <td class="td-actions" width="120" align="center">
              <v-btn
                small
                color="primary"
                @click="$emit('restore-material', {id: item._id, type: 'material'})"
              >
                <v-icon small>mdi-archive-arrow-up</v-icon>
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
          text: "Action",
          name: "Action",
          value: "action",
          sortable: false,
          align: "center",
        },
      ],
    };
  },
};
</script>