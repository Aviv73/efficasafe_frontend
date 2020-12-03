<template>
  <section class="label-list">
    <v-data-table :headers="headers" :items="labels" :search="search">
      <template v-slot:body="{ items }">
        <tbody>
          <tr class="tr-label" v-for="item in items" :key="item._id">
            <td class="td-name-img">
              <router-link :to="`/archive/label/${item._id}`">
                <img
                  :src="require(`@/assets/icons/custom.svg`)"
                  alt="label icon"
                  title="Label"
                />
                <span class="text-capitalize">{{item.name}}</span>
              </router-link>
            </td>

            <td class="td-color" width="80">
              <div class="color-circle" :style="{ backgroundColor: item.color }"></div>
            </td>

            <td class="td-actions" width="120" align="center">
              <v-btn
                small
                color="primary"
                @click="$emit('restore-label', { id: item._id, type: 'label' })"
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