<template>
    <div class="cont-gral-menu">
        <div class="row justify-content-center">
            <div class="col-auto">
                <div class="btn-group btn-group-sm" role="group">
                    <button type="button" v-for="enlace in ENLACES" :key="enlace.id" 
                        @click="emit('btn_click', enlace)" :class="enlace.class">{{ enlace.label }}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const ENLACES = [
    { label: 'Mapa', icon: '', class: 'btn btn-outline-primary', id: 'MAP' },
    { label: '¿Cómo se usa?', icon: '', class: 'btn btn-outline-primary', id: 'HELP' },
    { label: '+ Reclamo', icon: '', class: 'btn btn-outline-success', id: 'NEW_RECLAMO' },
    //{ label: '+ Evento', icon: '', class: 'btn btn-outline-success', id: 'NEW_EVENTO' },
]

const emit  = defineEmits(['btn_click'])
</script>

<style lang="scss" scoped>
.cont-gral-menu {
    position: absolute;
    top: 0px;
    z-index: 1200;
    left: 0;
    width: 100vw;
    padding: .75rem;
    background: rgba(255, 255, 255, .95);
}
</style>