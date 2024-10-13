<template>
    <div class="detalle-conte" v-if="props.info !== null">
        <div class="w-100">

            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">{{ props.info?.titulo }}</h5>
                    <p class="card-text">{{ props.info?.detalles }}</p>
                </div>
                <ul class="list-group list-group-flush">
                    
                    <li class="list-group-item">{{ fechaDateToString(new Date(props.info?.ts), '-') }}</li>
                    <li class="list-group-item"><img v-for="img in get_images()" :key="img" :src="img.src" /></li>
                    <li class="list-group-item">{{ props.info?.ipv4 }}</li>
                    <li class="list-group-item">{{ props.info?.ipv6 }}</li>
                    <li class="list-group-item">{{ props.info?.user_agent }}</li>
                </ul>
            </div>

        </div>
    </div>
</template>

<script setup>
import { fechaDateToString } from '@/helpers/formatter'
const props = defineProps(['info'])

function get_images() {
    let info = JSON.parse(props.info.imagenes)
    for (let i = 0; i < info.length; i++) {
        info[i]['src'] = process.env.VUE_APP_API_URL + info[i]?.id + info[i]?.extension
    }
    return info
}
</script>

<style lang="scss" scoped>
.detalle-conte {
    z-index: 2500;
    position: absolute;
    max-width: 26rem;
    right: .5rem;
    top: 4.5rem;

    img {
        width: 100%;
        height: auto;
    }
}
</style>