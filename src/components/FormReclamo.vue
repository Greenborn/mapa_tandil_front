<template>
    <div class="cont-modal">
        <div class="row justify-content-center border-top pt-2 w-100">
            <div class="col col-sm-10 col-md-8 col-lg-6 col-xxl-4 contenido">

                <div class="row justify-content-center">
                    <div class="col-auto p-2">
                        <h2>Nuevo Reclamo</h2>
                    </div>
                </div>

                <div class="row justify-content-center border-top">
                    <div class="col p-2">
                        <div class="mb-3">
                            <label for="titulo" class="form-label">Título</label>
                            <input type="text" class="form-control" id="titulo" placeholder="Calle en mal estado...">
                        </div>

                        <div class="mb-3">
                            <label for="detalles" class="form-label">Detalles</label>
                            <textarea class="form-control" id="detalles" rows="3"></textarea>
                        </div>

                        <ImagenesInput />
                    </div>
                </div>

                <div class="row justify-content-center border-top">
                    <div class="col-auto p-2">
                        <div class="btn-group btn-group-sm" role="group">
                            <button type="button" class="btn btn-outline-secondary">Cancelar</button>
                            <button type="button" class="btn btn-outline-primary">Enviar</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import ImagenesInput from './ImagenesInput.vue';

</script>

<style lang="scss" scoped>
.cont-modal {
    background: rgba(255, 255, 255, .4);
}

.contenido {
    background: rgba(255, 255, 255, .8);
}
</style>