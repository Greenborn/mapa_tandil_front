<template>
    <ToastsCtrl ref="toasts_ref" @btn_click="toast_btn_click"/>
    <div class="cont-modal">
        
        <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" 
            style="height: calc(100vh - 3.5rem)">
            <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

            <ol-tile-layer><ol-source-osm /></ol-tile-layer>

            <ol-vector-layer>
                <ol-source-vector ref="vectorsource" :projection="projection">
                    <ol-feature v-for="marcador in marcadores" :key="marcador">
                        <ol-geom-point :coordinates="marcador?.coordinate"></ol-geom-point>
                        <ol-style>
                            <ol-style-icon :src="marcador?.icon" :scale="marcador?.size"></ol-style-icon>
                        </ol-style>
                    </ol-feature>

                    <ol-interaction-draw v-if="drawEnable" :type="drawType" @drawend="drawend">
                        <ol-style>
                            <ol-style-stroke color="blue" :width="2"></ol-style-stroke>
                            <ol-style-fill color="rgba(255, 255, 0, 0.4)"></ol-style-fill>
                            <ol-style-circle :radius="5">
                                <ol-style-fill color="#00dd11" />
                                <ol-style-stroke color="blue" :width="2" />
                            </ol-style-circle>
                        </ol-style>
                    </ol-interaction-draw>
                </ol-source-vector>

                <ol-style>
                    <ol-style-stroke color="red" :width="2"></ol-style-stroke>
                    <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
                    <ol-style-circle :radius="7">
                        <ol-style-fill color="red"></ol-style-fill>
                    </ol-style-circle>
                </ol-style>
            </ol-vector-layer>

        </ol-map>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ToastsCtrl from './ToastsCtrl.vue';

defineExpose({ update_context })

const context = ref({
    "ultimo_enlace": null,
    "proceso_actual": ""
})
const toasts_ref = ref(null)
const vectorsource = ref(null);
const view = ref(null);
//import markerIcon from "@/assets/logo.png";

const center = ref([-59.135030396398676, -37.33961347533027]);
const projection = ref('EPSG:4326');
const zoom = ref(15);
const rotation = ref(0);
const drawEnable = ref(false);
const drawType = ref("Point");

const marcadores = ref([])

function new_reclamo_p1(){
    toasts_ref.value.present({
        title: 'Nuevo Reclamo', title_small: 'Paso 1',
        close_btn: false,
        msg: 'Haga click en la ubicación del mapa.'
    })

    drawEnable.value = true
}

async function update_context(contexto) {
    context.value = contexto
    const ultimo_enlace = context.value?.ultimo_enlace
    //console.log(ultimo_enlace?.id)
    if (ultimo_enlace?.id === "NEW_RECLAMO") {
        context.value.proceso_actual = "NEW_RECLAMO"
        new_reclamo_p1()
    }
}

function toast_btn_click(evnt){
    
    if (context.value.proceso_actual === "NEW_RECLAMO"){
        if (evnt){
            //se avanza a paso 3
        } else {
            //Se vuelve a paso 1
            new_reclamo_p1()
        }
    }
}

function drawend(event) {
    console.log(event)
    drawEnable.value = false
    toasts_ref.value.present({
        title: 'Nuevo Reclamo', title_small: 'Paso 2',
        close_btn: false, confirm_btn: true,
        msg: '¿Confirma la ubicación seleccionada?',
    })
}
</script>