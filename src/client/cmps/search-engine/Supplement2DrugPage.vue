<template>
  <section class="supp-2-drug-page">
    <interaction-list
      :interactions="interactions"
    />
  </section>
</template>

<script>
import InteractionList from '@/client/cmps/search-engine/InteractionList';

export default {
  props: {
    interactions: {
      type: Array,
      required: true
    }
  },
  components: {
    InteractionList
  }
}
</script>