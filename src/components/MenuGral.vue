<template>
    <div class="cont-gral-menu">
        <div class="row">
            <div class="col"></div>
            <div class="col-auto">
                <button type="button" class="btn btn-primary">¿Cómo se usa?</button>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-primary">Agregar Reclamo / Queja</button>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-primary">Agregar Evento</button>
            </div>
            <div class="col"></div>
        </div>
    </div>
</template>

<script setup>
</script>

<style lang="scss">
.cont-gral-menu {
    position: absolute;
    top: 0px;
    z-index: 1000;
    left: 0;
    width: 100vw;
    padding: .75rem;
    background: rgba(255, 255, 255, .5);
}
</style>