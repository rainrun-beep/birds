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
    columnCount: 4,
    columnLastIndex: 3,
    columnArr: [],
    leftArr: [],
    score: 0,
    scoreArr: [],

    init: function() {
        this.initData();
        this.animate();
        this.handleStart();
        this.handleClick();
        this.handleRestart();

        if (sessionStorage.getItem('play')) {
            this.start();
        }
    },

    initData: function () {
        this.el = document.getElementById('game');
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
        this.oScore = this.el.getElementsByClassName('score')[0];
        this.oMask = this.el.getElementsByClassName('mask')[0];
        this.oEnd = this.el.getElementsByClassName('end')[0];
        this.oFinalScore = this.el.getElementsByClassName('final-score')[0];
        this.oRendList = this.el.getElementsByClassName('rank-list')[0];
        this.oRestart = this.el.getElementsByClassName('restart')[0];
        this.scoreArr = this.getScore();
    },

    getScore: function() {
        var scoreArr = this.getLocal('score');
        return scoreArr ? scoreArr : [];
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
        this.addScore();
    },

    hitCheck: function() {
        this.hitBorder();  
        this.hitColumn();
    }, 

    hitBorder: function() {
        if (this.birdTop <= this.minTop || this.birdTop >= this.maxTop) {
            console.log('hitBorder');
            this.failGame();
        }
    },

    /**
     * 危险的状态
     * left <= 95 小鸟的left+margin-left  80+15   小鸟要经过柱子的时候
     * left >= 13 小鸟的left - 小鸟自身的margin-left - 柱子的width  80 - 15 - 52  小鸟经过柱子的时候 
     */
    hitColumn: function() {

        //获取柱子的index
        var index = this.score % this.columnCount;
        var columnX = this.columnArr[index].top.offsetLeft;
        var columnY = this.columnArr[index].y; //安全范围值
        var birdY = this.birdTop;

        

        //判断是否在危险状态, 如果在危险状态, 并且小鸟的高度小于上柱子的高度 或者 大于下柱子的高度
        if ((columnX <= 95 && columnX >= 13) && (birdY <= columnY[0] || birdY >= columnY[1])) {
            console.log(birdY, columnY[0], columnY[1]);
            console.log('hitColumn');
            this.failGame();
        }

    },

    addScore: function () {
        var index = this.score % this.columnCount;
        var columnX = this.columnArr[index].top.offsetLeft;

        if(columnX < 13) {
          this.oScore.innerText = ++ this.score;
        }
    },

    createColumn: function(x) {
        // 0-1 0-100 有可能为0  50-(175+50)
        // 上下柱子之间的距离 150  上面的柱子最好的高度是（600-150）/ 2 = 255
        var topheight = Math.floor(Math.random() * 175) + 50;
        var downHeight = 450-topheight;

        var otopColumn = this.createElement('div', ['column', 'column-top'], {height:topheight+'px', left:x+'px'});
        var odownColumn = this.createElement('div', ['column', 'column-down'], {height:downHeight+'px', left:x+'px'});
        this.columnArr.push({
            top: otopColumn,
            down: odownColumn,
            y: [topheight, topheight + 150 - 30]
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
            var left = this.leftArr[i].left - this.skyStep;
            //0 1 2 3 4 5 6
            /**
             * 因为是定时器30ms执行的函数，所以会执行很多次， 可以判断当前i对应的column元素的left用户是否看不见了,
             * 如果看不到,就将这个i对应的元素的left值, 改成最后一个的left+300, 放到最后一个left的后面即可,效果和无缝轮播雷同
             */
            if (left < -52) {
                var topHeight = Math.floor(Math.random() * 175) + 50;
                var downHeight = 450-topHeight;
                var lastColumnLeft = this.leftArr[this.columnLastIndex].left + 300;

                oUpColumn.style.left = lastColumnLeft+'px';
                oDownColumn.style.left = lastColumnLeft+'px';
                //? 有问题
                oUpColumn.style.height = topHeight+'px';
                oDownColumn.style.height = downHeight+'px';

                this.columnArr[i].y[0] = topHeight;
                this.columnArr[i].y[1] = topHeight + 150 - 30
                console.log(this.columnArr[i].y);
                
                this.columnLastIndex = i;
                this.leftArr[i].left = lastColumnLeft;
                continue;
            } 

            oUpColumn.style.left = left + 'px';
            oDownColumn.style.left = left + 'px';
            this.leftArr[i].left = left;
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

    startBound: function () {
        var prevColor = this.startColor;
        this.startColor = this.startColor === 'blue' ? 'white' : 'blue';
        this.oStart.classList.remove('start-'+prevColor);
        this.oStart.classList.add('start-'+this.startColor);
    },

    handleStart: function() {
        this.oStart.onclick =  this.start.bind(this);
    },

    start: function() {
        this.oScore.style.display = 'block';
        this.oStart.style.display = 'none';
        this.oBird.style.left = '80px';
        this.oBird.style.transition = 'none';
        this.skyStep = 5;
        this.startFlag = true;
        for (var i = 0; i < this.columnCount; i++) {
            this.createColumn(300 * (i + 1));
        }
    },

    /**
     * 这个如果不加e判断来源的元素,会造成事件冒泡, 当点击oStart的时候, 也会触发start
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

    handleRestart: function() {
        this.oRestart.onclick = function() {
            sessionStorage.setItem('play', true);
            window.location.reload();
        };
    },

    failGame: function() {
        clearInterval(this.timer);
        this.setScore();

        this.oMask.style.display = 'block';
        this.oEnd.style.display = 'block';
        this.oBird.style.display = 'none';
        this.oScore.style.display = 'none';
        this.oFinalScore.innerText = this.score;
        this.renderRankList();
    },

    renderRankList: function() {
        var count = this.scoreArr.length > 8 ? 8 : this.scoreArr.length;
        var html = '';
        for (var i = 0; i < count; i++) {
            var degreeClass = '';
            switch (i) {
                case 0:
                    degreeClass = 'first';
                    break;
                case 1:
                    degreeClass = 'second';
                    break;
                case 2:
                    degreeClass = 'third';
                    break;
            }

            html += `<li class="rank-item">
                <span class="rank-degree ${degreeClass}">${i+1}</span>
                <span class="rank-score">${this.scoreArr[i].score}</span>
                <span class="rank-time">${this.scoreArr[i].time}</span>
            </li>`;
        }
        this.oRendList.innerHTML = html;
    },

    setScore: function() {
        console.log(this.scoreArr); 
        /**
         * 每次结束的时候将当前结束的数据push到数组中,这样下次在重新开始就会获得
         */
        this.scoreArr.push({
            score: this.score,
            time: this.getDate()
        })

        this.scoreArr.sort(function(a,b) {
            return b.score - a.score;
        })

        this.setLocal('score', this.scoreArr);
    },
    
    setLocal: function(key, value) {
        if (typeof value === 'object' && value !== null) {
            value = JSON.stringify(value);
        }

        localStorage.setItem(key, value);
    },

    getLocal: function(key) {
        var value = localStorage.getItem(key);
        if (value === null) {
            return value;
        }

        if (value[0] === '[' || value[0] === '{') {
            return JSON.parse(value);
        }
        return value;
    },

    getDate: function() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth();
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        var second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return `${year}.${month}.${day} ${hour}:${min}:${second}`;
    }
};

var score = [
    {
      score: 1,
      time: '2020.8.18 20:48'
    },{
      score: 2,
      time: 'xxx',
    }
  ];
bird.init();