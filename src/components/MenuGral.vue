<template>
    <div class="cont-gral-menu">
        <div class="row justify-content-center">
            <div class="col-auto">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary">¿Cómo se usa?</button>
                    <button type="button" class="btn btn-outline-success">+ Reclamo</button>
                    <button type="button" class="btn btn-outline-success">+ Evento</button>
                </div>
            </div>
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
    background: rgba(255, 255, 255, .95);
}
</style>