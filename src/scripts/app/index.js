//时间的输出
function time(){
    var time=new Date();
    var hours=time.getHours();
    var minutes=time.getMinutes();
    var seconds=parseInt(time.getSeconds());
    if(parseInt(hours)<10){
        hours="0"+hours;
    }
    if(parseInt(minutes)<10){
        minutes="0"+minutes;
    }
    $("#bottom-msg .time .hours").html(hours);
    $("#bottom-msg .time .minutes").html(minutes);
    //持续更新时间
    var timer=setInterval(function(){
        var hours=parseFloat($("#bottom-msg .time .hours").html());
        var minutes=parseFloat($("#bottom-msg .time .minutes").html());
        seconds++;
        if(seconds==60){
            seconds=0;
            minutes++;
            if(minutes==60){
                minutes=0;
                hours++;
                if(hours==24){
                    hours=0;
                }
                if(hours<10){
                    hours="0"+hours;
                }
                $("#bottom-msg .time .hours").html(hours);
            }
            if(minutes<10){
                minutes="0"+minutes;
            }
            $("#bottom-msg .time .minutes").html(minutes);
        }
    },1000);
}
//在画布上绘制图形
var tetris={
    contarr:[],//主要数组
    nowrect:[],//正在运动的方块
    nextrect:[],//下一个方块
    NUMBER:0,//分数
    timeline:null,
    STATE:null,
    SPEED:500,//数度
    AUDIOSTATE:true,//声音的状态
    nowspeed:0,
    LINES:0,//消除的行数
    LEVEL:1,//第几关
    init:function(){
        this.contarr=[];
        this.nowrect=[];
        this.nextrect=[];
        this.NUMBER=0;
        this.STATE=null;
        this.SPEED=500;
        this.nowspeed=0;
        this.LINES=0;
        this.LEVEL=1;
        this.AUDIOSTATE=true;
        for(var i=0;i<20;i++){
            var arr = [];
            for(var j=0;j<10;j++){
                arr.push(0);
            }
            this.contarr.push(arr);
        }
        clearInterval(this.timeline);
        this.timeline=null;
        this.canvasdraw();
        this.rectdraw();
        this.click();
        this.logodraw();
    },
    click:function(){
        var me=this;
        $("#left .bg").bind("touchstart",function() {
            me.move(-1, 0);
            $("#left .pic-cover").addClass("active");
            setTimeout(function () {
                $("#left .pic-cover").removeClass("active");
            }, 80);

//                $("#left .pic-cover").bind('animationend', function(){
//                    $("#left .pic-cover").unbind('animationend', endHandler);
//                    $("#left .pic-cover").removeClass("active");
//                    setTimeout(function () {
//                        $("#left .pic-cover").addClass("active");
//                    }, 0);
//                });

        });
        $("#right .bg").bind("touchstart",function(){
            me.move(1,0);
            $("#right .pic-cover").addClass("active");
            setTimeout(function(){
                $("#right .pic-cover").removeClass("active");},80);
        });
        $("#down .bg").bind("touchstart ",function(){
            me.move(0,1);
            $("#down .pic-cover").addClass("active");
            setTimeout(function(){
                $("#down .pic-cover").removeClass("active");},80);
        });
        $("#rotate .bg").bind("touchstart",function(){
            me.rotate();
            $("#rotate .pic-cover").addClass("active");
            setTimeout(function(){
                $("#rotate .pic-cover").removeClass("active");},80);
        });
        $("#pasueStart .bg").bind("touchstart",function(){
            me.pause();
            $("#pasueStart .pic-cover").addClass("active");
            setTimeout(function(){
                $("#pasueStart .pic-cover").removeClass("active");},80);
        });
        $("#quick .bg").bind("touchstart",function(){
            $("#quick .pic-cover").addClass("active");
            setTimeout(function(){
                $("#quick .pic-cover").removeClass("active");},80);
            if(me.STATE==null){
                var audioStart=$("#audioStart")[0];
                audioStart.pause();
                audioStart.currentTime = 0;
                me.STATE=true;
                me.timeline=setInterval(function(){me.move(0,1);},me.SPEED);
                $("#show .draw-cover-txt").removeClass("show");
                me.rectdraw();
                me.canvasdraw();
                $("#quick .txt").html("快速下落");
            }else if(me.STATE){
                me.quick();
            }
        });
        $("#peset .bg").bind("touchstart",function(){
            me.peset();
        });
        $("#sound .bg").bind("touchstart",function(){
            $("#sound .pic-cover").addClass("active");
            setTimeout(function(){
                $("#sound .pic-cover").removeClass("active");},80);
            var audioStart=$("#audioStart")[0];
            audioStart.pause();
            audioStart.currentTime = 0;
            if(me.AUDIOSTATE==true){
                me.AUDIOSTATE=false;
            }else{
                me.AUDIOSTATE=true;
            }
            if(!$("#bottom-msg .sound .txt").hasClass("active")){
                $("#bottom-msg .sound .txt").addClass("active");
            }else{
                $("#bottom-msg .sound .txt").removeClass("active");
            }
        });
        $("#options .bg").bind("touchstart",function(){
            $("#options .pic-cover").addClass("active");
            setTimeout(function(){
                $("#options .pic-cover").removeClass("active");},80);
        })
    },
    logodraw:function(){
        $("#show .draw-cover-txt").removeClass("active");
        $("#show .draw-cover-txt").removeClass("show");
        $("#show .draw-cover-txt").addClass("active");
        $("#show .draw-cover-txt").addClass("show");
        $("#show .draw-cover-txt").animate({width:"80%"},{ duration: 3000, queue: false,complete:function(){
            $("#show .draw-cover-txt").removeClass("active");
            }});
    },
    canvasdraw:function(){
        var ctx=$('#mycanvas')[0].getContext('2d');
        for(var i=0;i<this.contarr.length;i++){
            for(var j=0;j<this.contarr[i].length;j++){
                var wx = 1+(j*11);
                var wy = 1+(i*11);
                ctx.clearRect(wx,wy,0,0);
                if(!this.contarr[i][j]){
                    ctx.fillStyle="rgb(109,140,124)";
                    ctx.fillRect(wx,wy,10,10);
                    ctx.fillStyle="rgb(128,166,148)";
                    ctx.fillRect(wx+1,wy+1,8,8);
                    ctx.fillStyle="rgb(109,140,124)";
                    ctx.fillRect(wx+2,wy+2,6,6);
                    ctx.strokeStyle="rgb(128,166,148)";
                    ctx.strokeRect(wx,wy,10,10);
                }else{
                    ctx.fillStyle="#000";
                    ctx.fillRect(wx,wy,10,10);
                    ctx.fillStyle="rgb(128,166,148)";
                    ctx.fillRect(wx+1,wy+1,8,8);
                    ctx.fillStyle="#000";
                    ctx.fillRect(wx+2,wy+2,6,6);
                    ctx.strokeStyle="rgb(128,166,148)";
                    ctx.strokeRect(wx,wy,10,10);
                }

            }
        }
    },
    rectdraw:function(){
        if(this.STATE){
            var ctx=$('#mycanvas')[0].getContext('2d');
            if(this.nextrect.length == 0){
                this.nowrect =this.shape();
            }else{
                this.nowrect = this.nextrect;
            }
            this.nowrect.top = -4;
            this.nowrect.left = 4;
            this.nextrect = this.shape();
        }
    },
    peset:function(){
        this.contarr=[];
        this.nowrect=[];
        this.nextrect=[];
        this.NUMBER=0;
        this.STATE=null;
        this.SPEED=500;
        this.nowspeed=0;
        this.LINES=0;
        this.LEVEL=1;
        for(var i=0;i<20;i++){
            var arr = [];
            for(var j=0;j<10;j++){
                arr.push(0);
            }
            this.contarr.push(arr);
        }
        clearInterval(this.timeline);
        this.timeline=null;
        this.canvasdraw();
        this.logodraw();
        if(this.AUDIOSTATE==true) {
            var audioStart = $("#audioStart")[0];
            audioStart.currentTime = 0;
            audioStart.play();
        }
        $("#quick .txt").html("启动游戏");
        $("#score .score .number").html("0");
        $("#lines .lines .number").html("0");
        $("#level .level .number").html("1");
        $("#next .part-show").removeClass("active");
        $("#bottom-msg .pause .txt").removeClass("active");
        $("#peset .pic-cover").addClass("active");
        setTimeout(function(){
            $("#peset .pic-cover").removeClass("active");},80);
    },
    pause:function(){
        if(this.STATE!==null){
            var me=this;
            if(!$("#bottom-msg .pause .txt").hasClass("active")){
                $("#bottom-msg .pause .txt").addClass("active");
                me.STATE=false;
                if(!me.STATE){
                    $("#show .draw-cover-txt").removeClass("active");
                    $("#show .draw-cover-txt").removeClass("show");
                    $("#show .draw-cover-txt").addClass("show");
                }
                $("#pasueStart .txt").html("开始");
                clearInterval(me.timeline);
                me.timeline=null;
            }else{
                $("#bottom-msg .pause .txt").removeClass("active");
                me.STATE=true;
                me.timeline=setInterval(function(){me.move(0,1);},me.SPEED);
                $("#show .draw-cover-txt").removeClass("show");
                $("#pasueStart .txt").html("暂停");
            }
        }
    },
    quick:function(){
        if(this.SPEED!=26){
            this.nowspeed=this.SPEED;
        }
        clearInterval(this.timeline);
        this.timeline=null;
        this.SPEED=26;
        var me=this;
        this.timeline=setInterval(function(){me.move(0,1);},me.SPEED);
    },
    rotate:function(){
        if(this.STATE){
            for(var i=0;i<this.nowrect.length;i++){
                for(var j=0;j<this.nowrect[i].length;j++){
                    if(this.nowrect[i][j]){
                        var px = (j+this.nowrect.left)*11;
                        var py = (i+this.nowrect.top)*11;
                        if(!(i+this.nowrect.top<0)){
                            this.contarr[i+this.nowrect.top][j+this.nowrect.left] = 0;
                        };
                    }
                }
            }
            //创建旋转后的形状
            var rot = [];
            var saver;
            for(var i=0;i<this.nowrect.length;i++){rot.unshift([]);}
            for(i=0;i<this.nowrect.length;i++){
                for(var j=0;j<this.nowrect[i].length;j++){
                    rot[j].unshift(this.nowrect[i][j]);
                }
            }
            rot.left = this.nowrect.left;
            rot.top = this.nowrect.top;
            saver = this.nowrect;
            this.nowrect = rot;
            //如果不可以旋转则nowrect不变
            if(this.canmove(0,0)!=1){this.nowrect = saver;}
            for(i=0;i<this.nowrect.length;i++){
                for(j=0;j<this.nowrect[i].length;j++){
                    if(i+this.nowrect.top<0){continue;}
                    if(this.nowrect[i][j]){
                        this.contarr[i+this.nowrect.top][j+this.nowrect.left] = 1;
                    }
                }
            }
            this.canvasdraw();
        }
    },
    move:function(mx,my){
        if(this.STATE){
            var me=this;
            //清除数组中的当前方块
            for(var i=0;i<this.nowrect.length;i++){
                for(var j=0;j<this.nowrect[i].length;j++){
                    if(this.nowrect[i][j]){
                        var px = (j+this.nowrect.left)*11;
                        var py = (i+this.nowrect.top)*11;
                        if(!(i+this.nowrect.top<0)){
                            this.contarr[i+this.nowrect.top][j+this.nowrect.left] = 0;
                        };
                    }
                }
            }
            var state = this.canmove(mx,my);
            if(state){//如果可以移动则 top,left += my,mx
                if(state !=2){
                    this.nowrect.top += my;
                    this.nowrect.left += mx;
                }
                for(i=0;i<this.nowrect.length;i++){
                    for(j=0;j<this.nowrect[i].length;j++){
                        if(i+this.nowrect.top<0){continue;}
                        if(this.nowrect[i][j]){
                            this.contarr[i+this.nowrect.top][j+this.nowrect.left] = 1;
                        }
                    }
                }
            }else{//否则数组添加原位置方块，判断消除和结束
                if(this.SPEED==26){
                    clearInterval(this.timeline);
                    this.SPEED=this.nowspeed;
                    this.timeline=setInterval(function(){me.move(0,1);},me.SPEED);
                    this.STATE=true;
                }
                for(i=0;i<this.nowrect.length;i++){
                    for(j=0;j<this.nowrect[i].length;j++){
                        if(i+this.nowrect.top<0){continue;}
                        if(this.nowrect[i][j]){
                            this.contarr[i+this.nowrect.top][j+this.nowrect.left] = 1;
                        }
                    }
                }
                var clr = [];
                var lines=0;
                for(var i= 0;i<this.contarr.length;i++){
                    var boo = 0;
                    for(j=0;j<this.contarr[i].length;j++){
                        if(this.contarr[i][j]){boo++}
                    }
                    if(boo==10){
                        lines++;
                        if(this.AUDIOSTATE==true){
                            var audioClear=$("#audioClear")[0];
                            audioClear.currentTime = 0;
                            audioClear.play();
                        }
                        this.LINES++;
                        $("#lines .lines .number").html(this.LINES);
                        clr.push(i);
                        //修改level及调整速度
                    }
                }
                //计分规则
                if(lines==1){
                    this.NUMBER += 40;
                    $("#score .score .number").html(this.NUMBER);
                }else if(lines==2){
                    this.NUMBER += 100;
                    $("#score .score .number").html(this.NUMBER);
                }else if(lines==3){
                    this.NUMBER += 180;
                     $("#score .score .number").html(this.NUMBER);
                }else if(lines==4){
                    this.NUMBER += 300;
                    $("#score .score .number").html(this.NUMBER);
                }
                //消除满行
                for(i=0;i<clr.length;i++){
                    var id = clr.length-i-1;
                    this.contarr.splice(clr[id],1);
                }
                for(i=0;i<clr.length;i++){
                    var n = [];
                    for(j=0;j<this.contarr[0].length;j++){n.push(0);}
                    this.contarr.unshift(n);
                }
                //游戏结束
                for(i=0;i<this.contarr[0].length;i++){
                    if(this.contarr[0][i]){
                        clearInterval(me.timeline);
                        this.STATE=false;
                        if(this.AUDIOSTATE==true){
                            var audioFail=$("#audioFail")[0];
                            audioFail.currentTime = 0;
                            audioFail.play();
                        }
                    }
                }
                if(this.NUMBER>4000){
                    $("#level .level .number").html("9");
                    this.SPEED=100;
                }else if(this.NUMBER>3500){
                    $("#level .level .number").html("8");
                    this.SPEED = 150;
                }else if(this.NUMBER>3000){
                    $("#level .level .number").html("7");
                    this.SPEED = 200;
                }else if(this.NUMBER>2500){
                    $("#level .level .number").html("6");
                    this.SPEED = 250;
                }else if(this.NUMBER>2000){
                    $("#level .level .number").html("5");
                    this.SPEED = 300;
                }else if(this.NUMBER>1500){
                    $("#level .level .number").html("4");
                    this.SPEED = 350;
                }else if(this.NUMBER>1000){
                    $("#level .level .number").html("3");
                    this.SPEED = 400;
                }else if(this.NUMBER>500){
                    $("#level .level .number").html("2");
                    this.SPEED = 450;
                }
                if(this.LEVEL!= parseInt($("#level .level .number").html())){
                    $("#show .leveladd-cover").addClass("active");
                    setTimeout(function(){$("#show .leveladd-cover").removeClass("active");},1500);
                    this.LEVEL++;
                }
                clearInterval(this.timeline);
                this.timeline=null;
                this.timeline=setInterval(function(){me.move(0,1);},this.SPEED);
                if(this.AUDIOSTATE==true) {
                    var audioDown = $("#audioDown")[0];
                    audioDown.currentTime = 0;
                    audioDown.play();
                }
                this.rectdraw();
            }
            this.canvasdraw();
        }
    },
    canmove:function(mx,my){
        if(this.STATE){
            var boo = 1;
            for(var i=0;i<this.nowrect.length;i++){
                for(var j=0;j<this.nowrect[i].length;j++){
                    if(this.nowrect[i][j]){
                        var px = j+this.nowrect.left+mx;
                        var py = i+this.nowrect.top+my;
                        if(px<0){return 2;}
                        if(px>9){return 2;}
                        if(py<0){continue;}
                        if(py>19){return 0;}
                        var fr = this.contarr[py][px];
                        if(fr!=0){
                            if(mx==0){return 0;}
                            if(my==0){return 2;}
                        }
                    }
                }
            }
            // 0：往下不可移动，1：可以移动，2：左右不可移动
            return boo;
        }
    },
    //随机生成图形
    shape:function(){
        var createRect = [[
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0]
        ],[
            [0,0,0,0],
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0]
        ],[
            [0,0,0,0],
            [1,1,1,0],
            [0,1,0,0],
            [0,0,0,0]
        ],[
            [0,1,1,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,0,0,0]
        ],[
            [0,1,1,0],
            [0,0,1,0],
            [0,0,1,0],
            [0,0,0,0]
        ],[
            [0,1,0,0],
            [0,1,1,0],
            [0,0,1,0],
            [0,0,0,0]
        ],[
            [0,0,1,0],
            [0,1,1,0],
            [0,1,0,0],
            [0,0,0,0]
        ],[
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0]
        ]];
        var len = createRect.length;
        var nextNum=parseInt(Math.random()*len);
        $("#next .part-show").removeClass("active");
        $("#next .part-show.part-"+nextNum+"").addClass("active");
        var rtvalue = createRect[nextNum];
        this.NUMBER+=10;
        $("#score .score .number").html(this.NUMBER);
        return rtvalue;
    }
}
$(function(){
    $('body').on('touchmove',function(e) {
        e.preventDefault();
    });
    $('body').on('touchend',function(e) {
        e.preventDefault();
    });
    time();
    tetris.init();
});

