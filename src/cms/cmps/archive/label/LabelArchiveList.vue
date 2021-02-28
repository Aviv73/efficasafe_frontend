<template>
  <section class="label-list">
    <v-data-table :headers="headers" :items="labels" :search="search">
      <template v-slot:body="{ items }">
        <tbody>
          <tr class="tr-label" v-for="item in items" :key="item._id">
            <td class="td-name-img">
              <router-link :to="`/cms/archive/label/${item._id}`">
                <img
                  :src="require(`@/cms/assets/icons/custom.svg`)"
                  alt="label icon"
                  title="Label"
                />
                <span class="text-capitalize">{{item.name}}</span>
              </router-link>
            </td>

            <td class="td-color" width="80">
              <div class="color-circle" :style="{ backgroundColor: item.color }"></div>
            </td>

            <td class="td-actions" width="180" align="center">
              <v-btn
                class="mr-2"
                small
                color="primary"
                title="Restore label"
                @click="$emit('restore-label', { id: item._id, type: 'label', doRestore: true })"
              >
                <v-icon small>mdi-archive-arrow-up</v-icon>
              </v-btn>
              <v-btn
                small
                color="error"
                title="Delete label"
                @click="$emit('restore-label', { id: item._id, type: 'label', doRestore: false })"
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
  name: "labelList",
  props: {
    labels: Array,
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
          text: "Color",
          value: "color",
          align: "center",
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
  },
};
</script>