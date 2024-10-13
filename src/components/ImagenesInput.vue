<template>
    <div class="row p-2">
        <div class="col">
            <input type="file" id="myfile" name="myfile" 
                accept=".png, .jpg, .jpeg .webp" multiple="multiple"
                @change="archivo_seleccionado">
        </div>
    </div>

    <div class="row">
        <div class="col-12 p-1" v-for="(file, index) in archivos" :key="index">
            <img class="w-100" :src="file.src" />
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';

const archivos = ref([])

function archivo_seleccionado( evnt ){
    archivos.value = []
    let files = evnt.target.files

    for (let i=0; i<files.length; i++){
        archivos.value.push({
            src: URL.createObjectURL(files[i]),
        })
    }
}
</script>