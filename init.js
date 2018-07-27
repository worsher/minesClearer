$(function(){
	$("[level]").on("click",function(e){
		e.preventDefault();
		var level = $(this).attr("level");
		init(level);
	})

	$(document).on("click" , "[mine]" , function(e){
		var mine = $(this).attr("mine");
		if(mine==-1){
			if(!$(this).hasClass(mine))gameover();
		}else if(mine==0){
			$(this).addClass("blank");
			var i = $(this).parent().index(),
				j = $(this).index(),
				max = $(this).parent().children().length;
			blankToggle(i , j , max);
		}else{
			if(!$(this).hasClass("mine-num")){
				$(this).html(mine);
				$(this).addClass("mine-num");
			}			
		}
	})

	$(document).on("contextmenu", "[mine]" , function(e){
		e.preventDefault();
		if($(this).hasClass("mine"))return false;
		var mine = $(this).attr("mine");
		if(!$(this).hasClass("blank") && !$(this).hasClass("mine-num"))$(this).addClass("mine");
		if(mine != -1){
			window.result = false;
			window.error[$(this).attr("i") + "" + $(this).attr("j")] = 1;
			console.log(window.error);
		}
		window.mine_num--;
		if(window.mine_num==0){
			if(window.result){
				gamesuccess();
			}else{
				gameover();
			}			
		}
	})

	$(document).on("dblclick" , ".mine-num" , function(e){
		e.preventDefault();
		var i = $(this).parent().index(),
			j = $(this).index(),
			max = $(this).parent().children().length,
			num = $(this).attr("mine");
		MineAutoClick(i , j ,max , num);
	})

	$(document).on("contextmenu" , ".mine" , function(e){
		$(this).removeClass("mine");
		window.mine_num ++ ;
		delete(window.error[$(this).attr("i") + "" + $(this).attr("j")]);
		if(JSON.stringify(window.error)=="{}")window.result = true;
	})
});