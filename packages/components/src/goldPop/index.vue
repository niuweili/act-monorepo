<template>
  <Popup
    v-model:show="show"
    position="bottom"
    @close="closed"
  >
    <div class="gold_pop">
      <p class="title">余额不足</p>
      <p class="desc">
        金钻余额不足是否使用
        {{ toDecimal(props.exchangeAmount / 1000) }} 蓝钻兑换金钻并进行{{
          props.desc ? props.desc : "游戏"
        }}
      </p>
      <div class="buttons">
        <div @click="props.updateShowPop(false)">取消</div>
        <div @click="exchange">确定</div>
      </div>
    </div>
  </Popup>
</template>

<script setup>
import { computed } from "vue";
import request from "@skr/act-service";
import { Toast, Popup } from "vant";
import { toDecimal, isIOS } from "@skr/act-utils/lib/tool";
const emits = defineEmits(["closed"]);

const props = defineProps({
  showPop: Boolean,
  updateShowPop: Function,
  exchangeAmount: Number,
  desc: String,
});

const closed = () => {
  emits("closed");
};

const show = computed({
  get() {
    return props.showPop;
  },
  set(value) {
    console.log("value", value);
    props.updateShowPop(value);
  },
});

const exchange = async () => {
  console.log("props.exchangeAmount", props.exchangeAmount);
  try {
    await request({
      url: "/v1/wallet/jz-exchange-by-zs",
      method: "post",
      data: {
        amount: props.exchangeAmount,
        platform: isIOS() ? 10 : 20,
      },
    });
    Toast("兑换成功");
    props.updateShowPop(false, true);
  } catch (err) {
    err.errmsg && Toast(err.errmsg);
  }
};
</script>

<style lang="less" scoped>
.gold_pop {
  height: 300px;
  width: 100vw;
  background: url("http://res-static.inframe.mobi/ui/1691830925857bd.png")
    no-repeat 100% / 100%;
  padding-top: 40px;
  .title {
    font-weight: 500;
    font-size: 18px;
    line-height: 20px;
    text-align: center;
    color: #ffffff;
  }
  .desc {
    width: 287px;
    margin: 34px auto;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    color: #ffffff;
  }
  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      width: 150px;
      height: 58px;
      background: #ececec;
      border-radius: 24px;
      line-height: 58px;
      text-align: center;
      &:last-child {
        margin-left: 14px;
        background: #8779ca;
      }
    }
  }
}
</style>
