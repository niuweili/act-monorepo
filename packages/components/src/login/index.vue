<template>
  <div class="login">
    <div class="user-id">
      <div class="suffix">
        <span>撕歌ID</span>
      </div>
      <van-search
        v-model="userID"
        class="user"
        placeholder="请输入撕歌ID"
        :clearable="false"
        autocomplete="off"
        :formatter="formatter"
        maxlength="10"
      ></van-search>
    </div>
    <div class="phone">
      <div class="suffix">
        <span>+86</span>
        <span class="line">|</span>
      </div>
      <van-search
        v-model="phone"
        class="phone"
        placeholder="请输入登录手机号"
        :clearable="false"
        autocomplete="off"
        :formatter="formatter"
        maxlength="11"
      ></van-search>
    </div>
    <!--  @update:model-value="getList"
                @click-right-icon="getList" -->
    <div class="code-box">
      <van-search
        v-model="verifyCode"
        class="code"
        placeholder="请输入验证码"
        :clearable="false"
        autocomplete="off"
        maxlength="6"
        :formatter="formatter"
      ></van-search>
      <div class="verify" @click="codeHandler">
        {{ data.countDown > 0 ? `${data.countDown}s` : data.verifyTxt1 }}
      </div>
    </div>
    <div class="button" @click="loginHandler"></div>
    <!-- <zq-input v-model.trim="mobile" placeholder="手机号"></zq-input>
    
    <zq-input v-model.trim="code" placeholder="验证码" @change="getCode" class="input_wrapper">
      <div class="input-btn" @click="getCode">
        <span class="stroke">{{btnText || '获取验证码'}}</span>
        <span class="solid">{{btnText || '获取验证码'}}</span>
      </div>
    </zq-input>
    
    <div class="btn-box">
      <zq-button
          :size="['1.70rem', '.53rem']"
          padding="0"
          :class="(mobile === '' || code ==='') && 'disable1'"
          @click.native="loginHandler"
      >
        登录
      </zq-button>
    </div> -->
  </div>
  <ji-yan
    v-if="data.initJiyan"
    :re-validate="data.validate"
    @no-verify="resetJY"
    @verify-code="getVerifyCode"
  ></ji-yan>
</template>

<script setup>
import { ref, reactive } from "vue";
import md5 from "blueimp-md5";
import Cookie from "@skr/act-utils/lib/cookie";
import JiYan from "../jiyan/index.vue";
import request from "@skr/act-service";
import { Toast } from "vant";
import "vant/es/toast/style";
import {
  throttleImmediate,
  getDeviceToken,
  filterApiKey,
} from "@skr/act-utils/lib/tool";

const emits = defineEmits(["updateLogin"]);
const userID = ref("");
const phone = ref("");
const verifyCode = ref("");
const data = reactive({
  initJiyan: false,
  validate: false,
  verifyTxt1: "获取验证码",
  countDown: 0,
  countTimer: null,
  submiting: false,
  // reValidate: false,
  verifyCode: {},
  isSendCode: false,
});

const resetData = () => {
  userID.value = "";
  phone.value = "";
  verifyCode.value = "";
  console.log("active");
  if (data.countTimer) {
    clearInterval(data.countTimer);
    data.countTimer = null;
  }
  data.isSendCode = false;
  data.countDown = 0;
  data.verifyCode = {};
};
const resetJY = () => {
  data.validate = false;
  data.initJiyan = false;
};
const formatter = (val) => {
  return val.replace(/\D/, "");
};
const getVerifyCode = (e) => {
  data.verifyCode = e;
  data.validate = false;
  getCode();
};
const getLoginInfo = async () => {
  const url = "/v1/users";
  try {
    const resp = await request({
      url,
      method: "get",
      params: {
        userID: userID.value + "",
      },
      headers: {
        "Inframe-Client-ID": userID.value,
      },
    });
    if (resp.errno === 0) {
      return true;
    }
  } catch (error) {
    return false;
  }
};
const codeHandler = throttleImmediate(async () => {
  const phoneNum = phone.value;
  if (data.countDown !== 0) {
    return;
  }
  if (!userID.value) return Toast("请输入撕歌ID");
  if (!phoneNum) return Toast("请输入手机号码");
  if (!/^(0|\+?86)?1(3|4|5|6|7|8|9)[0-9]{9}$/.test(phoneNum)) {
    Toast("手机号码输入有误，请重新输入");
    return;
  }
  const passVal = await getLoginInfo();
  if (!passVal) return Toast("请输入正确的撕歌ID");
  data.initJiyan = true;
  data.validate = true;
}, 1500);
/**
 * 获取手机验证码
 */
const getCode = () => {
  const timeMs = Date.now();
  const phoneNum = phone.value;
  const code = data.verifyCode;
  const params = {
    phone: phoneNum,
    challenge: code.geetest_challenge,
    validate: code.geetest_validate,
    seccode: code.geetest_seccode,
    timeMs: timeMs,
    // sign: md5(`skr2020|${phone}|${this.useId}|${timeMs}`),
    sign: md5(`skr2020|${phoneNum}|${userID.value}|${timeMs}`),
    countryCode: "86",
  };

  request({
    url: "/v1/passport/get-code-for-login",
    params,
    headers: {
      "Inframe-Client-ID": userID.value,
    },
  })
    .then((res) => {
      if (res.errno === 0) {
        data.isSendCode = true;
        data.initJiyan = false;
        startTimer();
      }
    })
    .catch((err) => {
      err.errmsg && Toast(err.errmsg);
    });
};
/**
 * 获取手机验证码，倒计时，启动timer
 */
const startTimer = () => {
  data.countTimer && window.clearInterval(data.countTimer.timer);
  data.countDown = 60;
  data.countTimer = window.setInterval(() => {
    data.countDown--;
    if (data.countDown === 0) {
      data.countTimer && window.clearInterval(data.countTimer);
      data.countTimer = null;
    }
  }, 1000);
};
/**
 * 登录
 */
const loginHandler = throttleImmediate(async () => {
  // this.$stat.sum('btn_nextStip');
  const mobile = phone.value;
  const code = verifyCode.value;
  if (!userID.value) return Toast("请输入撕歌ID");
  if (!/^(0|\+?86)?1(3|4|5|6|7|8|9)[0-9]{9}$/.test(mobile)) {
    Toast("手机号码输入有误，请重新输入");
    return;
  }
  if (!data.isSendCode) {
    return Toast("请先获取验证码");
  }
  if (!code) {
    Toast("请输入验证码");
    return;
  }

  const deviceToken = await getDeviceToken();

  const postdata = {
    mode: 1,
    code: code,
    sign: mobile,
    platform: "30",
    deviceToken,
    timeMs: Date.now(),
    apiSecret: "skr2020",
  };

  if (data.submiting) {
    return;
  }

  const params = {
    ...postdata,
    apikey: filterApiKey(postdata),
  };

  delete params.apiSecret;

  data.submiting = true;
  request({
    url: "/v2/passport/login",
    method: "post",
    headers: {
      "Inframe-Client-ID": userID.value,
    },
    data: params,
  })
    .then((res) => {
      data.submiting = false;
      if (res.errno === 0) {
        const token = res.data.token;
        Cookie.setCookie("S", token.S, 1000 * 60 * 60 * 24 * 30);
        Cookie.setCookie("T", token.T, 1000 * 60 * 60 * 24 * 30);
        emits("updateLogin", res.data.profile || {});
      }
      resetData();
    })
    .catch((e) => {
      e.errmsg && Toast(e.errmsg);
      data.submiting = false;
    });
}, 1500);
</script>

<style scoped lang="less">
@import url(./index.less);
</style>
