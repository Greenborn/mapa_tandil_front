<template>
    <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: 100vh">
        <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

        <ol-tile-layer>
            <ol-source-osm />
        </ol-tile-layer>
    </ol-map>
</template>

<script setup>
import { ref } from 'vue';

const center = ref([ -59.135030396398676, -37.33961347533027 ]);
const projection = ref('EPSG:4326');
const zoom = ref(15);
const rotation = ref(0);

//const format = inject('ol-format');
//const geoJson = new format.GeoJSON();
</script>