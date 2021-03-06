$(function ($) {
    var eventObject = new TouchDirection();

    //上下拖动对象命名
    var TouchAnimation = function(){

    };

    //左右拖动对象命名
    var TouchDownUp = function(){};



    var init = function (btnContent) {
        var _this_ =this;

        btnContent.each(function(){
            new _this_($(this));
        });

        bindEvent(btnContent);
    };

    var bindEvent = function(btnContent){
        btnContent.on('click')

        //左右拖动事件绑定
        btnContent.on('touchstart', 'div', touchStartEv);
        btnContent.on('touchmove', 'div', touchMoveEv);
        btnContent.on('touchend', 'div', touchEndEv);

        //上下拖动事件绑定
        btnContent.on('touchstart', '.move-btn', moveStartEv);
        btnContent.on('touchmove', '.move-btn', moveMoveEv);
        btnContent.on('touchend', '.move-btn', moveEndEv);
        btnContent.on('transitionend', '[node-type=node-co]', transEndFunc);

        //其它事件绑定这里需要按照具体情况来写
        $('div[node-type=del-btn]').on('click', delLi);
        $('.edit-btn').on('click', editFunc);
        $('.cancel-btn').on('click', cancelFunc);
    };

    TouchAnimation.init = init;
    TouchDownUp.init = init;

    window.TouchAnimation = TouchAnimation;
    window.TouchDownUp = TouchDownUp;

})(window.Zepto ? Zepto :jQuery);




var btnWidth = $('div[node-type=del-btn]').width();
var liFather = $('div[node-type=test]');
var liList = liFather.find('[node-type=move-node]');
var liHeight = $(liList).height();
var touchResult = new TouchDirection();
var moveBtnList = $('.move-btn');
var offsetLi = [];
var offsetHalf = [];

$.each(liList, function(i, item) {
    $(item).attr('in_v', i);
});

var touchStartEv = function(e) {
    //初始化所有的 li 元素
    var index = Number($(this).parents('li').attr('in_v'));
    $.each(liList, function(i, item) {
        var currCoNode = $(item).find('[node-type=node-co]');
        if (i !== index) {
            if (currCoNode.css('transform')) {
                currCoNode.removeAttr('style')
                    .next().css('z-index', -100);
            }
        }
    });


    //$(this).removeClass('leave-btn');
    var that = touchResult.touchStartEven(e);
};

var touchMoveEv = function(e) {
    var that = touchResult.touchMoveEven(e);
    var relativeDirc = that.moveThat.relativeDirc;
    var currenDirc = that.moveThat.currDirc;
    var leftMove = 0;
    var currBtnIndex = $(this).next('div').css('z-index');

    if (relativeDirc === 'left') {
        if (currBtnIndex !== 0) {
            leftMoveNum = Number(that.moveThat.moveX);
            if (leftMoveNum <= btnWidth) {
                leftMove = '-' + leftMoveNum + 'px';
                if ($(this).attr('node-type') !== 'del-btn') {
                    $(this).css('transform', 'translate3d(' + leftMove + ' ,0,0)');
                }
            }

            if (leftMoveNum > btnWidth) {
                $(this).next('div').css('z-index', 0);
            }
        }
    }
    if (relativeDirc === 'right') {
        $(this).next('div').css('z-index', -100);
        rightMoveNum = btnWidth - Number(that.moveThat.moveX);

        if (rightMoveNum <= btnWidth) {
            rightMove = '-' + rightMoveNum + 'px';
            if ($(this).attr('node-type') !== 'del-btn') {
                $(this).css('transform', 'translate3d(' + rightMove + ',0,0)');
            }
        }
    }
};

var touchEndEv = function(e) {
    var that = touchResult.touchEndEven(e);
    var relativeDirc;
    var moveTemp;
    $(this).addClass('leave-btn');
    if (that.endThat) {
        if ('relativeDirc' in that.endThat) {
            relativeDirc = that.endThat.relativeDirc;
        }
        if ('moveX' in that.endThat) {
            moveTemp = that.endThat.moveX;
        }
    }
    if (relativeDirc === 'left') {
        if (moveTemp > btnWidth / 2) {
            if ($(this).attr('node-type') !== 'del-btn') {
                $(this).css('transform', 'translate3d(-' + btnWidth + 'px,0,0)');
                $(this).next('div').css('z-index', 0);
            }
        } else {
            if ($(this).attr('node-type') !== 'del-btn') {
                $(this).css('transform', 'translate3d(0,0,0)');
            }
        }
    }
    if (relativeDirc === 'right') {
        if (moveTemp > btnWidth / 2) {
            if ($(this).attr('node-type') !== 'del-btn') {
                $(this).css('transform', 'translate3d(0,0,0)');
            }
        } else {
            if ($(this).attr('node-type') !== 'del-btn') {
                $(this).css('transform', 'translate3d(-' + btnWidth + 'px,0,0)');
                $(this).next('div').css('z-index', 0);
            }
        }
    }
    //当触摸事件结束必须将 endThat 水平位移置为 null
    that.endThat.moveX = null;
    that.moveThat.moveX = null;
};

function delLi() {
    var removeIndex = $(this).parent("li").attr('in_v');
    $('li[in_v="' + removeIndex + '"]').remove();

}

function editFunc() {
    moveBtnList.css('display', 'block');
    $.each(liList, function(i, item) {
        offsetLi.push($(item).offset().top);
        offsetHalf.push($(item).offset().top - liHeight / 2);
    });

    $.each(liList, function(i, item) {
        $(item).css({
            'position': 'absolute',
            'top': offsetLi[i],
            'width': '100%'
        });
    });
}

function cancelFunc() {
    moveBtnList.css('display', 'none');
    $.each(liList, function(i, item) {
        $(item).removeAttr('style');
    });
}

var moveStartEv = function(e) {
    var that = touchResult.touchStartEven(e);

};

var moveMoveEv = function(e) {
    var that = touchResult.touchMoveEven(e);
    var currObject = $(this).parents('[node-type=move-node]');
    var currLiIndex = Number(currObject.attr('in_v'));
    var currOffset = currObject.offset().top;
    var direction = that.moveThat.relativeDirc;
    var moveTemp;
    var upNum = that.moveThat.moveY;
    var tempIn_v;
    currObject.addClass('move-style').find('[node-type=node-co]').addClass("move-style");

    if (direction === 'up') {

        moveTemp = offsetLi[3] - upNum;

        $(this).parents('[node-type=move-node]').css({
            'top': moveTemp + 'px'
        });
        console.log(currOffset);

        if (currOffset >= offsetHalf[currLiIndex]) {
            tempIn_v = currObject.attr('in_v');
            currObject.attr('in_v', currObject.prev().attr('in_v'));
            currObject.prev().attr('in_v', tempIn_v);

            currObject.prev().css({
                'top': offsetLi[currLiIndex] + 'px'
            });

            currObject.after(currObject.prev());
        }
    }
    if (direction === 'down') {

    }
};
var moveEndEv = function(e) {
    var that = touchResult.touchEndEven(e);
    var currMoveLi = $(this).parents('[node-type=move-node]');
    var currLiIn_v = currMoveLi.attr('in_v');
    // currMoveLi.css('top', offsetLi[currLiIn_v]);
    // $.each(liList, function(i, item) {
    //     //$(item).removeAttr('style');
    //     $(item).removeClass('move-style');
    // });
};

var transEndFunc = function() {
    $(this).removeClass("leave-btn");
};


