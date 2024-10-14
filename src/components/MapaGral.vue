<template>
    <ToastsCtrl ref="toasts_ref" @btn_click="toast_btn_click" />
    <DetallePunto  :info="selected" @close="select_none"/>
    <div class="cont-modal">
        <ol-map :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" style="height: calc(100vh - 3.5rem)"
            ref="map_ref">
            <ol-view ref="view" :center="center" :rotation="rotation" :zoom="zoom" :projection="projection" />

            <ol-tile-layer><ol-source-osm /></ol-tile-layer>

            <ol-vector-layer>
                <ol-source-vector ref="vectorsource" :projection="projection">
                    <ol-feature v-for="marcador in marcadores" :key="marcador" :properties="marcador">
                        <ol-geom-point :coordinates="marcador?.coordinate"></ol-geom-point>
                        <!--<ol-style>
                            <ol-style-icon :src="marcador?.icon" :scale="marcador?.size"></ol-style-icon>
                        </ol-style>-->
                        <ol-style>
                            <ol-style-stroke color="red" :width="2"></ol-style-stroke>
                            <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
                            <ol-style-circle :radius="15">
                                <ol-style-fill color="red"></ol-style-fill>
                            </ol-style-circle>
                        </ol-style>
                    </ol-feature>

                    <ol-interaction-draw v-if="drawEnable" :type="drawType" @drawend="drawend">
                        <ol-style>
                            <ol-style-stroke color="blue" :width="2"></ol-style-stroke>
                            <ol-style-fill color="rgba(255, 255, 0, 0.4)"></ol-style-fill>
                            <ol-style-circle :radius="7">
                                <ol-style-fill color="#00dd11" />
                                <ol-style-stroke color="blue" :width="2" />
                            </ol-style-circle>
                        </ol-style>
                    </ol-interaction-draw>

                    <ol-interaction-select @select="featureSelected" :condition="selectCondition">
                        <ol-style>
                            <ol-style-circle :radius="7">
                                <ol-style-stroke color="green" :width="15"></ol-style-stroke>
                                <ol-style-fill color="rgba(255,255,255,0.5)"></ol-style-fill>
                            </ol-style-circle>
                        </ol-style>
                    </ol-interaction-select>
                </ol-source-vector>

                <ol-style>
                    <ol-style-stroke color="red" :width="2"></ol-style-stroke>
                    <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
                    <ol-style-circle :radius="7">
                        <ol-style-fill color="red"></ol-style-fill>
                    </ol-style-circle>
                </ol-style>

                <ol-overlay :position="selectedCityPosition" v-if="selectedTitulo != '' && !drawEnable">
                    <template v-slot="slotProps">
                        <div class="overlay-content">
                            {{ selectedTitulo }} {{ slotProps.position }}
                        </div>
                    </template>
                </ol-overlay>
            </ol-vector-layer>

        </ol-map>
    </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import ToastsCtrl from './ToastsCtrl.vue';
//import markerIcon from "@/assets/logo.png";
import { get_reclamos, new_reclamo } from '@/api/reclamos'
import DetallePunto from './DetallePunto.vue';

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

const extent = inject("ol-extent");
const selectConditions = inject("ol-selectconditions")
const selectCondition = selectConditions.SingleClick;
const selectedTitulo = ref("");
const selectedCityPosition = ref([]);
const selected = ref(null)

const center = ref([-59.135030396398676, -37.33961347533027]);
const projection = ref('EPSG:4326');
const zoom = ref(15);
const rotation = ref(0);

const drawEnable = ref(false);
const drawType = ref("Point");
const ultimo_punto = ref(null);

const marcadores = ref([])

const selectedFeatures = ref([]);

function select_none(){
    selected.value = null
    drawEnable.value = false
}

const featureSelected = (event) => {
      if (event.selected.length == 1) {
        selectedCityPosition.value = extent.getCenter(
          event.selected[0].getGeometry().extent_
        );
        selected.value = event.selected[0].values_
        try {
            view.value.setCenter(JSON.parse(selected.value.posicion))
        } catch (error) {
            console.log()
        }
        
        selectedTitulo.value = event.selected[0].values_.titulo;
      } else {
        selectedTitulo.value = "";
        selected.value = null
      }

      selectedFeatures.value = event.selected;
    }


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
    if (ultimo_enlace?.id === "MAP") {
        update_reclamos()
        select_none()
    }

    if (ultimo_enlace?.id === "HELP") {
        select_none()
    }

    if (ultimo_enlace?.id === "NEW_RECLAMO") {
        select_none()
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
            //console.log(res_)
            if (res_.error === true)
                return alert(res_?.msg?.response?.data ? res_.msg.response.data : 'Error Interno, reintente luego')
            
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

async function update_reclamos() {
    marcadores.value = []
    context.value.action = ""
    context.value.ultimo_enlace = { id: "MAP" }
    context.value.proceso_actual = "MAP"
    let res = await get_reclamos()
    if (res.stat) {
        for (let i = 0; i < res.data.length; i++) {
            let reclamo = res.data[i]
            //console.log(reclamo)
            marcadores.value.push({ ...reclamo, coordinate: JSON.parse(reclamo.posicion) })
        }
    }
}

onMounted(async () => {
    await update_reclamos()
})
</script>

<style lang="scss" scoped>
.overlay-content {
  background: #4a0000 !important;
  color: white;
  box-shadow: 0 5px 10px rgb(2 2 2 / 20%);
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 1rem;
  font-weight: bold;
}
</style>