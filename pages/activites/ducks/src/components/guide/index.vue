<template>
  <div class="guide">
    <div class="guide_bgc">
      <img
        v-if="data.step === 1"
        class="guide_bgc_main animate__animated animate__fadeIn"
        :src="require(`./assets/step${data.step}.png`)"
        alt=""
      />
      <img
        v-else-if="data.step === 2"
        class="guide_bgc_main animate__animated animate__fadeIn"
        :src="require(`./assets/step${data.step}.png`)"
        alt=""
      />
      <img
        v-else-if="data.step === 3"
        class="guide_bgc_main animate__animated animate__fadeIn"
        :src="require(`./assets/step${data.step}.png`)"
        alt=""
      />
      <img
        v-else-if="data.step === 4"
        class="guide_bgc_main animate__animated animate__fadeIn"
        :src="require(`./assets/step${data.step}.png`)"
        alt=""
      />
      <img
        v-else-if="data.step === 5"
        class="guide_bgc_main animate__animated animate__fadeIn"
        :src="require(`./assets/step${data.step}.png`)"
        alt=""
      />
      <img
        v-else-if="data.step === 6"
        class="guide_bgc_main animate__animated animate__fadeIn"
        :src="require(`./assets/step${data.step}.png`)"
        alt=""
      />
      <div
        v-else-if="data.step === 7"
        class="guide_bgc_main animate__animated animate__fadeIn"
      >
        <div class="guide_bgc_main_loop"></div>
        <div class="guide_bgc_main_speed">
          <div
            class="content"
            :style="{ animationDuration: `${data.surplusTimeMs}s` }"
            @animationend="speedAnimationend"
          ></div>
        </div>
      </div>
      <img
        v-if="data.step === 4"
        class="guide_bgc_hand4 animate__animated animate__fadeIn"
        src="./assets/hand4.png"
        alt=""
      />
      <img
        v-if="data.step === 5"
        class="guide_bgc_hand5 animate__animated animate__fadeIn"
        src="./assets/hand5.png"
        alt=""
      />
      <div
        v-if="data.step === 4"
        class="guide_bgc_select"
        @click="nextStep"
      ></div>
      <div
        v-if="data.step === 5"
        class="guide_bgc_confirm"
        @click="feeding"
      ></div>
      <div v-if="data.step <= 3" class="guide_bgc_next" @click="nextStep">
        下一步
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import native from "@skr/act-utils/lib/native";
import { initLottie, isIOS, throttleImmediate } from "@skr/act-utils/lib/tool";
import request from "@skr/act-service";
import { Toast } from "vant";
import "vant/es/toast/style";
const emits = defineEmits(["changePage", "changeMainPage"]);

const data = reactive({
  step: 1,
  loopAnm: null,
  surplusTimeMs: 0,
});

// 关闭页面
const close = () => {
  native.closePage();
};

// 下一步
const nextStep = throttleImmediate(() => {
  data.step += 1;
}, 500);

// 监听当前是第几步
watch(
  () => data.step,
  (newVal) => {
    if (data.step === 3) {
      emits("changeMainPage");
    }
    if (newVal === 5) {
      if (!data.loopAnm) {
        import("./assets/loop.json").then((res) => {
          data.loopAnm = res;
        });
      }
    }
    if (newVal === 7) {
      setTimeout(() => {
        initLottie(".guide_bgc_main_loop", data.loopAnm);
      });
    }
  },
  { immediate: true }
);

// 投喂
const feeding = () => {
  getDucksInfo();
};

// 监听动画结束
const speedAnimationend = () => {
  emits("changePage");
};

// 确认投喂
const confirm = throttleImmediate(async () => {
  const params = {
    url: "/v1/mstask/catch-duck/bet",
    method: "post",
    data: {
      betInfo: {
        betNum: 1,
        position: 8,
      },
      gameID: data.gameID,
      platform: isIOS() ? 10 : 20,
      userType: 2,
    },
  };

  try {
    const res = await request(params);
    const { betInfos, isCurTurn } = res.data;
    data.betInfos = betInfos;
    data.step += 1;
    // 如果投喂的是这一轮 直接开始倒计时
    if (isCurTurn) {
      setTimeout(() => {
        emits("changePage");
      }, 2000);
    } else {
      // 如果是下一轮，重新获取倒计时
      setTimeout(() => {
        getDucksInfo(true);
      }, 2000);
    }
  } catch (err) {
    Toast(err.errmsg);
  }
}, 1000);

// 获取抓鸭子信息
const getDucksInfo = async (flag = false) => {
  const params = {
    url: "/v1/mstask/catch-duck/get",
    method: "post",
    data: {
      platform: isIOS() ? 10 : 20,
    },
  };

  try {
    const res = await request(params, false);
    const { gameID, lotteryInfo, catchDuckBeforeOpenSecond } = res.data;
    data.gameID = gameID;
    data.surplusTimeMs = lotteryInfo.surplusTimeMs + 3;
    /**
     * 如果投喂的是下一轮 && 当前倒计时时间要大于开奖剩余调开奖接口时间的2倍，直接开始倒计时，不播放加载中动画
     * 为了防止用户刚好在倒计时1s或者2s的时候投喂，这时候投喂到的实际上是下一轮，就不需要播放倒计时了 */
    if (flag && lotteryInfo.surplusTimeMs > catchDuckBeforeOpenSecond * 2) {
      setTimeout(() => {
        emits("changePage");
      }, 2000);
    } else if (flag) {
      data.step += 1;
    }
    !flag && confirm();
  } catch (err) {
    console.log(err);
  }
};
</script>

<style lang="less" scoped>
@import "./index.less";
</style>
