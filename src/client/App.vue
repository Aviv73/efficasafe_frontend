<template>
  <div id="app">
    <navbar />
    <router-view style="height: 100%;" />
  </div>
</template>

<script>
import Navbar from '@/client/cmps/Navbar';

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>