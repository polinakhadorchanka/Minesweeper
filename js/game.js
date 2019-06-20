var startDate;
var clocktimer;
var init = 0;
	
function NewGame(m,n,countOfMines) {
	$("body").contextmenu(function(){return false;});
	clearFields();
	
	var mineCount = countOfMines;
	var minePositions = [];
	var firstClick = false;
	var gameOver = false;
	
	var div = document.getElementById("divGame");
	div.innerHTML = '';
	for(var i=0; i<m*n; i++) {
		var p = document.createElement("p");
		p.className = 'cell blankCell';
		p.id = Math.floor(i/m) + '_' + i%m;
		p.name = '0';
		div.append(p);
	}
	
	p = document.getElementById("mineRemainder");
	p.innerHTML = '';
	$(p).append('осталось мин: ' + mineCount);

	$('.cell').mousedown(function(event){
		if(event.which==1) {
			if(gameOver == false) {
				var clickId = $(this).prop('id');
					
				if(firstClick==false) {
					firstClick = true;
					
					startDate = new Date();
					init = 1;
					startTIME();
					
					generateMines(clickId);
					generateNeighbors();
					}
						
					this.classList.remove('blankCell');
					if($(this).hasClass('flag')) {
						this.classList.remove('flag');
						mineCount++;
						p = document.getElementById("mineRemainder");
						p.innerHTML = '';
						$(p).append('осталось мин: ' + mineCount);
					}
					this.classList.remove('question');
					openCells(this);
					if(!isMine(clickId)) {
						if(document.getElementsByClassName('open').length == (m*n)-countOfMines) {
						gameOver = true;
						fGameOver();
						$('.newGameBtn').css('backgroundImage','url(img/button/win.png)');
						init = 0;
					}
				}
			}
		}
		if(event.which==3) {
			if(gameOver == false) {
				var clickId = $(this).prop('id');
				
				if($(this).hasClass('flag') && !$(this).hasClass('open')) {
					mineCount++;
					p = document.getElementById("mineRemainder");
					p.innerHTML = '';
					$(p).append('осталось мин: ' + mineCount);
					this.classList.remove('flag');
					this.classList.add('question');
				}
				else if($(this).hasClass('question')  && !$(this).hasClass('open'))
					this.classList.remove('question');
				else if(!$(this).hasClass('open')){
					mineCount--;
					p = document.getElementById("mineRemainder");
					p.innerHTML = '';
					$(p).append('осталось мин: ' + mineCount);
					this.classList.add('flag');
					var x =0;
				}				
			}
		}
	});
	
	function isMine(id) {
		var cell = document.getElementById(id);
		if($(cell).hasClass('mine') && cell!=null) return true;
		else return false;
	};
	
	function generateMines(firstClick) {
		for(i=0; i<countOfMines; i++) {
			var rand = Math.floor(Math.random() * (m*n-1));
			minePositions[i] = Math.floor(rand/m) + '_' + rand%m;
			
			if(isMine(minePositions[i]) || minePositions[i]==firstClick) {
				i--;
				continue;
			}
			
			document.getElementById(minePositions[i]).classList.add('mine');
		}
	};
	
	function generateNeighbors() {
		for(var i=0; i<m*n; i++) {
			var id = Math.floor(i/m) + '_' + i%m;
			var cell = document.getElementById(id);
		
			if(isMine((Math.floor(i/m)-1) + '_' + (i%m-1))) cell.name++;
			if(isMine((Math.floor(i/m)-1) + '_' + (i%m))) cell.name++;
			if(isMine((Math.floor(i/m)-1) + '_' + (i%m+1))) cell.name++;
			if(isMine((Math.floor(i/m)) + '_' + (i%m+1))) cell.name++;
			if(isMine((Math.floor(i/m)+1) + '_' + (i%m+1))) cell.name++;
			if(isMine((Math.floor(i/m)+1) + '_' + (i%m))) cell.name++;
			if(isMine((Math.floor(i/m)+1) + '_' + (i%m-1))) cell.name++;
			if(isMine((Math.floor(i/m)) + '_' + (i%m-1))) cell.name++;
		}
	};
	
	function openCells(cell) {
		var id = $(cell).prop('id');
		cell.classList.add('open');
		
		if(minePositions.indexOf(id) != -1) 
			fGameOver(cell);
		else {
			$(cell).css('backgroundImage','url(img/open/open'+cell.name+'.png)');
			
			var arr = id.split('_', 2);
			var cells = new Array(document.getElementById((+(arr[0])+1) + '_' + arr[1]), document.getElementById((+(arr[0])-1) + '_' + arr[1]),
					document.getElementById(arr[0] + '_' + (+(arr[1])+1)), document.getElementById(arr[0] + '_' + (+(arr[1])-1)), 
					document.getElementById((+(arr[0])+1) + '_' + (+(arr[1])+1)), document.getElementById((+(arr[0])-1) + '_' + (+(arr[1])-1)),
					document.getElementById((+(arr[0])-1) + '_' + (+(arr[1])+1)), document.getElementById((+(arr[0])+1) + '_' + (+(arr[1])-1)));
		
			for(var i=0; i<8; i++) {
				var el = cells[i];

				if(cell.name=='0' && el!=null && !$(el).hasClass('open') && !$(el).hasClass('mine') && !$(el).hasClass('flag') && !$(el).hasClass('question'))
					openCells(el);
			}
		}
	};
	
	function fGameOver(cell) {
		init = 0;
		$(cell).css('backgroundImage','url(img/mines/minedeath.png)');
			gameOver = true;
		for(var i=0; i<minePositions.length; i++) {
			var mine = document.getElementById(minePositions[i]);
			mine.classList.remove('blankCell');
			mine.classList.remove('flag');
			mine.classList.remove('question');
		}
			
		$('.flag').css('backgroundImage','url(img/mines/minemisflag.png)');

		$('.newGameBtn').css('backgroundImage','url(img/button/gameOver.png)');
	};
};

function clearFields() {
		init = 0;
		clearTimeout(clocktimer);
		var timer = document.getElementById('clock');
		timer.value='00:00.00';
	};
	 
	function startTIME() { 
		var thisDate = new Date();
		var t = thisDate.getTime() - startDate.getTime();
		var ms = t%1000; t-=ms; ms=Math.floor(ms/10);
		t = Math.floor (t/1000);
		var s = t%60; t-=s;
		t = Math.floor (t/60);
		var m = t%60; t-=m;
		t = Math.floor (t/60);
		if (m<10) m='0'+m;
		if (s<10) s='0'+s;
		if (ms<10) ms='0'+ms;
		var timer = document.getElementById('clock');
		if (init==1) timer.value = m + ':' + s + '.' + ms;
		clocktimer = setTimeout(startTIME,10);
    };

document.onload = startNewGame();