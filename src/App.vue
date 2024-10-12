<template>
  <div class="container-fluid">
    <MapaGral />
  </div>
</template>

<script setup>
import MapaGral from './components/MapaGral.vue'

</script>

<style lang="scss">
//@import "primevue/resources/primevue.min.css";
//@import "./assets/_theme.scss";
// @import "~primevue/resources/themes/md-light-deeppurple/theme.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
