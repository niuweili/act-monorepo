<template>
  <div class="barrage">
    <div v-if="data.showingBullets.length" class="barrage_main">
      <div
        v-for="item in data.showingBullets"
        :key="item.id"
        class="bullet-item"
        :data-line="item.line"
        @animationend="removeBullet"
      >
        <span>{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
const props = defineProps({
  list: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const data = reactive({
  list: [], //弹幕列表
  lines: 2, // 显示几行
  currentLine: 2, // 弹道
  showingBullets: [], // 渲染弹幕列表
});

// 删除执行过的任务
const removeBullet = () => {
  // eslint-disable-next-line vue/no-mutating-props
  data.showingBullets.shift();
};

// 任务执行队列
const showNextBullet = () => {
  if (!props.list.length) {
    return;
  }

  // 先确定弹道，跟上一个弹道错开即可
  data.currentLine = (data.currentLine % data.lines) + 1;
  // 从等待集合里取出第一个
  // eslint-disable-next-line vue/no-mutating-props
  const currentBullet = props.list.shift();
  // data.list.push({
  //     ...currentBullet,
  //     id: getUUID()
  // });
  // 设置弹幕的弹道
  currentBullet.line = data.currentLine;
  // // 弹幕放进显示集合里，弹幕开始滚动
  data.showingBullets.push(currentBullet);
};

defineExpose({
  showNextBullet,
});
</script>

<style lang="less" scoped>
.barrage_main {
  width: 100vw;

  @keyframes rightToLeft {
    0% {
      transform: translateX(100vw);
    }

    100% {
      transform: translateX(-100%);
    }
  }

  .bullet-item {
    position: absolute;
    animation: rightToLeft 5s linear both;
    background: rgba(72, 148, 255, 0.6);
    border: 1px solid #ffffff;
    border-radius: 32px;
    padding: 2px 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    z-index: 3;

    span {
      color: #fff;
      font-size: 20px;
      zoom: 0.5;
    }

    &[data-line="1"] {
      top: 0;
    }

    &[data-line="2"] {
      top: 30px;
    }
  }
}
</style>
