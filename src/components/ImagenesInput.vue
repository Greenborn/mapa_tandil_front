<template>
    <div class="row p-2">
        <div class="col">
            <input type="file" ref="file_input" id="myfile" name="myfile" accept=".png, .jpg, .jpeg .webp" multiple="multiple"
                @change="archivo_seleccionado">
            <p><small>Max. {{props.config.max_files}} archivos, {{props.config.max_file_size/1048576}} MB c/u</small></p>
        </div>
    </div>

    <div class="row">
        <div class="col-12" v-for="(file, index) in archivos" :key="index">
            <div class="row">
                <div class="col p-1">
                    <img class="w-100" :src="file.src" />
                    <button type="button" class="btn-rel btn btn-danger" @click="archivos.splice(index, 1)">Quitar</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['modelValue', 'config'])
const emit  = defineEmits(['update:modelValue'])

const archivos = ref(props.modelValue ? props.modelValue : [])
const file_input = ref()

function archivo_seleccionado(evnt) {
    archivos.value = []
    let files = evnt.target.files

    if (files.length == 0) 
        return file_input.value.value = ""

    if (files.length > props?.config?.max_files) {
        file_input.value.value = ""
        return alert('Solo se permiten ' + props.config.max_files + ' archivos.')
    }

    for (let i = 0; i < files.length; i++) 
        if (files[i].size > props?.config?.max_file_size) {
            file_input.value.value = ""
            return alert('El archivo ' + files[i].name + ' supera el tamaño permitido de ' + (props.config.max_file_size/1048576) + ' MB.')
        }
    
    for (let i = 0; i < files.length; i++) {
        let reader = new FileReader()

        reader.readAsDataURL(files[i])
        reader.onload = async () => {
            archivos.value.push({
                src: URL.createObjectURL(files[i]),
                base64: String(reader.result)
            })
            emit('update:modelValue', archivos.value)
        }
    }
}
</script>

<style scoped>
.btn-rel{
    position: relative;
    left: 1rem;
    bottom: 3rem;
}
</style>