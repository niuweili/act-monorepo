<template>
  <div class="badge">
    <!-- 徽章列列表 -->
    <div v-if="badgeList.length" class="badge_list">
      <div
        v-for="(item, index) in badgeList"
        :key="item.url"
        class="badge_list_item"
      >
        <img
          v-if="!item.flag"
          :class="['badge_list_item_small', { filter: item.getStatus === 1 }]"
          :src="item.url + '?x-oss-process=image/resize,m_fixed,w_100'"
          @click="changeBadge(index)"
        />
        <div :class="['badge_list_item_big', { anm: item.flag }]">
          <div class="badge_list_item_big_left">
            <img
              :class="{ filter: item.details?.getStatus === 1 }"
              :src="item.url + '?x-oss-process=image/resize,m_fixed,w_100'"
              alt=""
            />
          </div>
          <div class="badge_list_item_big_right">
            <p class="badge_list_item_big_right_name">
              <span>{{ item.medalName }}</span>
            </p>
            <p class="badge_list_item_big_right_level">
              <span>
                当前等级：{{
                  item.details?.getStatus === 2
                    ? `${item.details?.level}级`
                    : "未点亮"
                }}
              </span>
            </p>
            <p class="badge_list_item_big_right_desc">
              <span
                v-if="item.details?.getStatus === 1 || !item.details?.nextLevel"
              >
                {{ item.details?.desc.replace("\n", "") }}
              </span>
              <span v-else-if="item.details?.nextLevel">
                下一等级：{{ item.details?.nextDesc }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 遮罩层 -->
    <!-- 抓鸭子 -->
    <teleport v-if="props.objectID === 100003" to=".ducks_bgc">
      <div
        v-if="maskIsShow"
        class="badge_mask duck"
        @click="clickOverlay"
      ></div>
    </teleport>
    <!-- 跳一跳 -->
    <teleport v-else-if="props.objectID === 100001" to=".jump">
      <div
        v-if="maskIsShow"
        class="badge_mask jumps"
        @click="clickOverlay"
      ></div>
    </teleport>
    <!-- 幸运盲盒 -->
    <teleport v-else-if="props.objectID === 100002" to=".wish-selling-machine">
      <div
        v-if="maskIsShow"
        class="badge_mask luck"
        @click="clickOverlay"
      ></div>
    </teleport>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { getUrlParam } from "@skr/act-utils/lib/tool";
import request from "@skr/act-service";
let maskIsShow = ref(false); // 遮罩层显示隐藏
const badgeList = ref([]); // 徽章列表
const props = defineProps({
  objectID: {
    type: Number,
    require: true,
    default: 0,
  },
});

onMounted(() => {
  getGameBadgeList();
});

watch(
  badgeList,
  (newVal) => {
    maskIsShow.value = newVal.some((item) => item.flag);
  },
  { deep: true }
);

// 点击弹出层时触发
const clickOverlay = () => {
  badgeList.value.forEach((item) => {
    item.flag = false;
  });
};

// 查看徽章详情
const changeBadge = (index) => {
  badgeList.value.forEach((item) => {
    item.flag = false;
  });
  queryBadgeDetails(index);
};

// 获取游戏徽章列表
const getGameBadgeList = async () => {
  const params = {
    url: "/v1/mstask/object-medal-list",
    method: "get",
    params: {
      objectID: props.objectID,
    },
  };
  try {
    const res = await request(params);
    badgeList.value = res.data.list || [];
    badgeList.value.forEach((item) => {
      item.flag = false;
    });
  } catch (err) {
    console.log(err);
  }
};

// 查询徽章详情
const queryBadgeDetails = async (index) => {
  const medalID = badgeList.value[index].medalID;
  const params = {
    url: "/v1/mstask/object-medal-detail",
    method: "get",
    params: {
      userID: getUrlParam("userID"),
      medalID,
    },
  };
  try {
    const res = await request(params);
    badgeList.value.forEach((item) => {
      if (item.medalID === res.data.medalID) {
        item.details = res.data;
      }
    });
    badgeList.value[index].flag = true;
  } catch (err) {
    console.log(err);
  }
};
</script>
<style lang="less" scoped>
@import "./index.less";
.content {
  &_mask {
    width: 100vw;
    height: 616px;
    position: fixed;
    z-index: 1000;
    bottom: 0;
  }
  &_badge {
    &_item {
      .filter {
        filter: grayscale(1);
        -webkit-filter: grayscale(1);
      }
      margin-left: 10px;
      display: flex;
      justify-content: flex-end;
      &_small {
        width: 32px;
        height: 32px;
      }
      &_big {
        width: 183px;
        min-height: 62px;
        background: linear-gradient(
          to right,
          rgba(0, 17, 66, 0.5) 0.03%,
          rgba(0, 15, 57, 0.5) 99.95%
        );
        box-shadow: inset 0px -0.5px 0px rgba(255, 255, 255, 0.72),
          inset 0px 0.5px 0px rgba(255, 255, 255, 0.35);
        border-radius: 12px;
        display: flex;

        &_left {
          width: 108px;
          color: #c7fff8;
          margin-left: 11px;

          p {
            span {
              font-weight: 600;
              font-size: 18px;
              zoom: 0.5;
            }

            &:nth-child(2) {
              line-height: 10px;
            }
          }
        }

        &_right {
          display: flex;
          align-items: center;
          flex-direction: column;

          img {
            width: 45px;
            height: 45px;
            margin-top: -10px;
          }

          p {
            width: 100%;
            text-align: center;

            span {
              font-size: 18px;
              zoom: 0.5;
              font-weight: bold;
              color: #c7fff8;
            }
          }
        }
      }
    }
  }
}
</style>
