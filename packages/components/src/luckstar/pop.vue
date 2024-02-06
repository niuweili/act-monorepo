<template>
    <div class="box">
        <Popup v-model:show="showPop" :overlay-class="'dialog'">
            <div class="pop">
                <p>{{ (props.num / 1000).toFixed(0) }}</p>
                <div @click="showPop = false"></div>
            </div>
        </Popup>
    </div>
</template>

<script setup>
import { Popup } from 'vant';
const props = defineProps({
    num: Number || 0
});
let showPop = ref(true);
</script>

<style lang="less" scoped>
.box {
    :deep(.dialog) {
        z-index: 2050 !important;
    }
    :deep(.van-popup) {
        z-index: 2050 !important;
    }
    .pop {
        width: 296px;
        height: 266px;
        background: url('https://res-static.inframe.mobi/ui/1679502928308c8.png') no-repeat;
        background-size: 100% 100%;
        overflow: hidden;
        p {
            font-size: 26px;
            color: #f5fdda;
            margin: 109px 110px 0 0;
            text-align: right;
            font-weight: bold;
        }
        div {
            width: 130px;
            height: 40px;
            margin: 45px auto 0;
        }
    }
}
</style>
