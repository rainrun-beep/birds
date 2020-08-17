/**
 * 用类,这样可以保证自己命名的函数和变量不会和其他同事的名字起冲突,并且这样容易维护
 * 类中的每一个功能都命名一个函数, 在类中的内部将各个函数封装在一个函数内,在外部只需要调用一个函数,就可以显示功能
 * 如果一个网页的功能中,有多个动态的页面,防止连续使用多个定时器, 定时器比较消耗资源, 所以可以将多个功能放在一个定时器中, 如果时间不同, 可以使用count来延长执行时间,
 * 小鸟移动的效果, 只是将它的位置变到了固定的范围, 比如220-260,然后使用transition:top .3s linear,
 * 这样就可以看着像是在上下移动, 小鸟扇动翅膀的效果是, 因为小鸟的图片是雪碧图, 通过挪动backgroundPositionX,来实现切换图片, 从而实现小鸟的翅膀移动, 同样设置300ms执行一次,因为挪动设置了transition, 而小鸟的翅膀会立即执行, 所以没移动到位置的时候, 翅膀就会动
 * 小鸟扇动翅膀的效果, 0, -30, -60 这样的话可以1%3=1 2%3=3 3%3=0 4%3=1这样就会变成(n%3)*-30 
 */
var bird = {
    skyPosition: 0,
    skyStep: 2,
    birdTop: 235,
    startColor: 'blue',

    init: function() {
        this.initData();
        this.animate();
    },

    initData: function () {
        this.el = document.getElementById('game');
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
    },

    animate: function () {
        var count = 0;
        setInterval(() => {
            this.skyMove();
            if (++count % 10 === 0) {
                this.birdMove();
                this.birdFly(count);
                this.startBound();
            }
        }, 30);
    },

    skyMove : function () {
        this.skyPosition -= this.skyStep;
        this.el.style.backgroundPositionX = this.skyPosition + 'px';
    },

    birdMove: function () {
        this.birdTop = this.birdTop === 220 ? 260 : 220;
        this.oBird.style.top = this.birdTop + 'px';
    },

    birdFly: function (count) {
        this.oBird.style.backgroundPositionX = (count % 3) * -30 + 'px';
    }, 

    startBound: function () {
        var prevColor = this.startColor;
        this.startColor = this.startColor === 'blue' ? 'white' : 'blue';
        this.oStart.classList.remove('start-'+prevColor);
        this.oStart.classList.add('start-'+this.startColor);
    }

};
bird.init();