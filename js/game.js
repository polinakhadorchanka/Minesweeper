let startDate,
    clocktimer;
    init = 0;

function clearFields() {
    init = 0;
    clearTimeout(clocktimer);
    let timer = document.getElementById('clock');
    timer.value='00:00.00';
}

function startTIME() {
    let thisDate = new Date();
    let t = thisDate.getTime() - startDate.getTime();
    let ms = t%1000; t-=ms; ms=Math.floor(ms/10);
    t = Math.floor (t/1000);
    let s = t%60; t-=s;
    t = Math.floor (t/60);
    let m = t%60; t-=m;
    t = Math.floor (t/60);

    if (m<10) {
        m='0'+m;
    }

    if (s<10) {
        s='0'+s;
    }

    if (ms<10) {
        ms='0'+ms;
    }

    let timer = document.getElementById('clock');

    if (init===1) {
        timer.value = m + ':' + s + '.' + ms;
    }

    clocktimer = setTimeout(startTIME,10);
}

function newGame(m,n,countOfMines) {
    document.oncontextmenu = function (){
        return false
    };
    clearFields();

    let mineCount = countOfMines,
        minePositions = [],
        firstClick = false,
        gameOver = false;

    document.getElementById("divGame").innerHTML = '';

    for (let i = 0; i < m * n; i++) {
        let p = document.createElement("p");
        p.className = 'cell blankCell';
        p.id = Math.floor(i / m) + '_' + i % m;
        p.name = '0';
        document.getElementById("divGame").append(p);
    }

    document.getElementById("mineRemainder").innerHTML = 'осталось мин: ' + mineCount;

    let cells = document.querySelectorAll('.cell');
    for(let i=0; i<cells.length; i++) {
        cells[i].addEventListener('click', function(event) {
            if (!gameOver) {
                let clickId = cells[i].id;

                if (!firstClick) {
                    firstClick = true;

                    startDate = new Date();
                    init = 1;
                    startTIME();

                    generateMines(clickId);
                    generateNeighbors();
                }

                cells[i].classList.remove('blankCell');
                if (cells[i].classList.contains('flag')) {
                    cells[i].classList.remove('flag');
                    mineCount++;
                    document.getElementById("mineRemainder").innerHTML = 'осталось мин: ' + mineCount;
                }

                cells[i].classList.remove('question');
                openCells(cells[i]);
                if (!isMine(clickId) && document.getElementsByClassName('open').length === (m * n) - countOfMines) {
                    gameOver = true;
                    fGameOver();
                    init = 0;
                    document.querySelector('.newGameBtn').innerHTML = 'win';
                }
            }

        });

        cells[i].addEventListener('contextmenu', function(event) {
            if (!gameOver) {
                if (cells[i].classList.contains('flag') && !cells[i].classList.contains('open')) {
                    mineCount++;
                    document.getElementById("mineRemainder").innerHTML = 'осталось мин: ' + mineCount;
                    cells[i].classList.remove('flag');
                    cells[i].classList.add('question');
                } else if (cells[i].classList.contains('question') && !cells[i].classList.contains('open'))
                    cells[i].classList.remove('question');
                else if (!cells[i].classList.contains('open')) {
                    mineCount--;
                    document.getElementById("mineRemainder").innerHTML = 'осталось мин: ' + mineCount;
                    cells[i].classList.add('flag');
                }
            }
        });
    }

    function isMine(id) {
        let cell = document.getElementById(id);
        return cell!=null && cell.classList.contains('mine');
    }

    function generateMines(firstClick) {
        for(let i=0; i<countOfMines; i++) {
            let rand = Math.floor(Math.random() * (m*n-1));
            minePositions[i] = Math.floor(rand/m) + '_' + rand%m;

            if(isMine(minePositions[i]) || minePositions[i]===firstClick) {
                i--;
                continue;
            }

            document.getElementById(minePositions[i]).classList.add('mine');
        }
    }

    function generateNeighbors() {
        for(let i=0; i<m*n; i++) {
            let id = Math.floor(i/m) + '_' + i%m;
            let cell = document.getElementById(id);

            let idCellsAround = [((Math.floor(i/m)-1) + '_' + (i%m-1)),
                ((Math.floor(i/m)-1) + '_' + (i%m)),
                (Math.floor(i/m)-1) + '_' + (i%m+1),
                (Math.floor(i/m)) + '_' + (i%m+1),
                (Math.floor(i/m)+1) + '_' + (i%m+1),
                (Math.floor(i/m)+1) + '_' + (i%m),
                (Math.floor(i/m)+1) + '_' + (i%m-1),
                (Math.floor(i/m)) + '_' + (i%m-1)];

            for(let j=0; j<idCellsAround.length; j++) {
                if(isMine(idCellsAround[j])) cell.name++;
            }
        }
    }

    function openCells(cell) {
        let id = cell.id;
        cell.classList.add('open');

        if(minePositions.indexOf(id) !== -1) {
            fGameOver(cell);
        }
        else {
            document.getElementById(id).style.backgroundImage = 'url(img/open/open'+cell.name+'.png)';

            let arr = id.split('_', 2);
            let cells = [document.getElementById((+(arr[0])+1) + '_' + arr[1]),
                document.getElementById((+(arr[0])-1) + '_' + arr[1]),
                document.getElementById(arr[0] + '_' + (+(arr[1])+1)),
                document.getElementById(arr[0] + '_' + (+(arr[1])-1)),
                document.getElementById((+(arr[0])+1) + '_' + (+(arr[1])+1)),
                document.getElementById((+(arr[0])-1) + '_' + (+(arr[1])-1)),
                document.getElementById((+(arr[0])-1) + '_' + (+(arr[1])+1)),
                document.getElementById((+(arr[0])+1) + '_' + (+(arr[1])-1))];

            for(let i=0; i<cells.length; i++) {
                let el = cells[i];

                if(cell.name==='0' && el!==null && !el.classList.contains('open') && !el.classList.contains('mine') && !el.classList.contains('flag') && !el.classList.contains('question')) {
                    openCells(el);
                }
            }
        }
    }

    function fGameOver(cell) {
        init = 0;
        if (cell !== undefined) {
        document.getElementById(cell.id).style.backgroundImage = 'url(img/mines/minedeath.png)';
        gameOver = true;
        }

        for(let i=0; i<minePositions.length; i++) {
            let mine = document.getElementById(minePositions[i]);
            mine.classList.remove('blankCell');
            mine.classList.remove('flag');
            mine.classList.remove('question');
        }

        let elements = document.querySelectorAll('.flag');
        for(let i=0; i<elements.length; i++) {
            elements[i].style.backgroundImage = 'url(img/mines/minemisflag.png)';
        }
        document.querySelector('.newGameBtn').innerHTML = 'loss';
    }
}

function menuOpen() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function setParameters(width, height, giHeight, m, n, count) {
    document.querySelector('header').style.width = width;
    document.querySelector('.menu').style.width = width;

    document.querySelector('.game').style.width = width;
    document.querySelector('.game').style.height = height;

    document.querySelector('.gameInformation').style.width = giHeight;

    clearFields();
    newGame(m, n, count);
}

function startNewGame() {
    document.querySelector('.newGameBtn').innerHTML = 'new';

    if(document.location.hash === '#3') {
        setParameters('600px', '400px', '552px', 30, 20, 99);
    }
    else if(document.location.hash === '#2') {
        setParameters('300px', '300px', '252px', 15, 15, 40);
    }
    else {
        setParameters('180px', '180px', '132px', 9, 9, 10);
    }
}

document.onload = startNewGame();