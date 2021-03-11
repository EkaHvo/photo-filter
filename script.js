'use strict';

const filtersParent = document.querySelector('.filters');
const filter = document.querySelectorAll('.filters input');
const btnContainer = document.querySelector('.btn-container');
const btns = document.querySelectorAll('.btn');
const btnNext = document.querySelector('.btn-next');
const btnSave = document.querySelector('.btn-save');
const mainImg = document.querySelector('.main-img');
const canvas = document.querySelector('canvas');
const btnFullscreen = document.querySelector('.fullscreen');

function filtersWork() {
    filtersParent.addEventListener('input', (e) => {
        let target = e.target;
        let output = target.nextElementSibling;
        output.value = target.value;
        mainImg.style.setProperty(`--${target.name}`, target.value + target.dataset.sizing);
    });
}
filtersWork();

function resetImg() {
    for(let i = 0; i < filter.length;i++) {
        filter[i].value = 0;
        if(filter[i].matches('.saturate')) {
            filter[i].value = 100;
        } 
        filter[i].nextElementSibling.value = filter[i].value;
        mainImg.style.setProperty(`--${filter[i].name}`, filter[i].value + filter[i].dataset.sizing);
    }
}

function getNowTime() {
    let nowHours = new Date().getHours();
    let nowTimesOfDay;
    (nowHours >= 6 && nowHours <=11)? nowTimesOfDay = 'morning': 
    (nowHours >= 12 && nowHours <=17)? nowTimesOfDay = 'day': 
    (nowHours >= 18 && nowHours <=23)? nowTimesOfDay = 'evening':
    (nowHours >= 0 && nowHours <=5)? nowTimesOfDay = 'night': 
    alert('Error time of date!');

    return nowTimesOfDay;
}

function changeImg() {
    let i = 0;
    const baseUrl = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/`;
    const imgsArr = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20'];

    btnNext.addEventListener('click',() => {
        let nowtime = getNowTime();
        nextImg(nowtime);
        if(i == imgsArr.length-1){
            i = 0;
        }else {
            i++;
        }
    });

    function nextImg(time) {
        const img = new Image();
        let srcImg = `${baseUrl}${time}/${imgsArr[i]}.jpg`;
        img.src = srcImg;
        img.onload = () => {      
            mainImg.src = img.src;
        };
    }
}
changeImg();

function createCanvas(){
    const img = new Image(); 
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = mainImg.src; 
    img.onload = function(){
        const ctx = canvas.getContext("2d");
        let filter = "";
        let imgFilters = mainImg.style.cssText;
        for(let i = 0; i < imgFilters.length; i++) {
            if(imgFilters[i] === "-" && imgFilters[i-1] !== "e"){
                continue;
            } else {
                switch(imgFilters[i]){
                    case ":" : (filter = filter + "(");break;
                    case ";" : (filter = filter + ")");break;
                    default : (filter = filter + imgFilters[i]);
                }
            }
        }
        console.log(filter);
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.filter = filter;
        ctx.drawImage(img, 0, 0);
    };
}

function saveImg() {
    btnSave.addEventListener('click', function(e) {
        createCanvas();
        setTimeout(function(){
        var link = document.createElement('a');
        link.download = 'photo-filter.jpg';
        link.href = canvas.toDataURL();
        link.click();
        link.delete;
        },10);
    });
}
saveImg();

function addFile() {
    const fileInput = document.getElementById('btnInput');
    fileInput.addEventListener('input', function(e) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            mainImg.src = reader.result;
        }
        reader.readAsDataURL(file);
    });
}
addFile();

function hideBtnActive() {
    btns.forEach(btn => {
        btn.classList.remove('btn-active');
    });
}

function btnsActiveTarget(elem = btns[0]) {
    if(elem.matches('.btn')) {
        hideBtnActive();
        elem.classList.add('btn-active');
    }
    if(!elem.matches('.btn')) {
        hideBtnActive();
        elem.parentElement.classList.add('btn-active');
    }
}
btnsActiveTarget();

function btnsWork() {
    btnContainer.addEventListener('click',(e) => {
        let target = e.target;
        btnsActiveTarget(target);

        if(target.matches('.btn-reset')) {
            resetImg();
        }
    });
}
btnsWork();

function fullscreenWork() {
    btnFullscreen.addEventListener('click',() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
}
fullscreenWork();