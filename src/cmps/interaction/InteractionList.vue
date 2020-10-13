<template>
  <section class="interaction-list">
    <v-data-table :headers="headers" :items="interactions" :search="search">
      <template v-slot:body="{ items }">
        <tbody>
          <tr class="tr-interaction" v-for="item in items" :key="item._id">
            <td class="td-side">
              <router-link :to="`/interaction/${item._id}`">
                <div class="side-name-img" v-if="item.side1MaterialId">
                  <img
                    :src="require(`@/assets/icons/${item.side1MaterialId.type}.svg`)"
                    :alt="item.side1MaterialId.type"
                    :title="item.side1MaterialId.type"
                  />
                  <span class="text-capitalize">{{item.side1MaterialId.name}}</span>
                </div>
                <div class="side-name-img" v-else>
                  <img
                    :src="require(`@/assets/icons/${item.side1LabelId.src}.svg`)"
                    :alt="item.side1LabelId.src"
                    :title="item.side1LabelId.src"
                  />
                  <span class="text-capitalize">{{item.side1LabelId.name}}</span>
                </div>
              </router-link>
            </td>
            <td class="td-side">
              <router-link :to="`/interaction/${item._id}`">
                <div class="side-name-img" v-if="item.side2MaterialId">
                  <img
                    :src="require(`@/assets/icons/${item.side2MaterialId.type}.svg`)"
                    :alt="item.side2MaterialId.type"
                    :title="item.side2MaterialId.type"
                  />
                  <span class="text-capitalize">{{item.side2MaterialId.name}}</span>
                </div>
                <div class="side-name-img" v-else>
                  <img
                    :src="require(`@/assets/icons/${item.side2LabelId.src}.svg`)"
                    :alt="item.side2LabelId.src"
                    :title="item.side2LabelId.src"
                  />
                  <span class="text-capitalize">{{item.side2LabelId.name}}</span>
                </div>
              </router-link>
            </td>
            <td class="td-active" align="center" @click="$emit('toggle-is-active', item._id )">
              <v-icon color="info" v-if="item.isActive">mdi-check-box-outline</v-icon>
              <v-icon v-else>mdi-checkbox-blank-off-outline</v-icon>
            </td>

            <td class="td-actions" width="120" align="center">
              <v-btn small color="primary" :to="`/interaction/edit/${item._id}`">
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
  name: "interactionList",
  props: {
    interactions: Array,
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Side 1",
          value: "side1MaterialId.name" || "side1LabelId.name",
        },
        {
          text: "Side 2",
          value: "side2MaterialId.name" || "side2LabelId.name",
        },
        {
          text: "Active",
          value: "isActive",
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