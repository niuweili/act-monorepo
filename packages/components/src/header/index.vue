<template>
    <van-sticky @scroll="stickyHandler">
        <div :class="['page-header-nav', isFixed && 'page-header-nav--fixed']">
            <div v-if="!IOS" class="nav-placeholder"></div>
            <van-nav-bar
                :safe-area-inset-top="true"
                left-arrow
                @click-left="goBack"
                @click-right="rightClickHandler"
            >
                <template #left>
                    <span :class="[customClass]" class="nav-close-icon"></span>
                </template>
                <template #right>
                    <!-- 第一种规则icon -->
                    <span v-if="showIcon" class="nav-rule-icon"></span>
                    <span v-if="rightText" :style="{ color: fontColor }">
                        {{ props.rightText }}
                    </span>
                    <!-- 第二种规则icon -->
                    <span v-if="showIcon2" class="nav-rule-icon2"></span>
                </template>
                <template #title>
                    <span :style="{ color: titleColor }">{{ props.title || '' }}</span>
                </template>
            </van-nav-bar>
        </div>
    </van-sticky>
</template>

<script setup>
/* eslint-disable vue/require-default-prop */
import { ref, defineProps } from 'vue';
import { getUrlParam, isIOS } from '@/utils/tool';
import native from '@/utils/native';
// const props = withDefaults(defineProps(), {})
const props = defineProps({
    title: String,
    fontColor: String,
    rightText: String,
    showIcon: Boolean,
    showIcon2: Boolean,
    titleColor: String,
    immediate: Boolean,
    block: {
        type: Boolean,
        default: true,
        required: false
    },
    customClass: {
        type: String,
        default: ''
    }
});
const emits = defineEmits(['rightClick', 'closeCallback']);
let isFixed = ref(false);
let IOS = isIOS();

function goBack() {
    emits('closeCallback');
    if (props.immediate) return;
    if (getUrlParam('from') == 'h5') {
        window.history.go(-1);
    } else {
        native.closePage({}, () => {
            console.log('关闭页面');
        });
    }
}
function stickyHandler(data) {
    if (props.block) {
        isFixed.value = data.isFixed;
    }
}
function rightClickHandler() {
    emits('rightClick');
}
</script>

<style lang="less" scoped>
.page-header-nav {
    width: 100%;

    .nav-placeholder {
        height: 35px;
    }
    :deep(.van-nav-bar__title) {
        color: #fff;
        font-size: 18px;
    }
    .van-nav-bar {
        background-color: transparent;
    }

    .nav-title {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
    }

    .van-hairline--bottom {
        &::after {
            display: none;
        }
    }

    .nav-close-icon {
        display: inline-block;
        background: url('./assets/icon-close.png') no-repeat;
        background-size: 100%;
        height: 30px;
        width: 30px;
    }

    .nav-rule-icon {
        display: inline-block;
        background: url('./assets/rule-helper.png') no-repeat;
        background-size: 100%;
        height: 30px;
        width: 30px;
    }

    .nav-rule-icon2 {
        display: inline-block;
        background: url('./assets/rule-helper1.png') no-repeat;
        background-size: 100%;
        height: 24px;
        width: 24px;
    }

    &--fixed {
        .nav-placeholder {
            background: rgba(33, 21, 44, 0.6);
        }

        .van-nav-bar {
            background: rgba(33, 21, 44, 0.6);
        }
    }
}
</style>
