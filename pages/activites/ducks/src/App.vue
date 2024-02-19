<template>
  <div class="ducks">
    <!-- 新手引导进来的 防止页面切换闪动严重 -->
    <keep-alive>
      <div v-if="guideFlag">
        <MainPage
          v-if="data.mainPageIsShow"
          v-show="!data.guideIsShow"
          ref="duckPage"
          v-model:guide-flag="data.jumpOrNot"
        />
        <Guide
          v-show="data.guideIsShow"
          @change-page="changePage"
          @change-main-page="changeMainPage"
        />
      </div>
      <div v-else>
        <MainPage />
      </div>
    </keep-alive>
  </div>
</template>
<script setup>
import { defineAsyncComponent, onBeforeMount, reactive, ref, watch } from "vue";
import { getUrlParam } from "@skr/act-utils/lib/tool";
const MainPage = defineAsyncComponent(() => import("./components/main"));
const Guide = defineAsyncComponent(() => import("./components/guide"));
const duckPage = ref(null);
const data = reactive({
  guideIsShow: false,
  jumpOrNot: false,
  mainPageIsShow: false,
});
// 是否从从新手引导进来的
const guideFlag = getUrlParam("guideFlag");

watch(
  () => data.guideIsShow,
  (newVal) => {
    if (!newVal && guideFlag) {
      data.jumpOrNot = true;
    }
  }
);

onBeforeMount(() => {
  data.guideIsShow = guideFlag ? true : false;
});

const changePage = () => {
  data.guideIsShow = false;
  duckPage.value.getDucksInfo();
  duckPage.value.getUserAssets();
};

const changeMainPage = () => {
  data.mainPageIsShow = true;
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
