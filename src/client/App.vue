<template>
  <div id="app">
    <navbar />
    <router-view />
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