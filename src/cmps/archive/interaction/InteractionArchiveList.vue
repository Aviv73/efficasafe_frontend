<template>
  <section class="interaction-list">
    <v-data-table :headers="headers" :items="interactions" :search="search">
      <template v-slot:body="{ items }">
        <tbody>
          <tr class="tr-interaction" v-for="item in items" :key="item._id">
            <td class="td-side">
              <router-link :to="`/interaction/${item._id}`">
                <div v-if="item.side1Material">
                  <img
                    :src="
                      require(`@/assets/icons/${item.side1Material.type}.svg`)
                    "
                    :alt="item.side1Material.type"
                    :title="item.side1Material.type"
                  />
                  <span class="text-capitalize">{{
                    item.side1Material.name
                  }}</span>
                </div>
                <div v-else>
                  <img
                    :src="require(`@/assets/icons/custom.svg`)"
                    alt="label icon"
                    title="Label"
                  />
                </div>
              </router-link>
            </td>
            <td class="td-side">
              <router-link :to="`/interaction/${item._id}`">
                <div v-if="item.side2Material">
                  <img
                    :src="
                      require(`@/assets/icons/${item.side2Material.type}.svg`)
                    "
                    :alt="item.side2Material.type"
                    :title="item.side2Material.type"
                  />
                  <span class="text-capitalize">{{
                    item.side2Material.name
                  }}</span>
                </div>
                <div v-if="item.side2Label">
                  <img
                    :src="require(`@/assets/icons/${item.side2Label.src}.svg`)"
                    :alt="item.side2Label.src"
                    :title="item.side2Label.src"
                  />
                  <span class="text-capitalize">{{
                    item.side2Label.name
                  }}</span>
                </div>
                <div class="side-name-img" v-if="item.side2DraftName">
                  <img
                    :src="require(`@/assets/icons/draftname.svg`)"
                    :alt="item.side2DraftName"
                    :title="item.side2DraftName"
                  />
                  <span class="text-capitalize">{{ item.side2DraftName }}</span>
                </div>
              </router-link>
            </td>

            <td class="td-actions" width="120" align="center">
              <v-btn
                small
                color="primary"
                @click="
                  $emit('restore-interaction', {
                    id: item._id,
                    type: 'interaction',
                  })
                "
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
  name: 'interactionList',
  props: {
    interactions: Array,
  },
  data() {
    return {
      search: '',
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
          text: 'Action',
          name: 'Action',
          value: 'action',
          sortable: false,
          align: 'center',
        },
      ],
    };
  },
};
</script>