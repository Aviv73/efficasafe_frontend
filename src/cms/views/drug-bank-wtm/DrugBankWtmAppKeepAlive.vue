<template>
  <keep-alive>
    <DrugBankWtmApp/>
  </keep-alive>
</template>

<script>
import DrugBankWtmApp from './DrugBankWtmApp.vue';
export default {
  name: 'DrugBankWtmAppKeepAlive',
  components: { DrugBankWtmApp }
}
</script>
