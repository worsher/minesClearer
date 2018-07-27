var global_config = [
	{
		"num" : 10,
		"mines" : 10
	},
	{
		"num" : 15,
		"mines" : 30
	},
	{
		"num" : 20,
		"mines" : 50
	}
]
//初始化画格子
function init(level){
	level = !isNaN(parseInt(level)) ? level : 0;
	level = level > global_config.length ? 0 : level;
	var config = global_config[level],
		mines = MineMatrix(Minerandom(1 , Math.pow(config['num'],2) , config['mines']) , config['num']);
	window.mine_num = config.mines;
	window.level = level
	drawMine(mines);
	window.mines = mines;
	window.result = true;
	window.error = {};
}

//画雷区页面
function drawMine(mines){
	var html = "";
	for(var i in mines){
		html += "<ul class='mine-list'>"
		for(var j in mines[i]){
			html += "<li i=" + i + " j= " + j + " mine='"+ mines[i][j] +"' class='mine-single'></li>"
		}
		html += "</ul>"
	}
	$("#mine-item").html(html);
}

//产生N个随机数
function Minerandom(start , end , num){
	if(isNaN(parseInt(start)) || isNaN(parseInt(end)) || isNaN(parseInt(num)))return false;
	if(end - start < num)return false;
	var result = _.range(start , end + 1);
	var randoms = 0;
	for(var i=num;i>0;i--){
		randoms = _.random(0 , result.length);
		delete(result[randoms]);
		result = _.compact(result);
	}
	return result;
}

//产生布雷矩阵
function MineMatrix(mines , square){
	var minesResult = [];
	for(var i=0; i<square ; i++){
		minesResult[i] = [];
		for(var j=0; j<square ; j++){
			var current = i * square + j + 1;
			if(_.indexOf(mines , current)>=0){
				minesResult[i][j] = 0;
			}else{
				minesResult[i][j] = -1;
			}	
		}
	}
	//二次纠正布雷数量
	for(var i=0; i<square ; i++){
		for(var j=0; j<square ; j++){
			if(minesResult[i][j]==0){
				minesResult[i][j] = MineCounts(minesResult , i , j , square);
			} 
		}
	}
	//console.log(minesResult);
	return minesResult;
}

//计算某个点雷的个数
function MineCounts(mines , i , j ,square){
	var count = 0;
	var i_start = glzero(i - 1 , 0 , square-1) ,
		i_end = glzero(i + 1 , 0 , square-1),
		j_start = glzero(j - 1 , 0 , square-1),
		j_end = glzero(j + 1 , 0 , square-1);
	for(var m = i_start ; m <= i_end ; m ++){
		for(var n = j_start ; n <= j_end ; n ++){
			if(mines[m][n]==-1)count++;
		}
	}
	return count;
}

//防止数字超过界限
function glzero(k , mix , max){
	if(k<mix)return mix;
	if(k>max)return max;
	return k;
}

//游戏结束
function gameover(){
	alert("gameover");
	init(window.level);
}

//游戏成功
function gamesuccess(){
	alert("you win");
	init(window.level);
}

//打开一片空白
function blankToggle(i , j , num){
	for(var x = i ; x >=0 ; x--){
		if(eleAutoClick(x , j , num))break;
	}

	for(var x = i; x < num ; x ++){
		if(eleAutoClick(x , j , num))break;
	}

	for(var y = j ; y < num ; y ++){
		if(eleAutoClick(i , y , num))break;
	}

	for(var y = j; y >=0 ; y --){
		if(eleAutoClick(i , y , num))break;
	}
}

//计算每个节点十字方位可展开空白点
function eleAutoClick(x , y , num){
	var $el = $(".mine-list").eq(x).children().eq(y);
	if(window.mines[x][y]==0 && !$el.hasClass("blank")){
		$el.click();
		$el.addClass("blank");
		blankToggle(x , y , num);
	}else if(window.mines[x][y]>0){
		$el.html($el.attr("mine"));
		$el.addClass("mine-num");
		return true;
	}
	return false;
}

//点击数字自动展开节点
function MineAutoClick(i , j , max , num){
	var obj = [],
		count = 0;
	var i_start = glzero(i - 1 , 0 , max-1) ,
		i_end = glzero(i + 1 , 0 , max-1),
		j_start = glzero(j - 1 , 0 , max-1),
		j_end = glzero(j + 1 , 0 , max-1);
	minefirst:
	for(var m = i_start ; m <= i_end ; m ++){
		for(var n = j_start ; n <= j_end ; n ++){
			var $el = $(".mine-list").eq(m).children().eq(n);
			obj.push($el);
			if($el.hasClass("mine")){
				if($el.attr("mine")==-1){
					count ++ ;
				}else{
					gameover();
					break minefirst;
				}
			}
		}
	}
	if(count == num){
		$(obj).each(function(){
			if($(this).hasClass("blank") || $(this).hasClass("mine-num") || $(this).attr("mine")>=0){
				$(this).click();
			}
		})
	}
}