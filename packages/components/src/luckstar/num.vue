<template>
    <div v-if="isLuckyDay" class="luckbox" @click="toLuckStar">
        <ul>
            <li v-for="(item, index) in diamondNum" :key="index">
                <span>
                    {{ item }}
                </span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { defineExpose, computed } from 'vue';
import request from '@/service/request';
import gsap from 'gsap';

const number = ref(0);
let isLuckyDay = ref(false);
const diamondNum = computed(() => data.number.toFixed(0).padStart(8, '0').toString());
const data = reactive({
    number: 0
});
watch(
    number,
    (n) => {
        gsap.to(data, { duration: 1, number: n });
    },
    { immediate: true }
);
watch(
    isLuckyDay,
    (newVal) => {
        if (newVal) {
            setInterval(() => {
                getInfo();
            }, 10000);
        }
    },
    { immediate: true }
);
onMounted(() => {
    getInfo();
});
function toLuckStar() {
    window.location.href = '/luckStar/index.html?title=1&from=h5';
}
function getInfo() {
    request(
        {
            url: '/v1/mstask/get-super-star-info',
            method: 'get'
        },
        false
    ).then((res) => {
        number.value = (res.data.diamondVal / 1000).toFixed(0);
        isLuckyDay.value = res.data.isLuckyDay || false;
    });
}

defineExpose({
    getInfo
});
</script>

<style lang="less" scoped>
.luckbox {
    width: 242px;
    height: 64px;
    background: url('https://res-static.inframe.mobi/ui/167955979321634.png') no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    padding: 20px 7px 0;
    ul {
        display: flex;
        justify-content: space-between;
        li {
            width: 26px;
            height: 38px;
            background: linear-gradient(
                180deg,
                #c5bcff 0%,
                #f7fbfe 32.29%,
                #f7fcfe 64.06%,
                #d4c0ff 100%
            );
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;

            span {
                font-weight: bold;
                font-size: 30px;
                background: linear-gradient(
                    180deg,
                    #7862ff 16.67%,
                    #b4a8ff 41.67%,
                    #799fff 72.92%,
                    #77a5fd 100%
                );
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-fill-color: transparent;
            }
        }
    }
}
</style>
