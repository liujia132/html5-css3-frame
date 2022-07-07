/**
 * 功能说明:
 * 1.点击向右(左)的图标，平滑切换到下(上)一页
 * 2.无限循环切换: 第一页的上一页为最后一页，最后的下一页为第一页
 * 3.每隔3s自动滑动到下一页
 * 4.当鼠标进入图片区域时，自动切换停止，当鼠标离开后，又开始自动切换
 * 5.切换页面时，下面的圆点也同步更新
 * 6.点击圆点图标切换到对应的页
 */

$(function () {
    let $container = $('#container');
    let $list = $('#list');
    let $points = $('#pointsDiv>span');
    let $prev = $('#prev');
    let $next = $('#next');
    let PAGE_WIDTH = 600; //下一页宽度
    let TIME = 400; //翻页的持续时间
    let ITEM_TIME = 20; //单元移动的间隔时间
    let imgCount = $points.length;
    let index = 0; //当前下标
    /**
     * 1.点击向右(左)的图标，平滑切换到下(上)一页
     */

    $prev.click(function () {
        //平滑翻到上一页
        nextPage(true);
    });
    $next.click(function () {
        //平滑翻到下一页
        nextPage(false);
    });

    /**
     * 3.每隔3s自动滑动到下一页
     */
        let setIntervalId = setInterval(function () {
            nextPage(true);
        },1000);

    /**
     * 4.当鼠标进入图片区域时，自动切换停止，当鼠标离开后，又开始自动切换
     */
    $container.hover(function () {
        //鼠标的移入,清除定时器即可
        clearInterval(setIntervalId);
    },function () {
        //鼠标的移出,从新设置定时器
        setIntervalId = setInterval(function () {
            nextPage(true);
        },1000);

    });



    /**
     * 6.点击圆点图标切换到对应的页
     */
    $points.click(function () {

    });

    /**
     * 平滑翻页功能
     * @param text
     * true: 上一页
     * false: 下一页
     */
    function nextPage(next) {
        /**
         * 总的偏移量： offset
         * 总的时间: TIME = 400;
         * 单元移动的间隔时间: ITEM_TIME = 20
         * 单元移动的偏移量: itemOffset = offset/(TIME/ITEM_TIME)
         *
         *启动定时器不断的更新List的left，到达目标处停止定时器
         */
        //总的偏移量: offset
        let offset = 0;
        offset = next ? - PAGE_WIDTH : PAGE_WIDTH;
        //计算单元移动的偏移量
        let itemOffset = offset/(TIME/ITEM_TIME);
        //得到当前的left值
        let currLeft = $list.position().left;
        //计算出目标处的left的值
        let targetLeft = currLeft + offset;
        //启动定时器不断的更新List的left，到达目标处停止定时器
        let intervalId = setInterval(function () {
            //计算出最新的currentLeft
             currLeft += itemOffset;
             if (currLeft === targetLeft) { //已经到达目标处
                 //清除定时器
                 clearInterval(intervalId);

                 /**
                  * 2.无限循环切换: 第一页的上一页为最后一页，最后的下一页为第一页
                  */
                 //如果到达了最右边的图片（1.jpg）跳转到最左边的第二张图片(1.jpg)
                 if (currLeft === -(imgCount+1)*PAGE_WIDTH){
                     currLeft = -PAGE_WIDTH;
                     //如果到达了最左边的图片(5.jpg),跳转到最右边的第二站图片(6.jpg)
                 }else if(currLeft ===0){
                     currLeft = -PAGE_WIDTH * PAGE_WIDTH;

                 }
             }
            $list.css("left",currLeft);
        },ITEM_TIME);
        /**
         * 5.切换页面时，下面的圆点也同步更新
         */
        updatePoints(next);
    }

    /**
     * 更新圆点
     * @param next
     */
    function updatePoints(next) {
        //计算出目标圆点的下标targetIndex
        let targetIndex = 0;
        if (next){
            targetIndex = index + 1;
            if (targetIndex === imgCount){
                targetIndex = 0;
            }
        }else {
            targetIndex = index - 1;
            if (targetIndex === -1){
                targetIndex = imgCount - 1;
            }
        }
        //将当前index的<span>的class移除
        $points.eq(index).remove('on');
        //给目标圆点添加class='on'
        $points.eq(targetIndex).addClass('on');

        //将index更新为targetIndex
        index = targetIndex;
    }

});