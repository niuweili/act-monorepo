export const dataObj = {
  giftZIindexIsShow: true, // 是否曾奖励层层级提高
  rageIsShow: false, // 暴走卡弹框
  pageIsShow: false, // 动画挂载到dom后再显示页面
  badgeComIsShow: false, // 徽章墙组件显示
  badgeIsShow: false, // 徽章墙弹框
  notCatchIsShow: false, // 未抓到鸭子弹框
  catchDuckIsShow: false, // 投喂&抓中鸭子
  rageDucksIsShow: false, // 暴走鸭子抓中弹框
  jinzuanAmount: 0, // 金钻数量
  showGoldPop: false, // 兑换弹框
  useJinzuan: false, // 是否使用进金钻
  costPriceType: 0, // 当前购买花费的类型：蓝钻 金钻 金币
  exchangeZSAmount: 0, // 需要消耗钻石数量
  allIsShow: false, // 规则、投喂记录、抓取记录入口
  ruleIsShow: false, // 规则dialog flag
  feedIsShow: false, // 投喂记录dialog flag
  grabIsShow: false, // 抓取记录dialog flag
  quantityIsShow: false, // 购买数量dialog flag
  feedingNumIsShow: false, // 投喂数量dialog flag
  thisRoundDucksIsShow: false, // 本轮鸭子dialog flag
  selectFlag: false, // 是否兑换为大礼物
  ducksIsShow: true, // 抓鸭子动画flag
  numList: [
    { name: "1", value: 1 },
    { name: "10", value: 10 },
    { name: "100", value: 100 },
    { name: "自定义", value: "" },
  ], // 购买数量list
  feedingNumList: [1, 10, 100, 200], // 投喂数量list
  activeIndex: 1, // 购买数量选中索引
  feedingActiveIndex: 1, // 投喂数量选中索引
  digit: "", // 自定义数量
  num: 10, // 选中购买的数量
  giftList: [], // 鸭子信息
  giftInfo: {}, // 单个鸭子信息
  userAssets: {
    fishBalance: 0, // 鱼干数量
    zsBalance: 0, // 钻石余额
    jzBalance: 0, // 金钻余额
  },
  gameID: 0, // 游戏IDxxxxx
  betInfos: [], // 投注信息
  lotteryInfo: {}, // 开奖信息
  currentTime: null, // 当前倒计时剩余时间
  catchDuckInfo: {}, // 抓鸭子开奖信息
  surplusTimeMs: null, // 剩余时间秒数
  animationList: [], // 普通抓取鸭子动画list
  animationLoopList: [], // 暴走鸭循环动画list
  animationRageList: [], // 暴走鸭抓取鸭子动画list
  countdownCopy: "", // 倒计时文案
  countDownFlag: true,
  exchangeState: 0, // 是否自动兑换大礼物 1不自动兑换 2自动兑换
  catchDuckBeforeOpenSecond: 5, // 剩余N秒去拉开奖接口
  catchDuckPerOpenSecond: 0, // 单局游戏总时长
  luckInfo: {
    diamondVal: 0,
    isLucky: false,
  }, // 中奖信息
  ducksNameList: [
    {
      name: "划水鸭",
      imgUrl: "http://res-static.inframe.mobi/ui/1680512022813e5.png",
    },
    {
      name: "厉害鸭",
      imgUrl: "http://res-static.inframe.mobi/ui/168051214137146.png",
    },
    {
      name: "干饭鸭",
      imgUrl: "http://res-static.inframe.mobi/ui/1680512182985d1.png",
    },
    {
      name: "拴Q鸭",
      imgUrl: "http://res-static.inframe.mobi/ui/168051221207385.png",
    },
    {
      name: "吃瓜鸭",
      imgUrl: "http://res-static.inframe.mobi/ui/1680512253122e0.png",
    },
    {
      name: "心动鸭",
      imgUrl: "http://res-static.inframe.mobi/ui/16805122881597d.png",
    },
    {
      name: "唱歌鸭",
      imgUrl: "http://res-static.inframe.mobi/ui/16805123123659c.png",
    },
    // { name: '加油鸭', imgUrl: 'http://res-static.inframe.mobi/ui/16805123409071f.png' },
    {
      name: "小龙鸭",
      imgUrl: "http://res-static.inframe.mobi/ui/1705304664255a4.png",
    },
  ],
  loopAnm: "", // 循环动画
  historyDucks: [], // 历史鸭子list
  list: [], // 中奖弹幕列表
  userBetInfo: [], // 投喂弹幕列表
  gainGiftIsShow: false, // 获得礼物dialog
  rewardInfo: [], // 中奖奖励信息
  timer: null, // 定时器
  hasDiscountEffect: false, // 是否有打折
  barrageInfo: [],
  loopLucksAnm: null, // 鸭子循环动画
  plainLoopLucksAnm: null, // 普通抓鸭子循环动画
  showJinzuan: 0, // 显示金钻
  showText: "tcpip1",
  cacheList: [
    // 缓存列表
    // {
    //     name: 'mainBgc',
    //     url: 'http://res-static.inframe.mobi/ui/1690773575973da.png'
    // },
    // {
    //     name: 'bottomFire',
    //     url: 'http://res-static.inframe.mobi/ui/16909642216472b.png'
    // },
    // {
    //     name: 'topFire',
    //     url: 'http://res-static.inframe.mobi/ui/169096427612512.png'
    // },
    // 新人引导缓存
    {
      name: "guideBgc",
      url: "http://res-static.inframe.mobi/ui/1691117206025da.png",
    },
    // {
    //     name: 'giftImg',
    //     url: 'http://res-static.inframe.mobi/ui/16914771332382e.png'
    // },
    // {
    //     name: 'obtainBtn',
    //     url: 'http://res-static.inframe.mobi/ui/169173888609609.png'
    // }
    // {
    //     name: 'catchDuckBgc',
    //     url: 'http://res-static.inframe.mobi/ui/169078645982696.png'
    // },
    // {
    //     name: 'feedBgc',
    //     url: 'http://res-static.inframe.mobi/ui/1690786934111cb.png'
    // },
    // {
    //     name: 'feeding',
    //     url: 'http://res-static.inframe.mobi/ui/16907870652365b.png'
    // },
    // {
    //     name: 'giftBgc',
    //     url: 'http://res-static.inframe.mobi/ui/1690787240438a4.png'
    // },
    // {
    //     name: 'grabBgc',
    //     url: 'http://res-static.inframe.mobi/ui/1690787394718bf.png'
    // },
    // {
    //     name: 'notCatchBgc',
    //     url: 'http://res-static.inframe.mobi/ui/1690787505525c5.png'
    // },
    // {
    //     name: 'numBgc',
    //     url: 'http://res-static.inframe.mobi/ui/169078765763574.png'
    // },
    // {
    //     name: 'rageCardBgc',
    //     url: 'http://res-static.inframe.mobi/ui/169147611765690.png'
    // },
    // {
    //     name: 'rageRuleContent',
    //     url: 'http://res-static.inframe.mobi/ui/169173562367338.png'
    // },
    // {
    //     name: 'ruleBgc',
    //     url: 'http://res-static.inframe.mobi/ui/16914767533274a.png'
    // },

    // {
    //     name: 'badgeBgc',
    //     url: 'http://res-static.inframe.mobi/ui/1691478517792da.png'
    // },
    // {
    //     name: 'badgeBottomBgc',
    //     url: 'http://res-static.inframe.mobi/ui/1691478708982bf.png'
    // }
  ],
  rageDuckInfo: {}, // 暴走鸭信息
  rageZsBalance: 0, // 暴走奖池钻石余额
  animationDemo: "",
  ducksList: [
    "厉害鸭",
    "加油鸭",
    "心动鸭",
    "唱歌鸭",
    "划水鸭",
    "栓Q鸭",
    "干饭鸭",
    "吃瓜鸭",
  ],
  grabImgList: [], // 暴走鸭静态图
  rageBingoInfo: {}, // 暴走鸭中奖信息
  lotteryRecord: "", //中奖记录
  nomal: "",
  duckRecord: "", //抓鸭记录
};
