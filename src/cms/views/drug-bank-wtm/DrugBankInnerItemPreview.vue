<template>
  <li class="wtm-inner-item-preview width-all">
    <div class="header width-all flex align-center space-between" :class="{'marked-row': item.wtmProcessDone}">
      <p>{{item.affected_drug.name}}</p>
      <div class="flex align-center justify-end gap10">
        <v-btn
            color="primary" 
            x-small
            title="Mark as done"
            @click="emitDone(item._id)"
        >
            <v-icon x-small v-if="!item.wtmProcessDone">Done</v-icon>
            <v-icon x-small v-else>un Done</v-icon>
        </v-btn>
        <v-btn 
            color="primary" 
            x-small
            title="View interaction"
            :to="`/d-bank-interaction/${item.dbankInteractionId}`"
        >
            <v-icon x-small>mdi-eye</v-icon>
        </v-btn>
      </div>
    </div>
  </li>
</template>

<script>
import { eventBus } from '@/cms/services/eventBus.service';
export default {
  name: 'DrugBankInnerItemPreview',
  props: {
    item: {
      type: Object,
      required: true
    },
  },
  methods: {
      emitDone(id) {
          eventBus.$emit('dBankWtmProcessIsDone', id);
      },
  }
}
</script>

<style lang="scss">
.wtm-inner-item-preview {
  .header {
    border-radius: 2px;
    background-color: #fff;
    padding: 10px;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1) !important;
    height: 20px;
    p {
      margin: 0;
    }
  }
}
</style>