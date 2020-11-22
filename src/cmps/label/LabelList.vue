<template>
  <section class="label-list">
    <v-data-table
      :headers="headers"
      :items="labels"
      :search="search"
      :sort-by.sync="sortBy"
      :sort-desc.sync="isDesc"
    >
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
    labels: Array,
  },
  data() {
    return {
      search: '',
      sortBy: 'isSuper',
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
};
</script>