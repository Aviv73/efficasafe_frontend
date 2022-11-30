<template>
  <keep-alive>
    <SearchEngine/>
  </keep-alive>
</template>

<script>
import SearchEngine from './SearchEngine.vue';
export default {
  name: 'SearchEngineKeepAlive',
  components: { SearchEngine }
}
</script>
