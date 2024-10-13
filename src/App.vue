<template>
  <div class="container-fluid">
    <MenuGral @btn_click="click_menu" />

    <MapaGral ref="mapa_ref" />

    <HelpPage v-if="ultimo_click_menu.id === 'HELP'" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

import MapaGral from './components/MapaGral.vue'
import MenuGral from './components/MenuGral.vue';
import HelpPage from './components/HelpPage.vue';

const mapa_ref = ref(null)
const ultimo_click_menu = ref({ id: "MAP" })

async function click_menu(enlace) {
  ultimo_click_menu.value = enlace
  await mapa_ref.value.update_context({ 'ultimo_enlace': enlace})
}

</script>

<style lang="scss">
.cont-modal{
  position: absolute;
  top: 0px;
  z-index: 1000;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding-top: 3.5rem;
  overflow: scroll;
}
</style>
