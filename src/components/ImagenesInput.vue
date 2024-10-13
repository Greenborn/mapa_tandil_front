<template>
    <div class="row p-2">
        <div class="col">
            <input type="file" id="myfile" name="myfile" accept=".png, .jpg, .jpeg .webp" multiple="multiple"
                @change="archivo_seleccionado">
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

const props = defineProps(['modelValue'])
const emit  = defineEmits(['update:modelValue'])

const archivos = ref(props.modelValue ? props.modelValue : [])

function archivo_seleccionado(evnt) {
    archivos.value = []
    let files = evnt.target.files

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