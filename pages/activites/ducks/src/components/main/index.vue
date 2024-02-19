<template>
  <div class="ducks" @click.self="close">
    <div v-if="data.rageDuckInfo.position" class="ducks_luckStar">
      <!-- <lucknum ref="luckNum" /> -->
      <RageJackpot ref="rageJackpot" :countdown-copy="data.countdownCopy" />
    </div>
    <div v-show="data.pageIsShow" class="ducks_RageBgc"></div>
    <!--      :style="{
                background: `url(${getStateValue('mainBgc')}) no-repeat center / 100% 100%`
            }" -->
    <div class="ducks_bgc">
      <div v-show="data.pageIsShow" class="animate__animated animate__fadeIn">
        <img class="ducks_bgc_xs" src="./assets/xsIcon.png" alt="" />
        <!-- 限时icon -->
        <!-- 暴走鸭火焰 -->
        <div v-if="data.rageDuckInfo && data.rageDuckInfo.position">
          <!-- getStateValue('bottomFire') -->
          <img
            :class="['ducks_bgc_fire', `fire${data.rageDuckInfo.position}`]"
            src="http://res-static.inframe.mobi/ui/16909642216472b.png"
            alt=""
            type="bottom"
          />
          <!--   :style="{
                            background: `url(${getStateValue(
                                'topFire'
                            )}) no-repeat center / 100% 100%`
                        }" -->
          <div
            :class="['ducks_bgc_fire', `fire${data.rageDuckInfo.position}`]"
            :style="{
              background: `url(http://res-static.inframe.mobi/ui/169096427612512.png) no-repeat center / 100% 100%`,
            }"
            type="top"
          >
            <p>暴走{{ data.rageDuckInfo?.surplusCnt }}</p>
          </div>
        </div>
        <!-- <Badge :object-i-d="100003" /> -->
        <img class="ducks_bgc_title" src="./assets/title.png" alt="" />
        <div class="ducks_bgc_time">
          <div>
            <p>
              <span>{{ data.countdownCopy }}</span>
            </p>
            <p>
              <van-count-down
                ref="countDown"
                :time="data.surplusTimeMs"
                format="ss"
                @finish="finish"
                @change="changeTime"
              />
              秒
            </p>
          </div>
        </div>
        <div class="ducks_bgc_select">
          <div @click="select">
            <p v-if="data.selectFlag"></p>
          </div>
          <span>自动兑换大礼物</span>
        </div>
        <!-- 当前小鱼干 -->
        <!-- <div class="ducks_bgc_fishd">
                    <span>{{ data.userAssets.fishBalance }}</span>
                </div> -->
        <!-- 金钻余额 -->
        <div v-if="data.showJinzuan === 1" class="ducks_bgc_jinzuan">
          <span>{{ toDecimal(data.userAssets.jzBalance / 1000, 1) }}</span>
        </div>
        <!-- 钻石余额 -->
        <div class="ducks_bgc_diamond" @click.stop="toRecharge">
          <span>{{ toFixeds(data.userAssets.zsBalance / 1000, 1) }}</span>
        </div>

        <!-- 更多 -->
        <img
          class="ducks_bgc_more"
          src="./assets/more.png"
          alt=""
          @click="data.allIsShow = !data.allIsShow"
        />
        <div v-if="data.allIsShow" class="ducks_bgc_all">
          <!-- 规则 -->
          <div @click="data.ruleIsShow = true"></div>
          <!-- 投喂记录 -->
          <div @click="feedingRecord"></div>
          <!-- 抓取记录 -->
          <div @click="captureRecords"></div>
        </div>
        <div
          v-show="data.ducksIsShow"
          ref="ducksAll"
          class="ducks_bgc_ducksAll"
        >
          <!-- <img src="./assets/ducksAll.png" alt="" /> -->
        </div>
        <div v-show="!data.ducksIsShow" id="animation"></div>
        <!-- ${getStateValue('giftImg')} -->
        <div
          :class="['ducks_bgc_gift', { giftZIindex: data.giftZIindexIsShow }]"
          :style="{
            background: `url(http://res-static.inframe.mobi/ui/170532657241002.png) no-repeat center / 100% 100%`,
          }"
        ></div>
        <!-- 跳转特价超市   -->
        <!-- <img
                v-if="activityStatus == 1 && !isIOS()"
                class="ducks_bgc_cheaper"
                src="./assets/cheaper.png"
                @click="toCheaper"
            /> -->
        <!-- 暴走卡剩余数量展示入口 -->
        <div class="ducks_bgc_rage" @click="data.rageIsShow = true">
          <div>
            <img src="./assets/rageCard.png" alt="" />
            <p>
              <span>{{ data.userAssets.baoZouKaBalance / 1000 || 0 }}张</span>
            </p>
          </div>
        </div>
        <!-- ${getStateValue(
                            'obtainBtn'
                        )} -->
        <div
          class="ducks_bgc_fish"
          :style="{
            background: `url(http://res-static.inframe.mobi/ui/169173888609609.png) no-repeat center / 100% 100%`,
          }"
        >
          <div class="ducks_bgc_fish_main">
            <div class="ducks_bgc_fish_main_btn" @click="obtain"></div>
          </div>
          <!-- 当前小鱼干 -->
          <div class="ducks_bgc_fish_fishd">
            <span>{{ data.userAssets.fishBalance }}</span>
          </div>
        </div>
        <div
          v-for="(item, index) in data.giftList"
          :key="item.giftID"
          :class="['ducks_bgc_list', `activeClassPo${index + 1}`]"
          @click="startFeeding(item)"
        >
          <p>
            <span>{{ `${item.duckName}${item.betNum || 0}份` }}</span>
          </p>
          <img src="./assets/add.png" alt="" />
        </div>
        <!-- 未被抓到提醒 -->
        <div
          v-for="item in data.giftList"
          :key="item.giftID"
          :class="[
            'ducks_bgc_remind',
            `activeClassRemind${item.position}`,
            { remindZIndex: data.rageDuckInfo.position === item.position },
          ]"
        >
          <div
            v-if="item.turnCnt >= 10"
            :class="[
              [1, 3, 4, 7, 5].includes(item.position) ? 'left' : 'right',
              'animate__animated animate__fadeIn',
            ]"
          >
            <p>
              <span>
                {{ item.turnCnt > 200 ? "200+" : item.turnCnt }}轮未被抓到哦
              </span>
            </p>
          </div>
        </div>
        <!-- 历史鸭子 -->
        <div class="ducks_bgc_history">
          <ul>
            <li v-for="item in data.historyDucks" :key="item.gameID">
              <img
                :src="`${item.duckUrl}?x-oss-process=image/resize,m_fixed,w_30`"
                alt=""
              />
            </li>
          </ul>
        </div>
        <!-- 中奖弹幕 -->
        <div class="ducks_bgc_centre">
          <BarrageCen ref="barrageCen" :list="data.list" />
        </div>
        <!-- 投喂弹幕 -->
        <div class="ducks_bgc_feeding">
          <div class="main">
            <BarrageFee ref="barrageFee" :list="data.userBetInfo" />
          </div>
        </div>
      </div>
    </div>

    <!-- 规则dialog -->
    <van-popup v-model:show="data.ruleIsShow">
      <Rule />
    </van-popup>
    <!-- 投喂记录 -->
    <van-popup v-model:show="data.feedIsShow" @closed="clearData">
      <div class="feed">
        <div class="feed_main">
          <List
            v-if="data.feedIsShow"
            url="/v2/mstask/catch-duck/catch-record"
            :params="{
              gameSignNum,
            }"
            :lotteryrecord="data.duckRecord"
            :showshow="data.showText"
            :nono="data.nomal"
          >
            <template #default="slotProps">
              <div class="feed_main_item">
                <div class="feed_main_item_left">
                  <img
                    v-lazy="
                      `${slotProps.item.duckUrl}?x-oss-process=image/resize,m_fixed,w_100`
                    "
                    alt=""
                  />
                </div>
                <div class="feed_main_item_center">
                  <p>抓取鸭子：{{ slotProps.item.duckName }}</p>
                  <p>{{ parseTime(slotProps.item.createdTime) }}</p>
                  <p>本局投喂：小鱼干x{{ slotProps.item.betNum }}</p>
                </div>
                <div class="feed_main_item_right">
                  <div
                    :class="[
                      'feed_main_item_right_btn',
                      slotProps.item.isLottery ? 'success' : 'fail',
                    ]"
                  ></div>
                  <p v-if="slotProps.item.giftName">
                    获得{{ slotProps.item.giftName }}x{{
                      slotProps.item.lotteryNum
                    }}
                  </p>
                </div>
              </div>
            </template>
          </List>
        </div>
      </div>
    </van-popup>
    <!-- 抓取记录 -->
    <van-popup v-model:show="data.grabIsShow" @closed="clearData">
      <div class="grab">
        <div class="grab_title">
          <span>抓取记录</span>
          <span>名称</span>
          <span>抓取时间</span>
        </div>
        <div class="grab_main">
          <List
            v-if="data.grabIsShow"
            url="/v2/mstask/catch-duck/lottery-record"
            :params="{
              gameSignNum,
            }"
            :lotteryrecord="data.lotteryRecord"
            :showshow="data.showText"
            :nono="data.nomal"
          >
            <template #default="slotProps">
              <div class="grab_main_item">
                <div class="grab_main_item_left">
                  <img
                    v-lazy="
                      `${slotProps.item.duckUrl}?x-oss-process=image/resize,m_fixed,w_100`
                    "
                    alt=""
                  />
                </div>
                <div class="grab_main_item_name">
                  <span>{{ slotProps.item.duckName }}</span>
                </div>
                <div class="grab_main_item_time">
                  {{
                    parseTime(slotProps.item.createdTime, "{m}-{d} {h}:{i}:{s}")
                  }}
                </div>
              </div>
            </template>
          </List>
        </div>
      </div>
    </van-popup>
    <!-- 购买数量 -->
    <van-popup v-model:show="data.quantityIsShow" @closed="closed">
      <div class="quantity">
        <img
          v-if="activityStatus == 1 && !isIOS()"
          class="quantity_cheaper"
          src="./assets/cheaper.png"
          @click="toCheaper"
        />
        <img
          v-if="data.hasDiscountEffect"
          class="quantity_sub"
          src="./assets/subscript.png"
        />
        <div class="quantity_icon">
          <img src="./assets/icon.png" alt="" />
          <span class="quantity_icon_name">
            小鱼干
            <span class="quantity_icon_num">
              {{ data.hasDiscountEffect ? "9.8" : "10" }}金钻/1个
            </span>
          </span>
        </div>
        <div v-if="data.hasDiscountEffect" class="quantity_original">
          <span>10金钻/1个</span>
        </div>
        <ul :class="{ margin: !data.hasDiscountEffect }">
          <li
            v-for="(item, index) in data.numList"
            :key="item"
            :class="{ activeClass: data.activeIndex === index }"
            @click="changeNum(item.value, index)"
          >
            {{ item.name }}
          </li>
        </ul>
        <div v-if="data.activeIndex === 3" class="quantity_input">
          <van-field
            v-model="data.digit"
            type="digit"
            maxlength="4"
            placeholder="请输入数量~"
            autocomplete="off"
            @keyup="keyup"
          />
        </div>
        <div class="quantity_btn" @click="buy">
          <span v-if="!data.hasDiscountEffect">
            购买{{ data.num ? data.num : 0 }}个 ({{ data.num * 10 }}金钻)
          </span>
          <span v-else>
            购买{{ data.num ? data.num : 0 }}个 ({{
              isInteger(data.num * 10 * 0.98)
            }}金钻)
          </span>
        </div>
        <p v-if="data.hasDiscountEffect" class="quantity_bottom">
          <span>{{ data.num * 10 }}金钻</span>
        </p>
      </div>
    </van-popup>
    <!-- 投喂数量 -->
    <van-popup v-model:show="data.feedingNumIsShow" @closed="feedingClosed">
      <div class="feedingNum">
        <ul>
          <li
            v-for="(item, index) in data.feedingNumList"
            :key="item"
            :class="{ feedingActiveClass: data.feedingActiveIndex === index }"
            @click="changeFeeding(item, index)"
          >
            {{ item }}
          </li>
        </ul>
        <div class="feedingNum_btn">
          <img
            src="./assets/cancel.png"
            alt=""
            @click="data.feedingNumIsShow = false"
          />
          <img src="./assets/confirm.png" alt="" @click="confirm" />
        </div>
      </div>
    </van-popup>
    <!-- 本轮鸭子 -->
    <van-popup
      v-model:show="data.thisRoundDucksIsShow"
      :close-on-click-overlay="false"
    >
      <div class="thisRound">
        <img
          :src="`${data.catchDuckInfo.duckUrl}?x-oss-process=image/resize,m_fixed,w_150`"
          alt=""
        />
        <img
          class="thisRound_name"
          :src="changeDuckName(data.catchDuckInfo.duckName)"
        />
      </div>
    </van-popup>
    <!-- 本轮未抓到鸭子 -->
    <van-popup
      v-model:show="data.notCatchIsShow"
      :close-on-click-overlay="false"
    >
      <div class="notCatch">
        <img src="./assets/notCatchDuck.png" alt="" />
        <img
          src="./assets/confirm.png"
          alt=""
          @click="data.notCatchIsShow = false"
        />
      </div>
    </van-popup>
    <!-- 投喂&抓到鸭子的弹框 -->
    <van-popup
      v-model:show="data.catchDuckIsShow"
      :close-on-click-overlay="false"
    >
      <div class="catchDuck">
        <img
          class="catchDuck_duck"
          :src="`${data.catchDuckInfo.duckUrl}?x-oss-process=image/resize,m_fixed,w_150`"
          alt=""
        />
        <div class="catchDuck_text">
          <p>
            本轮抓到了
            <span>{{ data.catchDuckInfo?.duckAwardInfo?.duckNum }}只</span>
            {{ data.catchDuckInfo.duckName }}
          </p>
          <p>
            获得价值
            <span>{{ data.catchDuckInfo?.duckAwardInfo?.diamondNum }}</span>
            金钻礼物
          </p>
        </div>
        <img
          class="catchDuck_confirm"
          src="./assets/confirm.png"
          alt=""
          @click="data.catchDuckIsShow = false"
        />
      </div>
    </van-popup>
    <!-- 暴走鸭抓到弹框 -->
    <van-popup
      v-model:show="data.rageDucksIsShow"
      :close-on-click-overlay="false"
    >
      <div class="catchDuck rageDuck">
        <img
          class="catchDuck_duck"
          :src="`${data.rageBingoInfo.duckUrl}?x-oss-process=image/resize,m_fixed,w_150`"
          alt=""
        />
        <div class="catchDuck_text">
          <p>
            恭喜抓到了
            <span>{{ data.rageBingoInfo.duckName }}</span>
          </p>
          <p>
            获得价值
            <span>{{ data.rageBingoInfo.diamondNum }}</span>
            金钻
          </p>
        </div>
        <img
          class="catchDuck_confirm"
          src="./assets/confirm.png"
          alt=""
          @click="data.rageDucksIsShow = false"
        />
      </div>
    </van-popup>
    <!-- 获得礼物弹框 -->
    <!-- <div class="rewardDialog">
            <van-popup v-model:show="data.gainGiftIsShow" overlay-class="reward">
                <div class="gain">
                    <ul class="gain_main">
                        <li
                            v-for="(item, index) in data.rewardInfo"
                            :key="index"
                            class="gain_main_item"
                        >
                            <div>
                                <img :src="item.url" alt="" />
                            </div>
                            <p>
                                <span>{{ item.name }}*{{ item.cnt }}</span>
                            </p>
                        </li>
                    </ul>
                    <img
                        class="gain_btn"
                        src="./assets/confirm.png"
                        @click="data.gainGiftIsShow = false"
                    />
                </div>
            </van-popup>
        </div> -->

    <!-- 暴走鸭弹框 -->
    <van-popup v-model:show="data.rageIsShow">
      <div class="rageCard">
        <div class="rageCard_content">
          <img src="./assets/rageContent.png" alt="" />
        </div>
      </div>
      <img
        class="rageBtn"
        src="./assets/rageBtn.png"
        alt=""
        @click="callRageDuck"
      />
    </van-popup>
    <!-- <luckpop v-if="data.luckInfo.isLucky" :num="data.luckInfo.diamondVal"></luckpop> -->
    <!-- 金币兑换 -->
    <GoldPop
      :show-pop="data.showGoldPop"
      :exchange-amount="data.exchangeZSAmount"
      :update-show-pop="updateShowPop"
    />
    <Loading />
  </div>
</template>
<script setup>
import {
  onMounted,
  ref,
  watch,
  reactive,
  onBeforeMount,
  defineAsyncComponent,
  computed,
  defineExpose,
  defineProps,
  defineEmits,
} from "vue";
import lottie from "lottie-web";
import native from "@skr/act-utils/lib/native";
import {
  isIOS,
  parseTime,
  toRechargePage,
  throttleImmediate,
  initLottie,
  toFixeds,
  toDecimal,
  getH5CacheResourceFromApp,
  imgUrlToBase64,
  buryMd5Sign,
  getUrlParam,
  // farmEncodeData
} from "@skr/act-utils/lib/tool";
import request from "@skr/act-service";
import { Toast } from "vant";
import "vant/es/toast/style";
// import { gamePermission } from '@/service/api';
import { dataObj } from "./data";
import { useStore } from "vuex";
import { Loading, GoldPop } from "@skr/act-components";
import { encryptData } from "@/common/cryptoUtil";
const store = useStore();
// const Loading = defineAsyncComponent(() =>
//   import("@skr/act-components/loading/index.vue")
// );
const Rule = defineAsyncComponent(() => import("../../components/rule.vue"));
const List = defineAsyncComponent(() => import("../list/list.vue"));
const BarrageCen = defineAsyncComponent(() =>
  import("../../components/barrageCen.vue")
);
const BarrageFee = defineAsyncComponent(() =>
  import("../../components/barrageFee.vue")
);
// const luckpop = defineAsyncComponent(() => import('@/components/luckstar/pop.vue'));
// const lucknum = defineAsyncComponent(() => import('@/components/luckstar/num.vue'));
// const GoldPop = defineAsyncComponent(() =>
//   import("../../components/goldPop/index.vue")
// );
const RageJackpot = defineAsyncComponent(() =>
  import("../rageJackpot/index.vue")
);
const countDown = ref();
// const luckNum = ref(null);
const barrageCen = ref(null); // 中奖弹幕组件实例
const barrageFee = ref(null); // 投喂弹幕组件实例
const activityStatus = ref(0); //特价超市活动状态
const ducksAll = ref(null);
const rageJackpot = ref(null); // 暴走大奖池
const initPage = ref(true); // 初始化
const gameSignNum = ref(5); // 版本号，控制用户强更新
let isFlag = ref(false);
let longLotteryInfo = ref({});
let isTag = ref(false);
// 是否从从新手引导进来的
// const guideFlag = getUrlParam('guideFlag');
const props = defineProps({
  guideFlag: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits("update:guideFlag");
const data = reactive(dataObj);

// 获取缓存的图片
// const getStateValue = computed(() => (name) => store.state.ducks[name]);

onBeforeMount(async () => {
  data.nomal = (((getUrlParam("userID") - 0) % 100000) + "").padStart(5, "0");
  data.loopLucksAnm = await import("./assets/loopLucks.json");
  getActConfigInfo();
  setCache();
  getDucksInfo(true);
  grabImgList();
});

onMounted(() => {
  getJinzuanOrzuanshi();
  getUserAssets();
  getStatus();
  // 监听页面离开返回
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      getDucksInfo(true);
    }
  });
  getHistoryDucks();
  longLinks();
});

// 获取暴走鸭静态图图片
const grabImgList = () => {
  for (let i = 0; i < 8; i++) {
    data.grabImgList.push(require(`./assets/grabImg${i + 1}.png`));
  }
};

const setImageUrl = (url, key, storeKey) => {
  getH5CacheResourceFromApp(url)
    .then((res) => {
      store.commit(storeKey, {
        key,
        value: res || "",
      });
    })
    .catch((error) => {
      console.log("error", error);
    });
};

// 长链接推送
const longLinks = () => {
  native.registerCallJsMethods("onReceiveRoomH5Msg", (res) => {
    if (isIOS()) {
      if (res.data.roomPopType === 12) {
        data.rageDuckInfo = JSON.parse(res.data.roomPopContent);
        setduckAnm();
      }
      if (res.data.roomPopType === 19) {
        processingData(JSON.parse(res.data.roomPopContent));
      }
    } else {
      let obj = JSON.parse(res.data);
      if (obj.roomPopType === 12) {
        data.rageDuckInfo = JSON.parse(obj.roomPopContent);
        setduckAnm();
      }
      if (obj.roomPopType === 19) {
        processingData(JSON.parse(obj.roomPopContent));
      }
    }
  });
};
const clearData = () => {
  data.duckRecord = "";
  data.lotteryRecord = "";
};

// 处理长链接数据
const processingData = (duckContent) => {
  // 开奖记录
  if (duckContent.scene === "ERPCDS_LotteryRecord") {
    data.lotteryRecord = duckContent.lotteryRecord || "";
    const { clientSign, items } = duckContent.lotteryRecord || {};
    const { currentMS, hasSign, signString } = clientSign || {};
    const tt1 = data.showText + data.nomal + currentMS + "";
    if (clientSign && hasSign) {
      encryptData(
        signString,
        tt1,
        (resource) => {
          initPage.value = false;
          newHandelList(resource);
        },
        true
      );
    } else {
      data.historyDucks = items || [];
    }
    noticeUpload("ERPCDS_LotteryRecord", currentMS || new Date().getTime());
    // 投喂记录
  } else if (duckContent.scene === "ERPCDS_DuckRecord") {
    data.duckRecord = duckContent.duckRecord || "";
    const { clientSign } = duckContent.duckRecord || {};
    const { currentMS } = clientSign || {};
    noticeUpload("ERPCDS_DuckRecord", currentMS || new Date().getTime());
    // 开奖信息
  } else if (duckContent.scene === "ERPCDS_LotteryInfo") {
    const { clientSign } = duckContent.lotteryInfo || {};
    const { hasSign, currentMS, signString } = clientSign || {};
    const tt2 = data.showText + data.nomal + currentMS + "";
    if (hasSign) {
      encryptData(
        signString,
        tt2,
        (resource) => {
          decryptDuckInfo(resource, isFlag.value);
        },
        true
      );
    } else {
      decryptDuckInfo(duckContent.lotteryInfo, isFlag.value);
    }
    noticeUpload("ERPCDS_LotteryInfo", currentMS || new Date().getTime());
    // 鸭子基本信息
  } else if (duckContent.scene === "ERPCDS_DuckInfo") {
    const { clientSign } = duckContent.duckInfo;
    const { hasSign, currentMS, signString } = clientSign || {};
    const tt3 = data.showText + data.nomal + currentMS + "";
    if (hasSign) {
      encryptData(
        signString,
        tt3,
        (resource) => {
          decryptDucksInfo(resource, isFlag.value);
        },
        true
      );
    } else {
      decryptDucksInfo(duckContent.duckInfo, isFlag.value);
    }
    noticeUpload("ERPCDS_DuckInfo", currentMS || new Date().getTime());
  }
};

// 长链接上报
const noticeUpload = async (scene, noticeAtMS) => {
  const params = {
    url: "/v1/mstask/catch-duck/notice-upload",
    method: "post",
    data: {
      noticeAtMS,
      scene,
    },
  };
  try {
    await request(params);
  } catch (err) {
    console.log(err);
  }
};

// 召唤暴走鸭
const callRageDuck = throttleImmediate(async () => {
  const params = {
    url: "/v1/mstask/catch-duck/use-bao-zou-ka",
    method: "post",
    data: {
      gameID: data.gameID,
    },
  };
  try {
    const res = await request(params);
    data.rageDuckInfo = res.data.baoZouDuckInfo || {};
    Toast("召唤成功~");
    setduckAnm();
    getUserAssets();
    data.rageIsShow = false;
  } catch (err) {
    Toast(err.errmsg);
  }
}, 500);

// 设置缓存列表
const setCache = () => {
  data.cacheList.forEach((item) => {
    setImageUrl(item.url, item.name, "ducks/setBackgrondValue");
  });
};

// 获取抓鸭子动画json数据
const getDucksAnmJson = async () => {
  const promisesGrab = [];
  const promisesloop = [];
  for (let i = 0; i < 8; i++) {
    promisesGrab.push(import(`./assets/grab${i + 1}.json`));
    promisesloop.push(import(`./assets/limit${i + 1}.json`));
  }
  try {
    const [grabItems, loopItems] = await Promise.all([
      Promise.all(promisesGrab),
      Promise.all(promisesloop),
    ]);
    data.animationList = grabItems.map((item, index) => ({
      key: index,
      value: item,
    }));
    data.animationList.sort((a, b) => a.key - b.key);
    data.animationLoopList = loopItems.map((item, index) => ({
      key: index,
      value: item,
    }));
    data.animationLoopList.sort((a, b) => a.key - b.key);
  } catch (error) {
    console.log(error);
  }
};

// 监听循环动画引入成功，dom加载完成初始化循环动画
watch(
  () => [data.loopLucksAnm, ducksAll],
  (newVal) => {
    if (newVal[0] && newVal[1].value) {
      // import('./assets/limit1.json').then((res) => {
      //     data.loopAnm = initLottie('.ducks_bgc_ducksAll', res);
      //     // if (!guideFlag) {
      //     data.loopAnm.addEventListener('DOMLoaded', () => {
      //         data.pageIsShow = true;
      //     });
      // });
      data.loopAnm = initLottie(".ducks_bgc_ducksAll", data.loopLucksAnm);
      // if (!guideFlag) {
      data.loopAnm.addEventListener("DOMLoaded", () => {
        data.pageIsShow = true;
      });

      // }
    }
  },
  { deep: true }
);

// 去充值
const toRecharge = () => {
  toRechargePage(true, getUserAssets);
};

watch(
  () => data.countdownCopy,
  (newVal) => {
    if (newVal) {
      if (newVal === "投喂剩余时间") {
        data.timer = setInterval(() => {
          getFeedingList();
          getDucksVersion();
        }, 5000);
      } else {
        clearInterval(data.timer);
        data.barrageInfo = [];
        data.userBetInfo = [];
      }
    }
  },
  { immediate: true }
);

/* watch(
    () => data.animationList,
    (newVal) => {
        newVal.length === 8 && getDucksInfo(true);
    },
    { deep: true }
); */

// 获取抓鸭子版本号
const getDucksVersion = async () => {
  const timeMs = Date.now();
  const data = {
    dataId: "skr-ducks-version",
    group: "skrweb",
    namespaceId: "namespace_web",
    timeMs,
    apiSecret: "skr2020",
  };

  const params = {
    url: "/v1/kconf/config",
    method: "post",
    data: {
      dataId: "skr-ducks-version",
      group: "skrweb",
      namespaceId: "namespace_web",
      timeMs,
      sign: buryMd5Sign(data),
    },
  };
  try {
    const res = await request(params, false);
    const version = JSON.parse(res.data.content)?.version;
    clearCache(version);
  } catch (err) {
    console.log(err);
    return false;
  }
};

// 清除缓存
const clearCache = async (version) => {
  const ducksVersion = localStorage.getItem("ducksVersion");
  if (!ducksVersion) {
    localStorage.setItem("ducksVersion", version);
    return;
  }
  if (ducksVersion !== version) {
    localStorage.setItem("ducksVersion", version);
    native.cleanCacheAndReload({});
  }
};

// 更新金钻弹框
const updateShowPop = (value, flag) => {
  data.showGoldPop = value;
  if (flag) {
    handleBuy();
  }
};

// 判断是否是整数
const isInteger = (num) => (num % 1 === 0 ? num : num.toFixed(1));

// 获取当前活动时间
const getActConfigInfo = async () => {
  const params = {
    url: "/v1/mstask/activity-config-info",
    method: "get",
    params: {
      activityID: 48,
    },
  };
  try {
    const res = await request(params);
    data.showJinzuan = res.data.configInfo?.baseInfo?.spendType || 0;
  } catch (err) {
    console.log(err);
  }
};

// 获取是钻石购买还是金币购买
const getJinzuanOrzuanshi = async (needAmount = 0.001, callback) => {
  const params = {
    url: "/v1/wallet/jz-assist-exchange-by-zs",
    method: "post",
    data: {
      objectID: 48,
      exchangeScene: 3,
      needAmount: needAmount * 1000,
      platform: isIOS() ? 10 : 20,
    },
  };

  try {
    const res = await request(params);
    const {
      costPriceType,
      currentJZAmount,
      jzExchangeState,
      exchangeZSAmount,
    } = res.data;
    data.userAssets.jzBalance = currentJZAmount || 0;
    data.costPriceType = costPriceType || 0;
    if (callback) {
      if (jzExchangeState === 1) {
        callback();
      } else if (jzExchangeState === 2) {
        data.exchangeZSAmount = exchangeZSAmount || 0;
        data.showGoldPop = true;
      } else if (jzExchangeState === 3) {
        Toast("蓝钻石余额不足");
        toRechargePage();
      }
    }
  } catch (err) {
    console.log(err);
  }
};

// 抓中鸭子的名字
const changeDuckName = computed(() => {
  const duckNameMap = new Map();
  data.ducksNameList.forEach((item) => {
    duckNameMap.set(item.name, item.imgUrl);
  });
  return (name) => {
    return duckNameMap.get(name) || "";
  };
});

// 获取抓鸭子记录
const getHistoryDucks = async () => {
  const params = {
    url: "/v2/mstask/catch-duck/lottery-record",
    method: "get",
    params: {
      offset: 0,
      limit: 15,
      gameSignNum: gameSignNum.value,
    },
  };
  try {
    const res = await request(params, false);
    const { clientSign, sync } = res.data || {};
    if (sync) {
      return;
    }
    const { currentMS, hasSign, signString } = clientSign || {};
    const tt3 = data.showText + data.nomal + currentMS + "";
    if (clientSign && hasSign) {
      encryptData(
        signString,
        tt3,
        (resource) => {
          initPage.value = false;
          newHandelList(resource);
        },
        true
      );
      return;
    }
    data.historyDucks = res.data.items || [];
  } catch (err) {
    console.log(err);
  }
};
const newHandelList = (resource) => {
  // console.log(resource, 'resource122');
  const { items } = resource;
  data.historyDucks = items || [];
};

//特价超市展示状态
const getStatus = async () => {
  const params = {
    url: "/v1/mstask/activity-award-grant-details",
    method: "get",
    params: {
      activityID: 71,
      platform: isIOS() ? 10 : 20,
    },
  };
  try {
    const res = await request(params);
    activityStatus.value = res.data.baseInfo?.activityStatus;
  } catch (error) {
    console.log(error);
  }
};

// 是否选中大礼物
const select = async () => {
  if (data.currentTime <= 10) {
    Toast("即将开奖，请下轮游戏调整～");
    return;
  }
  data.selectFlag = !data.selectFlag;
  const params = {
    url: "/v1/mstask/catch-duck/auto-exchange",
    method: "post",
    data: {
      exchangeState: data.selectFlag ? 2 : 1,
    },
  };
  try {
    const res = await request(params);
    data.selectFlag = res.data.exchangeState === 2 ? true : false;
  } catch (err) {
    console.log(err);
  }
};

// 抓鸭子动画
const lottieInit = async (animationData, tag, surplusTimeMs) => {
  data.giftZIindexIsShow = false;
  data.ducksIsShow = false;
  const icon = document.querySelector("#animation");
  const lottieData = {
    container: icon, // 包含动画的dom元素
    renderer: "svg", // 渲染出来的是什么格式
    loop: false, // 循环播放
    autoplay: true, // 自动播放
    animationData, // data.animationList[num - 1].value // 动画json的路径
  };

  // lottieData.animationData = animationJson;

  const anm = lottie.loadAnimation(lottieData);
  if (tag && surplusTimeMs - 1 < 6) {
    anm.goToAndPlay((6 - (surplusTimeMs - 1)) * 1000);
  }
  anm.addEventListener("complete", () => {
    data.giftZIindexIsShow = true;
    // 用户本轮没有投喂，走正常弹框
    if (!data.betInfos.length) {
      data.thisRoundDucksIsShow = true;
    } else {
      // 用户投喂了但是没有抓到鸭子,展示未抓中鸭子弹框
      if (!data.catchDuckInfo.isDraw) {
        data.notCatchIsShow = true;
      } else {
        data.catchDuckIsShow = true;
        if (data.catchDuckInfo.baoZouInfo) {
          data.rageDucksIsShow = true;
        }
      }
    }
    /* if (data.catchDuckInfo.isDraw) {
            data.gainGiftIsShow = true;
        }
        setTimeout(() => {
            data.gainGiftIsShow = false;
        }, 5000); */
    getHistoryDucks();
    setTimeout(() => {
      data.ducksIsShow = true;
    }, 300);
    setTimeout(() => {
      anm.destroy();
    }, 3000);
  });
};

// 查询抓鸭子鸭子投喂记录
const getFeedingList = async () => {
  const params = {
    url: "/v1/mstask/catch-duck/user-bet-info",
    method: "get",
    params: {
      gameID: data.gameID,
      gameSignNum: gameSignNum.value,
    },
  };
  try {
    const res = await request(params, false);
    const { clientSign } = res.data || {};
    const { hasSign, currentMS, signString } = clientSign || {};
    const tt3 = data.showText + data.nomal + currentMS + "";
    if (hasSign) {
      encryptData(
        signString,
        tt3,
        (resource) => {
          decryptFeedingList(resource);
        },
        true
      );
      return;
    }
    res.data.userBetInfo &&
      res.data.userBetInfo.forEach((item) => {
        if (data.barrageInfo.length) {
          if (
            !JSON.stringify(data.barrageInfo).includes(JSON.stringify(item.ID))
          ) {
            data.barrageInfo.push(item);
            data.userBetInfo.push({
              text: item.info,
              id: getUUID(),
              onlyID: item.ID,
            });
          }
        } else {
          data.barrageInfo.push(item);
          data.userBetInfo.push({
            text: item.info,
            id: getUUID(),
            onlyID: item.ID,
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
};

const decryptFeedingList = (resource) => {
  resource.userBetInfo &&
    resource.userBetInfo.forEach((item) => {
      if (data.barrageInfo.length) {
        if (
          !JSON.stringify(data.barrageInfo).includes(JSON.stringify(item.ID))
        ) {
          data.barrageInfo.push(item);
          data.userBetInfo.push({
            text: item.info,
            id: getUUID(),
            onlyID: item.ID,
          });
        }
      } else {
        data.barrageInfo.push(item);
        data.userBetInfo.push({
          text: item.info,
          id: getUUID(),
          onlyID: item.ID,
        });
      }
    });
};

// 动画逻辑
const setduckAnm = async () => {
  // 从session里获取上轮抓鸭子位置信息
  const ragePosition = sessionStorage.getItem("ragePosition") || "";
  const parsedRagePosition = +ragePosition;
  // 如果ragePosition没有 || 上轮的暴走鸭位置 !== 本轮暴走鸭位置就执行（防止抓鸭子动画重复初始化）
  if (!ragePosition || parsedRagePosition !== data.rageDuckInfo.position) {
    const rageDuckInfo = data.rageDuckInfo;
    // 如果暴走鸭循环动画还未引入就直接加载对应的循环动画
    if (!data.animationLoopList.length) {
      let anmName =
        rageDuckInfo && rageDuckInfo.position !== 0
          ? `limit${rageDuckInfo.position}`
          : "loopLucks";
      data.loopLucksAnm = await import(`./assets/${anmName}.json`);
      // 如果当前轮次有暴走鸭，就提前引入普通抓鸭子循环动画，为了方便下面使用，避免用的时候才引入。
      setTimeout(() => {
        if (anmName !== "loopLucks") {
          import("./assets/loopLucks.json").then((res) => {
            data.plainLoopLucksAnm = res;
          });
        }
      }, 3000);
      data.loopAnm && data.loopAnm.destroy();
      data.loopAnm = initLottie(".ducks_bgc_ducksAll", data.loopLucksAnm);
    } else {
      // 如果暴走鸭循环动画引入了 && 当前轮次有暴走鸭，就替换为暴走鸭对应的暴走鸭动画（直接从数组中取）
      const loopAnm =
        rageDuckInfo && rageDuckInfo.position !== 0
          ? data.animationLoopList[rageDuckInfo.position - 1].value
          : data.plainLoopLucksAnm || data.loopLucksAnm;
      data.loopAnm && data.loopAnm.destroy();
      data.loopAnm = initLottie(".ducks_bgc_ducksAll", loopAnm);
    }
    // 将本轮暴走鸭位置信息存到session里
    sessionStorage.setItem("ragePosition", rageDuckInfo.position);
  }
};

// 获取抓鸭子信息
const getDucksInfo = async (flag = false) => {
  // let currentMS = Date.now();
  // let encodeData = {
  //     platform: isIOS() ? 10 : 20,
  //     gameSignNum: 'v2'
  // };
  // let clientSign = {
  //     currentMS,
  //     hasSign: true
  // };
  // farmEncodeData(
  //     encodeData,
  //     currentMS,
  //     async (res) => {
  //         clientSign = {
  //             ...clientSign,
  //             signString: res
  //         };
  //     },
  //     true
  // );
  const params = {
    url: "/v2/mstask/catch-duck/get",
    method: "post",
    data: {
      // clientSign,
      platform: isIOS() ? 10 : 20,
      gameSignNum: gameSignNum.value,
    },
  };

  try {
    const res = await request(params, false);
    isFlag.value = flag;
    const {
      giftList,
      lotteryInfo,
      betInfos,
      gameID,
      exchangeState,
      catchDuckPerOpenSecond,
      catchDuckBeforeOpenSecond,
      hasDiscountEffect,
      baoZouDuckInfo,
      clientSign,
      sync,
    } = res.data;
    const { hasSign, currentMS, signString } = clientSign || {};
    const tt3 = data.showText + data.nomal + "" + currentMS + "";
    // 如果接口返回的sync为true，走长链接逻辑处理
    if (sync) {
      return;
    }
    if (hasSign) {
      encryptData(
        signString,
        tt3,
        (resource) => {
          decryptDucksInfo(resource, flag);
        },
        true
      );
      return;
    }

    data.lotteryInfo = lotteryInfo || {};
    data.gameID = gameID;
    data.selectFlag = exchangeState === 2 ? true : false;
    data.giftList = giftList || [];
    data.betInfos = betInfos || [];
    data.surplusTimeMs = (lotteryInfo.surplusTimeMs + 1) * 1000;
    data.catchDuckPerOpenSecond = catchDuckPerOpenSecond;
    data.catchDuckBeforeOpenSecond = catchDuckBeforeOpenSecond;
    data.hasDiscountEffect = hasDiscountEffect || false;
    data.rageDuckInfo = baoZouDuckInfo || {
      position: 0,
    };
    setduckAnm();
    data.giftList.forEach((item) => {
      data.betInfos.forEach((elem) => {
        if (item.position === elem.position) {
          item.betNum = elem.betNum;
        }
      });
    });
    if (flag && data.lotteryInfo.state === 4) {
      data.isTag = true;
      getCatchDuckInfo(true);
      if (data.currentTime === 1) {
        data.ducksIsShow = true;
      }
    }
    if (!data.animationList.length) {
      if (lotteryInfo.surplusTimeMs > 12) {
        setTimeout(() => {
          getDucksAnmJson();
        }, 4000);
      }
    }
  } catch (err) {
    // console.log(err);
    Toast(err.errmsg);
  }
};

// 解密抓鸭子信息
const decryptDucksInfo = (resource, flag) => {
  if (!resource) {
    return;
  }
  const {
    giftList,
    lotteryInfo,
    betInfos,
    gameID,
    exchangeState,
    catchDuckPerOpenSecond,
    catchDuckBeforeOpenSecond,
    hasDiscountEffect,
    baoZouDuckInfo,
  } = resource;
  data.lotteryInfo = lotteryInfo || {};
  data.gameID = gameID;
  data.selectFlag = exchangeState === 2 ? true : false;
  data.giftList = giftList || [];
  data.betInfos = betInfos || [];
  data.surplusTimeMs = (lotteryInfo.surplusTimeMs + 1) * 1000;
  data.catchDuckPerOpenSecond = catchDuckPerOpenSecond;
  data.catchDuckBeforeOpenSecond = catchDuckBeforeOpenSecond;
  data.hasDiscountEffect = hasDiscountEffect || false;
  data.rageDuckInfo = baoZouDuckInfo || {
    position: 0,
  };
  setduckAnm();
  data.giftList.forEach((item) => {
    data.betInfos.forEach((elem) => {
      if (item.position === elem.position) {
        item.betNum = elem.betNum;
      }
    });
  });
  if (flag && data.lotteryInfo.state === 4) {
    data.isTag = true;
    getCatchDuckInfo(true);
    if (data.currentTime === 1) {
      data.ducksIsShow = true;
    }
  }
  if (!data.animationList.length) {
    if (lotteryInfo.surplusTimeMs > 12) {
      setTimeout(() => {
        getDucksAnmJson();
      }, 4000);
    }
  }
};

// 倒计时变化时触发
const changeTime = ({ seconds }) => {
  // 更新当前时间
  data.currentTime = seconds;
  // 根据当前时间设置倒计时文本
  if (seconds >= data.catchDuckPerOpenSecond - 2) {
    data.countdownCopy = "准备投喂剩余时间";
    longLotteryInfo.value = {};
  } else if (seconds < data.catchDuckPerOpenSecond - 2 && seconds >= 8) {
    data.countdownCopy = "投喂剩余时间";
    nextTick(() => {
      // 如果弹幕费用存在，则显示下一个弹幕
      barrageFee.value && barrageFee.value.showNextBullet();
    });
  } else if (seconds < 8 && seconds > 5) {
    data.countdownCopy = "准备抓鸭子剩余时间";
  } else {
    data.countdownCopy = "抓鸭子剩余时间";
  }
  // 如果当前时间大于4秒，则隐藏本轮鸭子、未抓中和抓中的显示
  if (seconds > 4) {
    data.thisRoundDucksIsShow = false;
    data.notCatchIsShow = false;
    data.catchDuckIsShow = false;
  }
  // 如果当前时间等于抓鸭子前的开启时间，则获取抓鸭子信息
  if (seconds === data.catchDuckBeforeOpenSecond) {
    isTag.value = false;
    getCatchDuckInfo();
  }
};

// 查询用户剩余资产信息
const getUserAssets = async () => {
  const params = {
    url: "/v1/mstask/catch-duck/user-info",
    method: "post",
    data: {
      platform: isIOS() ? 10 : 20,
    },
  };
  try {
    const res = await request(params);
    const { userInfo } = res.data;
    data.userAssets = { ...data.userAssets, ...userInfo } || {};
  } catch (err) {
    console.log(err);
  }
};

// 查询当前抓鸭子开奖信息
const getCatchDuckInfo = async (tag = false) => {
  // let currentMS = Date.now();
  // let encodeData = {
  //     gameID: data.gameID,
  //     gameSignNum: 'v2'
  // };
  // let clientSign = {
  //     currentMS,
  //     hasSign: true
  // };
  // farmEncodeData(
  //     encodeData,
  //     currentMS,
  //     async (res) => {
  //         clientSign = {
  //             ...clientSign,
  //             signString: res
  //         };
  //     },
  //     true
  // );
  const params = {
    url: "/v2/mstask/catch-duck/lottery",
    method: "get",
    params: {
      // clientSign,
      gameID: data.gameID,
      gameSignNum: gameSignNum.value,
    },
  };
  try {
    const res = await request(params, false);
    const { clientSign, sync } = res.data || {};
    const { hasSign, currentMS, signString } = clientSign || {};
    const tt4 = data.showText + data.nomal + "" + currentMS + "";
    if (sync) {
      return;
    }
    if (hasSign) {
      encryptData(
        signString,
        tt4,
        (resource) => {
          decryptDuckInfo(resource, tag);
        },
        true
      );
      return;
    }
    data.catchDuckInfo = res.data;
    if (res.data.baoZouInfo) {
      data.rageBingoInfo = res.data.baoZouInfo || {};
    }
    data.rewardInfo = res.data.item || [];
    const animationJson = data.animationList.length
      ? JSON.parse(
          JSON.stringify(data.animationList[res.data.lotteryPosition - 1].value)
        )
      : await import(`./assets/grab${res.data.lotteryPosition}.json`);
    // 替换暴走鸭
    if (data.rageDuckInfo && data.rageDuckInfo.position) {
      const imgUrl = data.grabImgList[data.rageDuckInfo.position - 1];
      const image_0 = await imgUrlToBase64(imgUrl);
      const item = animationJson.assets.find(
        (item) =>
          +item.id.split("_")[1] === data.rageDuckInfo.position &&
          item.id.split("_")[0] !== "image"
      );
      if (item) {
        item.p = image_0;
      }
    }
    lottieInit(animationJson, tag, res.data.surplusTimeMs);
    data.list[0] = { text: res.data.lotteryMsg, id: getUUID() };
    if (
      (data.rageDuckInfo.position &&
        data.rageDuckInfo.position === res.data.lotteryPosition) ||
      data.rageDuckInfo.position === 1
    ) {
      return;
    }
    rageJackpot.value && rageJackpot.value.getRageJackpotNum();
  } catch (err) {
    console.log(err);
  }
};

// 抓鸭子开奖信息
const decryptDuckInfo = async (sourceValue, tag) => {
  data.catchDuckInfo = sourceValue;
  if (sourceValue.baoZouInfo) {
    data.rageBingoInfo = sourceValue.baoZouInfo || {};
  }
  data.rewardInfo = sourceValue.item || [];
  const animationJson = data.animationList.length
    ? JSON.parse(
        JSON.stringify(
          data.animationList[sourceValue.lotteryPosition - 1].value
        )
      )
    : await import(`./assets/grab${sourceValue.lotteryPosition}.json`);
  // 替换暴走鸭
  if (data.rageDuckInfo && data.rageDuckInfo.position) {
    const imgUrl = data.grabImgList[data.rageDuckInfo.position - 1];
    const image_0 = await imgUrlToBase64(imgUrl);
    const item = animationJson.assets.find(
      (item) =>
        +item.id.split("_")[1] === data.rageDuckInfo.position &&
        item.id.split("_")[0] !== "image"
    );
    if (item) {
      item.p = image_0;
    }
  }
  lottieInit(animationJson, tag, sourceValue.surplusTimeMs);
  data.list[0] = { text: sourceValue.lotteryMsg, id: getUUID() };
  if (
    (data.rageDuckInfo.position &&
      data.rageDuckInfo.position === sourceValue.lotteryPosition) ||
    data.rageDuckInfo.position === 1
  ) {
    return;
  }
  rageJackpot.value && rageJackpot.value.getRageJackpotNum();
};

// 倒计时结束时触发
const finish = async () => {
  setTimeout(async () => {
    await getDucksInfo(false);
    getHistoryDucks();
    countDown?.value?.start();
    barrageCen.value && barrageCen.value.showNextBullet();
  }, 1000);
  data.thisRoundDucksIsShow = false;
  data.notCatchIsShow = false;
  data.catchDuckIsShow = false;
  // if (data.rageDuckInfo.position === 1) {
  // }
  // 如果是新手引导进来的 抓完之后跳转到豪礼降临页面
  if (props.guideFlag) {
    purchaseDriedFish();
  }
};

// 调6元购买小鱼干接口, 判断是否能弹起
const purchaseDriedFish = async () => {
  const params = {
    url: "/v1/mstask/set-ceremony-come",
    method: "post",
    data: {
      taskType: 19,
    },
  };
  try {
    await request(params);
    location.href =
      "inframeskr://web/fullScreen?showType=3&animateType=1&backgroundOpacity=true&newURL=https%3A%2F%2Fact.inframe.mobi%2Fmothcharge%2F%3Ftitle%3D1";
    // 通知父组件更新value
    emits("update:guideFlag", false);
  } catch (err) {
    console.log(err);
  }
};

const keyup = () => {
  if (data.digit <= 0) {
    data.digit = "";
  }
};

// 投喂
const startFeeding = (item) => {
  const getAppVersion =
    window.navigator.userAgent.match(/appVersion\/([0-9A-Fa-f-]+)/) || "";
  if (!getAppVersion) {
    Toast("暂不支持投喂~");
    return;
  }
  if (data.currentTime >= data.catchDuckPerOpenSecond - 2) {
    Toast("鸭子正在赶来的路上，请稍后~");
  } else if (data.currentTime <= 8 && data.currentTime > 4) {
    Toast("正在抓取中，请稍后~");
  } else if (data.currentTime <= 4) {
    Toast("发放奖品中，游戏马上开始~");
  } else {
    data.feedingActiveIndex = data.userAssets.nobleLevel <= 30 ? 1 : 2;
    data.feedingNumIsShow = true;
    data.giftInfo = item;
  }
};

// 确认函数
const confirm = throttleImmediate(async () => {
  native.permissionCheck({ permissionCheckScene: 17 }).then(async (res) => {
    if (res.hasPermission) {
      // 将isLucky设置为false
      data.luckInfo.isLucky = false;
      // 获取礼物位置
      const { position } = data.giftInfo;
      // let currentMS = Date.now();
      // let encodeData = {
      //     betInfo: {
      //         betNum: data.feedingNumList[data.feedingActiveIndex],
      //         position
      //     },
      //     gameID: data.gameID,
      //     platform: isIOS() ? 10 : 20,
      //     userType: 1,
      //     gameSignNum: 'v2'
      // };
      // let clientSign = {
      //     currentMS,
      //     hasSign: true
      // };
      // farmEncodeData(
      //     encodeData,
      //     currentMS,
      //     async (res) => {
      //         clientSign = {
      //             ...clientSign,
      //             signString: res
      //         };
      //     },
      //     true
      // );
      // 设置请求参数
      const params = {
        url: "/v1/mstask/catch-duck/bet",
        method: "post",
        data: {
          // clientSign
          betInfo: {
            betNum: data.feedingNumList[data.feedingActiveIndex],
            position,
          },
          gameID: data.gameID,
          platform: isIOS() ? 10 : 20,
          userType: 1,
          gameSignNum: gameSignNum.value,
        },
      };
      try {
        // 发送请求
        const res = await request(params);
        // 解构响应数据
        const { betInfos, userInfo, superStarInfo, userBetInfo, clientSign } =
          res.data;
        const { hasSign, currentMS, signString } = clientSign || {};
        const tt4 = data.showText + data.nomal + "" + currentMS + "";
        if (hasSign) {
          encryptData(
            signString,
            tt4,
            (resource) => {
              decryptcatchDuck(resource);
            },
            true
          );
          return;
        }
        // 更新数据
        data.betInfos = betInfos;
        data.userAssets = { ...userInfo, jzBalance: data.userAssets.jzBalance };
        // 创建礼物映射
        const giftMap = new Map();
        betInfos.forEach((elem) => {
          giftMap.set(elem.position, elem.betNum);
        });
        // 更新礼物列表
        data.giftList.forEach((item) => {
          if (giftMap.has(item.position)) {
            item.betNum = giftMap.get(item.position);
          }
        });
        // 显示投喂成功提示
        Toast("投喂成功~");
        // 隐藏喂食数量
        data.feedingNumIsShow = false;
        // 更新投注信息和弹幕信息
        const newBetInfo = [];
        const newBarrageInfo = [];
        userBetInfo.forEach((item) => {
          newBetInfo.push({ text: item.info, id: getUUID(), onlyID: item.ID });
          newBarrageInfo.push(item);
        });
        data.userBetInfo = [...newBetInfo, ...data.userBetInfo];
        data.barrageInfo = [...newBarrageInfo, ...data.barrageInfo];
        // 更新幸运号码信息
        // luckNum.value.getInfo();
        data.luckInfo = superStarInfo || { diamondVal: 0, isLucky: false };
        // 如果当前有暴走鸭，刷新当前暴走鸭奖池
        rageJackpot.value && rageJackpot.value.getRageJackpotNum();
      } catch (err) {
        // 显示错误提示
        Toast(err.errmsg);
      }
    }
  });
}, 1000);

const decryptcatchDuck = (resource) => {
  const { betInfos, userInfo, superStarInfo, userBetInfo } = resource;
  // 更新数据
  data.betInfos = betInfos;
  data.userAssets = { ...userInfo, jzBalance: data.userAssets.jzBalance };
  // 创建礼物映射
  const giftMap = new Map();
  betInfos.forEach((elem) => {
    giftMap.set(elem.position, elem.betNum);
  });
  // 更新礼物列表
  data.giftList.forEach((item) => {
    if (giftMap.has(item.position)) {
      item.betNum = giftMap.get(item.position);
    }
  });
  // 显示投喂成功提示
  Toast("投喂成功~");
  // 隐藏喂食数量
  data.feedingNumIsShow = false;
  // 更新投注信息和弹幕信息
  const newBetInfo = [];
  const newBarrageInfo = [];
  userBetInfo.forEach((item) => {
    newBetInfo.push({ text: item.info, id: getUUID(), onlyID: item.ID });
    newBarrageInfo.push(item);
  });
  data.userBetInfo = [...newBetInfo, ...data.userBetInfo];
  data.barrageInfo = [...newBarrageInfo, ...data.barrageInfo];
  // 更新幸运号码信息
  // luckNum.value.getInfo();
  data.luckInfo = superStarInfo || { diamondVal: 0, isLucky: false };
  // 如果当前有暴走鸭，刷新当前暴走鸭奖池
  rageJackpot.value && rageJackpot.value.getRageJackpotNum();
};

// 生成唯一ID
const getUUID = () => Date.now() + Math.random();

// 投喂数量dialog关闭动画结束时触发
const feedingClosed = () => {
  data.feedingActiveIndex = data.userAssets.nobleLevel <= 30 ? 1 : 2;
};

// 切换投喂数量
const changeFeeding = (item, index) => {
  data.feedingActiveIndex = index;
};

//是否实名认证
const buy = throttleImmediate(() => {
  native.permissionCheck({ permissionCheckScene: 17 }).then((res) => {
    if (res.hasPermission) {
      //实物奖励并且没有地址
      buyFish();
    }
  });
  // let checkResult = localStorage.getItem('checkResult');
  /* if (checkResult) {
        buyFish();
    } else {
        gamePermission(17).then((res) => {
            if (res.data.checkResult != 1) {
                Toast(res.data.msg);
            }
            if (res.data.checkResult == 1) {
                localStorage.setItem('checkResult', res.data.checkResult);
                buyFish();
            }
        });
    } */
}, 1000);

// 购买蓝色妖姬
const buyFish = async () => {
  if (!data.num) {
    Toast("请输入数量~");
    return;
  }
  // 只消耗钻石
  if (
    data.costPriceType === 0 ||
    data.userAssets.jzBalance <= 0 ||
    data.showJinzuan === 0
  ) {
    return handleBuy();
  } else if (data.costPriceType === 1) {
    const needAmount = parseInt(data.num) * 10;
    // 消耗金钻
    getJinzuanOrzuanshi(needAmount, handleBuy);
  }
};

const handleBuy = async () => {
  const { costPriceType } = data;
  const params = {
    url: "/v1/mstask/catch-duck/charge-fish",
    method: "get",
    params: {
      platform: isIOS() ? 10 : 20,
      chargeNum: parseInt(data.num),
      costPriceType,
    },
  };
  try {
    const res = await request(params);
    data.userAssets = res.data.userInfo;
    Toast("购买成功~");
    data.quantityIsShow = false;
    getJinzuanOrzuanshi();
  } catch (err) {
    Toast(err.errmsg);
    if (err.errno === 8352213) {
      setTimeout(() => {
        toRechargePage(true);
      }, 500);
    }
  }
};

//打开每日特价超市
function toCheaper() {
  // window.location.href = '/cheaper?title=1&from=h5&userID=' + getUrlParam('userID');
  window.location.href =
    "inframeskr://web/fullScreen?showType=0&newURL=https%3A%2F%2Fact.inframe.mobi%2Fnchs%2F%3Ftitle%3D1%26a%3D1";
  // native.closePage();
}

// 关闭页面
const close = () => {
  native.closePage();
};

// 投喂记录
const feedingRecord = () => {
  data.feedIsShow = true;
};

// 抓取记录
const captureRecords = () => {
  data.grabIsShow = true;
};

// 获取
const obtain = () => {
  data.quantityIsShow = true;
};

// 切换蓝色妖姬购买数量
const changeNum = (item, index) => {
  data.activeIndex = index;
  data.num = item;
};

const closed = () => {
  data.activeIndex = 1;
  data.num = 10;
  data.digit = "";
};

watch(
  () => data.digit,
  (newVal) => {
    if (data.activeIndex === 3) {
      data.num = newVal;
    }
  }
);

watch(
  () => data.activeIndex,
  (newVal) => {
    if (newVal !== 3) {
      data.digit = "";
    }
  }
);

defineExpose({
  getDucksInfo,
  getUserAssets,
});
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
