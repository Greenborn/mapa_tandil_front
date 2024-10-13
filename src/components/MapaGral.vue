<template>
    <ToastsCtrl ref="toasts_ref" @btn_click="toast_btn_click" />
    <div class="cont-modal">
        <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: calc(100vh - 3.5rem)"
            ref="map_ref">
            <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

            <ol-tile-layer><ol-source-osm /></ol-tile-layer>

            <ol-vector-layer>
                <ol-source-vector ref="vectorsource" :projection="projection">
                    <ol-feature v-for="marcador in marcadores" :key="marcador">
                        <ol-geom-point :coordinates="marcador?.coordinate"></ol-geom-point>
                        <!--<ol-style>
                            <ol-style-icon :src="marcador?.icon" :scale="marcador?.size"></ol-style-icon>
                        </ol-style>-->
                        <ol-style>
                            <ol-style-stroke color="red" :width="2"></ol-style-stroke>
                            <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
                            <ol-style-circle :radius="7">
                                <ol-style-fill color="red"></ol-style-fill>
                            </ol-style-circle>
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
import { ref, onMounted } from 'vue';
import ToastsCtrl from './ToastsCtrl.vue';

import { get_reclamos, new_reclamo } from '@/api/reclamos'

defineExpose({ update_context })
const emit = defineEmits(['navigate'])

const context = ref({
    "ultimo_enlace": null,
    "proceso_actual": "",
    "proceso_paso_actual": 0
})
const ultima_posicion = ref([])
const toasts_ref = ref(null)
const vectorsource = ref(null);
const map_ref = ref(null)
const view = ref(null);
//import markerIcon from "@/assets/logo.png";

const center = ref([-59.135030396398676, -37.33961347533027]);
const projection = ref('EPSG:4326');
const zoom = ref(15);
const rotation = ref(0);

const drawEnable = ref(false);
const drawType = ref("Point");
const ultimo_punto = ref(null);

const marcadores = ref([])

function new_reclamo_p1() {
    if (ultimo_punto.value !== null)
        vectorsource.value.source.removeFeature(ultimo_punto.value)

    toasts_ref.value.present({
        title: 'Nuevo Reclamo', title_small: 'Paso 1',
        close_btn: false, confirm_btn: false,
        msg: 'Haga click en la ubicación del mapa.'
    })
    context.value.proceso_paso_actual = 1
    drawEnable.value = true
}

function new_reclamo_p2() {
    drawEnable.value = false
    context.value.proceso_paso_actual = 2
    toasts_ref.value.present({
        title: 'Nuevo Reclamo', title_small: 'Paso 2',
        close_btn: false, confirm_btn: true,
        msg: '¿Confirma la ubicación seleccionada?',
    })
}

async function update_context(contexto) {
    context.value = { ...context.value, ...contexto }
    const ultimo_enlace = context.value?.ultimo_enlace
    context.value.proceso_actual = ultimo_enlace?.id
    //console.log(ultimo_enlace?.id)
    if (ultimo_enlace?.id === "NEW_RECLAMO") {
        new_reclamo_p1()
    } else {
        if (ultimo_punto.value !== null)
            vectorsource.value.source.removeFeature(ultimo_punto.value)
        toasts_ref.value.dissmiss()
    }

    if (context.value?.action === "NEW_RECLAMO" && context.value?.form_reclamo_data) {
        context.value.form_reclamo_data['posicion'] = ultima_posicion.value
        let res_ = await new_reclamo(context.value?.form_reclamo_data)
        if (res_.stat) {
            await update_reclamos()
            alert("Reclamo subido correctamente.")
        } else {
            alert(res_.error)
        }
    }
}

function toast_btn_click(evnt) {
    if (context.value.proceso_actual === "NEW_RECLAMO") {
        if (evnt)
            new_reclamo_p3()
        else
            new_reclamo_p1()
    }
}

function new_reclamo_p3() {
    toasts_ref.value.dissmiss()
    context.value.proceso_paso_actual = 3
    emit('navigate', { id: 'RECLAMO_PASO_3' })
}

function drawend(event) {
    ultimo_punto.value = event.feature
    ultima_posicion.value = event.feature.values_.geometry.flatCoordinates

    if (context.value.proceso_actual === "NEW_RECLAMO") {
        new_reclamo_p2()
    }
}

async function update_reclamos(){
    marcadores.value = []
    let res = await get_reclamos()
    if (res.stat) {
        for (let i=0; i < res.data.length; i++) {
            let reclamo = res.data[i]
            //console.log(reclamo)
            marcadores.value.push({...reclamo, coordinate: JSON.parse(reclamo.posicion) })
        }
    }
}

onMounted(async () => {
    await update_reclamos()
})
</script>