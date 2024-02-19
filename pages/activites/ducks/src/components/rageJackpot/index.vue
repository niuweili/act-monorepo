<template>
  <div class="luckbox">
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
import {
  computed,
  onBeforeUnmount,
  defineExpose,
  defineProps,
  ref,
  watch,
  reactive,
} from "vue";
import request from "@skr/act-service";
import gsap from "gsap";

const number = ref(0);
const diamondNum = computed(() =>
  data.number.toFixed(0).padStart(7, "0").toString()
);

const props = defineProps({
  countdownCopy: {
    type: String,
    default: "",
    require: true,
  },
});
const data = reactive({
  number: 0,
  rageTimer: null,
});

watch(
  () => props.countdownCopy,
  (newVal) => {
    if (newVal === "投喂剩余时间") {
      data.rageTimer = setInterval(() => {
        getRageJackpotNum();
      }, 3000);
    } else {
      clearInterval(data.rageTimer);
    }
  },
  { immediate: true }
);

watch(
  number,
  (n) => {
    gsap.to(data, { duration: 1, number: n });
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  clearInterval(data.rageTimer);
});

// 获取暴走大奖池钻石数量
const getRageJackpotNum = async () => {
  const params = {
    url: "/v1/mstask/get-catch-duck/bao-zou-ka-info",
    method: "get",
  };
  try {
    const res = await request(params, false);
    number.value = Math.floor(res.data?.baoZouDuckInfo?.zsBalance1000 / 1000);
  } catch (err) {
    console.log(err);
  }
};
defineExpose({
  getRageJackpotNum,
});
</script>

<style lang="less" scoped>
.luckbox {
  width: 212px;
  height: 67px;
  background: url("./assets/bgc.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  padding: 20px 7px 0;
  ul {
    display: flex;
    justify-content: space-between;
    li {
      width: 26px;
      height: 38px;
      border-radius: 8px;
      background: linear-gradient(
          180deg,
          #fdcba1 0%,
          #fff4eb 32.29%,
          #fff4eb 64.06%,
          #fdcba1 100%
        ),
        linear-gradient(
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
        font-size: 26px;
        background: linear-gradient(
          180deg,
          #ff7b31 0%,
          #fe9256 36.46%,
          #ffbc97 100%
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
