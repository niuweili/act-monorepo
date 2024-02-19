<template>
  <slot name="noRecord" :list="list"></slot>
  <div class="scroll-box">
    <van-pull-refresh
      v-model="refreshing"
      success-text="刷新成功"
      :style="{ minHeight: mHeight }"
      :disabled="isDisabled"
      @refresh="onRefresh"
    >
      <van-list
        v-model:loading="loading"
        v-model:error="listError"
        :offset="10"
        :finished="finished"
        finished-text="没有更多了"
        error-text="加载失败，请点击重试"
        @load="loadHandler"
      >
        <div class="only" :class="[{ no_data: list.length <= 0 }]">
          <div
            v-for="(item, index) in list"
            :key="`list-${index}`"
            class="list-item"
          >
            <slot :item="{ index, ...item }"></slot>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import request from "@skr/act-service";
import { encryptData } from "@/common/cryptoUtil";
// name: 'c-list',
interface Props {
  url: string;
  cnt?: string;
  params?: object;
  method?: string;
  flag?: boolean;
  rankRepeat?: boolean; // 是否重复排名
  mHeight?: string;
  isDisabled?: boolean; // 是否禁止下拉刷新 ture：是 false: 否
  listToal?: number; //榜单自定义拉取条数
  dataKey?: string;
  lotteryrecord: any;
  showshow: string;
  nono: string;
}
const props = withDefaults(defineProps<Props>(), {
  url: "",
  cnt: "20",
  params: () => ({}),
  method: "get",
  flag: false,
  rankRepeat: false,
  mHeight: "200px",
  listToal: 0,
  dataKey: "items",
  lotteryrecord: "",
  showshow: "",
  nono: "",
});
const emits = defineEmits(["data"]);
let loading = ref(false);
let finished = ref(false);
let listError = ref(false);
let curOffset = ref(0);
let initPage = ref(true);
let list = ref<unknown[]>([]);
let refreshing = ref(false);
let itemRank = ref({
  rank: "",
  value: 0,
});
watch(
  () => props.lotteryrecord,
  (value) => {
    // console.log(value, 'lotteryRecord');
    if (value) {
      twoNewHandel(value);
    }
  },
  { immediate: true, deep: true }
);
const reset = () => {
  loading.value = false;
  curOffset.value = 0;
  listError.value = false;
  finished.value = false;
  list.value = [];
};
const clear = () => {
  finished.value = true;
  list.value = [];
  curOffset.value = 0;
};
const changeOffset = () => {
  curOffset.value = 0;
};

// let key = Date.now()
const diffList = (goodsID: any, count: any) => {
  list.value.forEach((item) => {
    if ((item as any).goodsInfo.goodsID === goodsID) {
      (item as any).count = count;
    }
  });
  list.value = list.value.filter(
    (item) => Math.floor((item as any).count / 1000) > 0
  );
};

const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  loadHandler();
};

async function loadHandler() {
  if (props.flag && props.params.periodN < 0) {
    finished.value = true;
    clear();
    return;
  }
  if (refreshing.value) {
    list.value = [];
    refreshing.value = false;
    curOffset.value = 0;
  }
  const data = {
    offset: curOffset.value,
    cnt: props.cnt,
    limit: props.cnt,
    ...props.params,
  };

  const start = curOffset.value;
  try {
    const method = props.method;
    const requestOption =
      method === "get"
        ? {
            url: props.url,
            method,
            params: data,
          }
        : {
            url: props.url,
            method,
            data,
          };
    const response = await request(requestOption, false);
    const { clientSign, sync } = response.data || {};
    if (sync) {
      return;
    }
    const { currentMS, hasSign, signString } = clientSign || {};
    const currentT = props.showshow + props.nono + currentMS + "";
    if (clientSign && hasSign) {
      encryptData(signString, currentT, (resource: any) => {
        initPage.value = false;
        newHamdel(resource, start);
      });
      return;
    }

    const { offset, hasMore } = response.data;
    const currlist =
      response.data[props.dataKey] ||
      response.data.items ||
      response.data.rankDataList ||
      response.data.list ||
      response.data.lists ||
      response.data.pkInfo ||
      response.data.constellationRsp?.items ||
      response.data.contacts ||
      response.data.CommonRsp?.items ||
      response.data.userAwardInfos ||
      response.data.awardDetails ||
      response.data.accounts ||
      response.data.data ||
      [];

    curOffset.value = offset === start ? 0 : offset;
    finished.value = !hasMore;
    list.value = [...list.value, ...currlist];
    if (props.listToal && list.value.length >= props.listToal) {
      finished.value = true;
    }
    if (props.rankRepeat) {
      list.value.forEach((item) => {
        if ((item as any).value !== itemRank.value.value) {
          itemRank.value = {
            rank: (item as any).rank,
            value: (item as any).value,
          };
        }

        if ((item as any).value === itemRank.value.value) {
          (item as any).rank = itemRank.value.rank;
        }

        if (
          (item as any).usrInfos[0].userID ===
          response.data.rankUserInfo?.rankData?.usrInfos[0].userID
        ) {
          response.data.rankUserInfo.rankData.rank = (item as any).rank;
        } else if (response.data.rankUserInfo.rankData.rank > 200) {
          response.data.rankUserInfo.rankData.rank = "200+";
        } else if (!response.data.rankUserInfo.rankData.rank) {
          response.data.rankUserInfo.rankData.rank = "未入榜";
          response.data.rankUserInfo.rankData.value = 0;
        }
      });

      if (!list.value.length) {
        response.data.rankUserInfo.rankData.rank = "未入榜";
        response.data.rankUserInfo.rankData.value = 0;
      }
    }

    // if (props.flag) {
    //   list.value = list.value.filter((item, index, selfArr) => selfArr.findIndex((elem) => (elem as any).rank === (item as any).rank) === index)
    // }
    loading.value = false;
    refreshing.value = false;
    emits("data", response.data, list.value);
  } catch (e) {
    // console.log(e, 'error');
    listError.value = true;
    loading.value = false;
    refreshing.value = false;
  }
}
const twoNewHandel = (responsed: any) => {
  try {
    if (props.flag && props.params.periodN < 0) {
      finished.value = true;
      clear();
      return;
    }
    if (refreshing.value) {
      list.value = [];
      refreshing.value = false;
      curOffset.value = 0;
    }
    const response = {
      data: {
        ...responsed,
      },
    };
    const start = curOffset.value;
    const { clientSign } = response.data || {};
    const { currentMS, hasSign, signString } = clientSign || {};
    const currentT = props.showshow + props.nono + currentMS + "";
    if (clientSign && hasSign) {
      encryptData(signString, currentT, (resource: any) => {
        initPage.value = false;
        newHamdel(resource, start);
      });
      return;
    }
    const { offset, hasMore } = response.data;
    const currlist =
      response.data[props.dataKey] ||
      response.data.items ||
      response.data.rankDataList ||
      response.data.list ||
      response.data.lists ||
      response.data.pkInfo ||
      response.data.constellationRsp?.items ||
      response.data.contacts ||
      response.data.CommonRsp?.items ||
      response.data.userAwardInfos ||
      response.data.awardDetails ||
      response.data.accounts ||
      response.data.data ||
      [];
    curOffset.value = offset === start ? 0 : offset;
    finished.value = !hasMore;
    list.value = [...list.value, ...currlist];
    if (props.listToal && list.value.length >= props.listToal) {
      finished.value = true;
    }
    if (props.rankRepeat) {
      list.value.forEach((item) => {
        if ((item as any).value !== itemRank.value.value) {
          itemRank.value = {
            rank: (item as any).rank,
            value: (item as any).value,
          };
        }

        if ((item as any).value === itemRank.value.value) {
          (item as any).rank = itemRank.value.rank;
        }

        if (
          (item as any).usrInfos[0].userID ===
          response.data.rankUserInfo?.rankData?.usrInfos[0].userID
        ) {
          response.data.rankUserInfo.rankData.rank = (item as any).rank;
        } else if (response.data.rankUserInfo.rankData.rank > 200) {
          response.data.rankUserInfo.rankData.rank = "200+";
        } else if (!response.data.rankUserInfo.rankData.rank) {
          response.data.rankUserInfo.rankData.rank = "未入榜";
          response.data.rankUserInfo.rankData.value = 0;
        }
      });

      if (!list.value.length) {
        response.data.rankUserInfo.rankData.rank = "未入榜";
        response.data.rankUserInfo.rankData.value = 0;
      }
    }

    // if (props.flag) {
    //   list.value = list.value.filter((item, index, selfArr) => selfArr.findIndex((elem) => (elem as any).rank === (item as any).rank) === index)
    // }
    loading.value = false;
    refreshing.value = false;
    emits("data", response.data, list.value);
  } catch (error) {
    listError.value = true;
    loading.value = false;
    refreshing.value = false;
  }
};
const newHamdel = (responsed: any, start: any) => {
  try {
    const response = {
      data: {
        ...responsed,
      },
    };
    const { offset, hasMore } = response.data || {};
    const currlist =
      response.data[props.dataKey] ||
      response.data.items ||
      response.data.rankDataList ||
      response.data.list ||
      response.data.lists ||
      response.data.pkInfo ||
      response.data.constellationRsp?.items ||
      response.data.contacts ||
      response.data.CommonRsp?.items ||
      response.data.userAwardInfos ||
      response.data.awardDetails ||
      response.data.accounts ||
      response.data.data ||
      [];

    curOffset.value = offset === start ? 0 : offset;
    finished.value = !hasMore;
    list.value = [...list.value, ...currlist];
    if (props.listToal && list.value.length >= props.listToal) {
      finished.value = true;
    }
    if (props.rankRepeat) {
      list.value.forEach((item) => {
        if ((item as any).value !== itemRank.value.value) {
          itemRank.value = {
            rank: (item as any).rank,
            value: (item as any).value,
          };
        }

        if ((item as any).value === itemRank.value.value) {
          (item as any).rank = itemRank.value.rank;
        }

        if (
          (item as any).usrInfos[0].userID ===
          response.data.rankUserInfo?.rankData?.usrInfos[0].userID
        ) {
          response.data.rankUserInfo.rankData.rank = (item as any).rank;
        } else if (response.data.rankUserInfo.rankData.rank > 200) {
          response.data.rankUserInfo.rankData.rank = "200+";
        } else if (!response.data.rankUserInfo.rankData.rank) {
          response.data.rankUserInfo.rankData.rank = "未入榜";
          response.data.rankUserInfo.rankData.value = 0;
        }
      });

      if (!list.value.length) {
        response.data.rankUserInfo.rankData.rank = "未入榜";
        response.data.rankUserInfo.rankData.value = 0;
      }
    }

    // if (props.flag) {
    //   list.value = list.value.filter((item, index, selfArr) => selfArr.findIndex((elem) => (elem as any).rank === (item as any).rank) === index)
    // }
    loading.value = false;
    refreshing.value = false;
    emits("data", response.data, list.value);
  } catch (error) {
    // console.log(error, 'error');
    listError.value = true;
    loading.value = false;
    refreshing.value = false;
  }
};

defineExpose({
  loadHandler,
  clear,
  changeOffset,
  list,
  diffList,
  reset,
});
</script>
<style lang="less" scoped>
.scroll-box {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
</style>
pages/activites/demo/src/cryptoUtil
