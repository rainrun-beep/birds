var bird = {
    skyPosition: 0,
    skyStep: 2,
    birdTop: 235,
    startColor: 'blue',

    
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

bird.initData();
bird.animate();