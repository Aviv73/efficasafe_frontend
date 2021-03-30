<template>
  <div id="app">
    <main>
      <navbar />
      <router-view />
    </main>
    <main-footer />
  </div>
</template>

<script>
import Navbar from '@/client/cmps/Navbar';
import MainFooter from '@/client/cmps/MainFooter';

export default {
  name: 'App',
  components: {
    Navbar,
    MainFooter
  }
}
</script>