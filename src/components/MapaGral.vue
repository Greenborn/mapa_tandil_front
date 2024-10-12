<template>
    <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: 100vh">
        <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />
        <ol-context-menu-control :items="contextMenuItems" />
        <ol-tile-layer>
            <ol-source-osm />
        </ol-tile-layer>

        <ol-vector-layer>
            <ol-source-vector ref="vectorsource">
                <ol-feature v-for="marcador in marcadores" :key="marcador">
                    <ol-geom-point :coordinates="marcador?.coordinate"></ol-geom-point>
                    <ol-style>
                        <ol-style-icon :src="marcador?.icon" :scale="marcador?.size"></ol-style-icon>
                    </ol-style>
                </ol-feature>
            </ol-source-vector>
        </ol-vector-layer>

    </ol-map>
</template>

<script setup>
import { ref } from 'vue';

import markerIcon from "@/assets/logo.png";

const center = ref([-59.135030396398676, -37.33961347533027]);
const projection = ref('EPSG:4326');
const zoom = ref(15);
const rotation = ref(0);


const contextMenuItems = ref([]);
const vectorsource = ref(null);
const view = ref(null);

const marcadores = ref([])

contextMenuItems.value = [
    {
        text: "Centrar Mapa Aquí",
        callback: (val) => {
            view.value.setCenter(val.coordinate);
        },
    },
    {
        text: "Agregar Marcador",
        icon: markerIcon,
        callback: (val) => {
            marcadores.value.push({
                "coordinate": val.coordinate,
                "size": .1,
                "icon": markerIcon
            })
        },
    },
    "-", // this is a separator
]
</script>