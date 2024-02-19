<template>
  <div class="rule">
    <div class="rule_content">
      <ul>
        <li style="color: #f55555">
          ·
          <p>
            限时活动：小龙鸭上线啦！抓到一只小龙鸭即可获得价值660金钻礼物，限时开启，快去抓鸭子吧~
          </p>
        </li>
        <li>
          ·
          <p>
            抓鸭子游戏开启后，每局你可以选择投喂一只或多只鸭子，如果你当前局投喂的鸭子被抓取，将根据您投喂对应鸭子的小鱼干数量，获得该鸭子对应的礼物及数量（勾选自动兑换大礼物后将根据你的获奖价值自动兑换大礼物，规则见下文详情）；
          </p>
        </li>
        <li>
          ·
          <p>
            抓鸭子玩法每局30秒抓取一只鸭子，您有20秒时间选择投喂鸭子，该时间内你可以选择投喂多只鸭子，每只鸭子可选择投喂多条小鱼干；
          </p>
        </li>
        <li>
          ·
          <p>
            花费10金钻可以购买1条小鱼干，使用1条小鱼干可以投喂1次鸭子。（金钻可以通过商城购买金钻礼包，或者收到金钻礼物获得，金钻余额不足时会自动使用钻石进行补齐）；
          </p>
        </li>
        <li>
          ·
          <p>
            参与抓鸭子游戏所获得礼物均为金钻礼物，金钻礼物仅可用于平台内赠送好友，收礼人获得金钻，金钻可购买装扮道具、赠送礼物进行平台内娱乐，金钻并不可以提现；
          </p>
        </li>
        <li>
          ·
          <p>
            抓鸭子游戏是提升用户在撕歌房间内体验的游戏玩法，仅供娱乐交流使用，用户通过游戏获得礼物道具仅限于平台内赠送使用，官方不提供任何反向兑换法币、现金或者其他任何具备交换价值的物品，不得用于任何形式的盈利活动。
          </p>
        </li>
        <li>
          ·
          <p>
            撕歌平台严禁用户之间进行任何形式的私下交易，违规用户将会按照平台内规定进行严肃处理，请广大玩家谨防上当受骗，请勿参与违法违规交易；
          </p>
        </li>
        <li>
          ·
          <p>
            撕歌平台严禁任何形式的涉赌行为，严禁用户将所获得礼物道具进行私下交易，用户需自行承担不利后果，并且官方一经发现会主动进行关联账号冻结，并举报给相关部门审查，欢迎广大玩家通过在线客服向平台举报私下违规交易。
          </p>
        </li>
        <li>
          ·
          <p>
            本游戏限时开启，撕歌官方有权根据运营情况及用户反馈，调整活动时间与玩法规则；
          </p>
        </li>
      </ul>
      <ul>
        <li>
          ·
          <p>鸭子对应的礼物与抓取概率</p>
        </li>
      </ul>
      <table border="1" cellspacing="0">
        <tr class="header">
          <td>鸭子</td>
          <td>概率</td>
          <td>礼物价值（金钻）</td>
          <td>礼物名</td>
        </tr>
        <tr
          v-for="item in data.probabilityList"
          :key="item.duckName"
          :class="['bo', { xiaolongya: item.duckName === '小龙鸭' }]"
        >
          <td>{{ item.duckName }}</td>
          <td>{{ item.pro }}</td>
          <td>{{ item.value }}</td>
          <td>{{ item.giftName }}</td>
        </tr>
      </table>
      <ul>
        <li>
          ·
          <p>兑换大礼物的规则对照</p>
        </li>
      </ul>
      <table border="1" cellspacing="0">
        <tr class="header">
          <td>礼物名称</td>
          <td>礼物价值（金钻）</td>
        </tr>
        <tr v-for="item in data.bigGiftList" :key="item.giftName" class="bo">
          <td>{{ item.giftName }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </table>
      <ul>
        <li v-if="isIOS()">注：此游戏活动与苹果公司inc无关。</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { isIOS } from "@skr/act-utils/lib/tool";
import { reactive } from "vue";

const data = reactive({
  probabilityList: [
    { duckName: "厉害鸭", pro: "1.6%", value: 520, giftName: "比心告白" },
    { duckName: "小龙鸭", pro: "3%", value: 660, giftName: "糖果瓶" },
    { duckName: "心动鸭", pro: "7%", value: 150, giftName: "珍珠贝壳" },
    { duckName: "唱歌鸭", pro: "8%", value: 128, giftName: "秋千兔" },
    { duckName: "干饭鸭", pro: "10.6%", value: 100, giftName: "银河星海" },
    { duckName: "栓Q鸭", pro: "17.5%", value: 60, giftName: "开香槟" },
    { duckName: "划水鸭", pro: "21%", value: 50, giftName: "cpdd" },
    { duckName: "吃瓜鸭", pro: "31.3%", value: 32, giftName: "水晶皇冠" },
  ],
  bigGiftList: [
    { giftName: "圆舞曲", value: 10000 },
    { giftName: "豪华大院", value: 5000 },
    { giftName: "菲心桃花", value: 1000 },
    { giftName: "比心告白", value: 520 },
    { giftName: "莫吉托", value: 10 },
    { giftName: "棒棒糖", value: 1 },
  ],
});
</script>

<style lang="less" scoped>
.rule {
  width: 344px;
  height: 482px;
  background: url("../assets/ruleBgc.png") no-repeat;
  background-size: 100% 100%;
  overflow: hidden;

  &_content {
    height: 346px;
    margin: 114px 0 0 0;
    overflow-y: auto;

    &::-webkit-scrollbar {
      display: none;
    }

    ul {
      display: flex;
      align-items: center;
      flex-direction: column;

      li {
        color: #57360f;
        font-size: 12px;

        p {
          width: 279px;
          line-height: 20px;
          display: inline-block;
          vertical-align: text-top;
          margin: 0 auto;
        }
      }
    }

    table {
      width: 286px;
      margin: 0 auto;
      border-radius: 5px;
      overflow: hidden;
      color: #fff;
      font-size: 12px;
      text-align: center;
      border: 1px solid #57360f;
      border-collapse: collapse;

      .header {
        width: 100%;
        height: 23px;
        line-height: 23px;
        text-align: center;
        background: #57360f;

        td {
          border: 1px solid #57360f;
          border-collapse: collapse;
        }
      }

      .bo {
        color: #57360f;
        border: 1px solid red;

        td {
          height: 26px;
          border: 1px solid #57360f;
        }
      }
      .xiaolongya {
        color: #f55555;
      }
    }
  }
}
</style>
