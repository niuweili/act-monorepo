<template>
    <div v-if="loading" class="loading">
        <van-loading size="50px" type="spinner" vertical>加载中...</van-loading>
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const loading = computed(() => store.getters['common/loading']);
</script>

<style lang="less" scoped>
.loading {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;

    .van-loading {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        height: 70px;
        color: #333;
    }
}
</style>
