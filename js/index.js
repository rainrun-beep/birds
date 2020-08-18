/**
 * 用类,这样可以保证自己命名的函数和变量不会和其他同事的名字起冲突,并且这样容易维护
 * 类中的每一个功能都命名一个函数, 在类中的内部将各个函数封装在一个函数内,在外部只需要调用一个函数,就可以显示功能
 * 如果一个网页的功能中,有多个动态的页面,防止连续使用多个定时器, 定时器比较消耗资源, 所以可以将多个功能放在一个定时器中, 如果时间不同, 可以使用count来延长执行时间,
 * 小鸟移动的效果, 只是将它的位置变到了固定的范围, 比如220-260,然后使用transition:top .3s linear,
 * 这样就可以看着像是在上下移动, 小鸟扇动翅膀的效果是, 因为小鸟的图片是雪碧图, 通过挪动backgroundPositionX,来实现切换图片, 从而实现小鸟的翅膀移动, 同样设置300ms执行一次,因为挪动设置了transition, 而小鸟的翅膀会立即执行, 所以没移动到位置的时候, 翅膀就会动
 * 小鸟扇动翅膀的效果, 0, -30, -60 这样的话可以1%3=1 2%3=3 3%3=0 4%3=1这样就会变成(n%3)*-30 
 * 
 * foo.call(obj);  就是foo中的this,指向了obj; 
 * 如果想要调用别的对象中的参数, 可以将 别的对象.call(this);
 * 例:
 *    function test () {
 *        this.echo : function () {console.log(this)}
 *    }
 *     
 *    function test2() {
 *        test.call(test2);
 *        this.echo();
 *    }
 * 顾名思义就是想要用别的对象的方法, 方法绑定在别的对象中, 所以foo.call(this)就可以了
 */
var bird = {
    skyPosition: 0,
    skyStep: 2,
    birdTop: 235,
    startColor: 'blue',
    startFlag: false,
    birdStepY: 0,
    minTop: 0,
    maxTop: 570,
    columnCount: 7,
    columnArr: [],
    leftArr: [],

    init: function() {
        this.initData();
        this.animate();
        this.handleStart();
        this.handleClick();
    },

    initData: function () {
        this.el = document.getElementById('game');
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
        this.oScore = this.el.getElementsByClassName('score')[0];
    },

    animate: function () {
        var count = 0;
        this.timer = setInterval(() => {
            this.skyMove();
            if (this.startFlag) {
                this.birdDrop();
                this.moveColumn();
            }

            if (++count % 10 === 0) {
                if (!this.startFlag) {
                    this.startBound();
                    this.birdMove();
                }
                this.birdFly(count);
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
    
    birdDrop: function() {       
        this.birdTop += ++ this.birdStepY;
        this.oBird.style.top = this.birdTop + 'px';

        this.hitCheck();
    },

    createColumn: function(x) {
        // 0-1 0-100 有可能为0  50-(175+50)
        // 上下柱子之间的距离 150  上面的柱子最好的高度是（600-150）/ 2 = 255
        var topHeight = Math.floor(Math.random() * 175) + 50;
        var downHeight = 450-topHeight;
        var otopColumn = this.createElement('div', ['column', 'column-top'], {height:topHeight+'px', left:x+'px'});
        var odownColumn = this.createElement('div', ['column', 'column-down'], {height:downHeight+'px', left:x+'px'});
        this.columnArr.push({
            top: otopColumn,
            down: odownColumn 
        });

        this.leftArr.push({
            left: x
        })
        this.el.appendChild(otopColumn);
        this.el.appendChild(odownColumn);
    },

    moveColumn: function () {
        for (var i = 0; i < this.columnCount; i++) {
            var oUpColumn = this.columnArr[i].top;
            var oDownColumn = this.columnArr[i].down;
            // var left = this.leftArr[i].left - this.skyStep;
            var left = parseInt(oUpColumn.style.left) - this.skyStep;
            oUpColumn.style.left = left + 'px';
            oDownColumn.style.left = left + 'px';
        }
    },

    createElement: function (eleName, classArr, styleObj) {
        var dom = document.createElement(eleName);
        for (var i = 0; i < classArr.length; i++) {
            dom.classList.add(classArr[i]);
        }

        for (item in styleObj) {
            dom.style[item] = styleObj[item];
        }
        return dom;
    },

    hitCheck: function() {
        this.hitBorder();  
        this.hitColumn();
    }, 

    hitBorder: function() {
        if (this.birdTop <= this.minTop || this.birdTop >= this.maxTop) {
            this.failGame();
        }
    },

    hitColumn: function() {

    },

    startBound: function () {
        var prevColor = this.startColor;
        this.startColor = this.startColor === 'blue' ? 'white' : 'blue';
        this.oStart.classList.remove('start-'+prevColor);
        this.oStart.classList.add('start-'+this.startColor);
    },

    handleStart: function() {
        this.oStart.onclick =  () => {
            this.oScore.style.display = 'block';
            this.oStart.style.display = 'none';
            this.oBird.style.left = '80px';
            this.oBird.style.transition = 'none';
            this.skyStep = 5;
            this.startFlag = true;
            for (var i = 0; i < this.columnCount; i++) {
                this.createColumn(300 * (i + 1));
            }
        }
    },

    /**
     * 这个如果不加e判断来源的元素,会造成时间冒泡, 当点击oStart的时候, 也会触发start
     * 的父类, sky元素, 设置了this.birdStepY = -10 向上去了
     */
    handleClick: function() {
        this.el.onclick = (e) => {
            var event = e || window.event;
            var dom = event.target;
            //查询目标元素是否包含了这个class
            if (!dom.classList.contains('start')) {
                this.birdStepY = -10;
            }
        }
    },

    failGame: function() {
        clearInterval(this.timer);
    }
};
bird.init();