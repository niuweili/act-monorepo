<template>
    <div class="bullet-wrap">
        <div
            v-for="item in bulletlist"
            :key="item.id"
            class="bullet-item bullet-animation"
            :class="{ 'bullet-item--c': item.isLoginUser }"
            :style="{ top: item.line * 36 + 'px' }"
            @animationend="animationend"
        >
            <slot :item="item"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        },
        loop: {
            type: Boolean,
            default: false
        },
        line: {
            type: Number,
            default: 3
        }
    },
    data() {
        return {
            bulletlist: [], // 当前正在执行的
            value: '',
            idx: 2,
            timer: null
        };
    },
    mounted() {
        this.timer = setInterval(() => {
            let item = null;

            if (!item) {
                item = this.list.shift(); // eslint-disable-line
            }
            if (item) {
                item.line = this.idx;
                this.idx = (this.idx % this.line) + 1;
                this.bulletlist.push(item);
            }
        }, 1000);
    },
    beforeUnmount() {
        if (this.timer) clearInterval(this.timer);
    },
    methods: {
        animationend() {
            if (this.loop) {
                this.list.push(this.bulletlist.shift()); // eslint-disable-line
            }
        }
    }
};
</script>

<style lang="less" scoped>
.bullet-wrap {
    position: absolute;
    top: 44px;
    left: 50%;
    height: 200px;
    overflow: hidden;
    font-size: 12px;
    width: 280px;
    transform: translate(-50%, 0);
    z-index: 1;
}
.bullet-item {
    text-shadow: 1px 1px #000;
    color: #ffffff82;
    white-space: nowrap;
    user-select: none;
    position: absolute;
    top: 0;
    left: 0;
}
.bullet-item--c {
    border: 1px solid #ff000082;
}

.bullet-animation {
    animation: right2left 7s linear both;
}

@keyframes right2left {
    0% {
        transform: translate(100vw);
    }
    100% {
        transform: translate(-100%);
    }
}
</style>
