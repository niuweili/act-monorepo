<template>
  <div class="page"></div>
</template>

<script setup>
import { onMounted } from "vue";
import { Toast } from "vant";
import request from "@skr/act-service";
import "./gt.js";
const emits = defineEmits(["noVerify", "verifyCode"]);

const showVerify = () => {
  const url = "/v1/geetest/on-init";
  request({ url })
    .then((res) => {
      const { gt, challenge, success } = res.data;
      window.initGeetest(
        {
          // 以下配置参数来自服务端 SDK
          gt,
          challenge,
          offline: success === "0" ? true : false,
          new_captcha: true,
          product: "bind",
        },
        (captchaObj) => {
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj
            .onReady(function () {
              captchaObj.verify(); //显示验证码
              //验证码ready之后才能调用verify方法显示验证码
            })
            .onSuccess(function () {
              const result = captchaObj.getValidate();
              console.log(result);
              emits("noVerify");
              emits("verifyCode", result);
              captchaObj.reset();
            })
            .onError(function () {
              console.error("出错了");
              emits("noVerify");
              captchaObj.reset();
              showVerify();
            })
            .onClose(() => {
              emits("noVerify");
              captchaObj.reset();
            });
          // 按钮提交事件
        }
      );
    })
    .catch((e) => {
      // this.$hideLoader();
      console.error(e);
      Toast(e.errmsg || "请求失败请重试");
    });
};

onMounted(() => {
  showVerify();
});
</script>

<style lang="less" scoped></style>
