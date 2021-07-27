//const urlHost = "http://localhost:8080/api/news/";
const urlHost = "https://personalblog1996.herokuapp.com/api/news";
const row = document.querySelector('.row');
const ul = document.querySelectorAll('.pagination')[1];
const articleLink = getPathFromUrl(window.location.href)+'article.html';
//console.log(articleLink);

//console.log(ul);

let pageParam = location.search == "" ? Number(1) : Number(location.search.substr(6));
//console.log(pageParam);
let pageSearchParam = new URLSearchParams();

async function fetchResult(){
    let res = await fetch(urlHost+'?page='+pageParam);
    let result = await res.json();
    return result; 
}
function getNews(){
    fetchResult().then(result =>{
        newsUI(result);
        navigationUI(result);
    })
}
function newsUI(result){   
    const col = document.querySelector('.col-lg-6');    
    let newsSize = result.list.length;   
    refreshRow(row);
    appendRow(newsSize,col);
    populateData(result);
}

function navigationUI(result){   
    previousAndNext(result);
    paginated(result);
}

function previousAndNext(result){
    let pageLink = document.querySelectorAll('.page-link');
    let last = pageLink.length;
    if(result.prevEnabled){
       pageLink[0].href = setSearchParam(-1);
       switchPage(pageLink[0]);
    }
    if(result.hasNext){
        pageLink[last-1].href = setSearchParam(1);
        switchPage(pageLink[last-1]);
    }     
}

function paginated(result){
    let totalPages = result.totalPages;
    refreshUl();
    if(totalPages >=8){   
    if(pageParam+7 >totalPages){
        pageParam = totalPages-7;
    }
    let current = pageParam;  
    if(pageParam+7 -totalPages >=3){
        current  = pageParam+7 -totalPages;
    }
    setPageButton(current,pageParam+7,result);
    } 
    else
    setPageButton(1,totalPages,result);
}

function setPageButton(start,end,result){
    for(let i =start ;i<=end;i++){
        let items = getItems();      
        if(i == result.number+1){
            items.li.className = 'page-item active';
            items.li.removeChild(items.anchor);
            items.li.append(getSpan(i));
        }        
        items.anchor.innerHTML = i;
        items.anchor.href = setQueryParam(i);
        
        switchPage(items.anchor);
        ul.append(items.li); 
    }    
}

function getSpan(i){
    let span = document.createElement('span');
    span.className = 'page-link';
    span.innerHTML = i;
    return span;
}

function getItems(){
    let li = document.createElement('li');
    li.className = 'page-item';
    let anchor = document.createElement('a');
    anchor.className = 'page-link';
    li.append(anchor);
    return {li,anchor};
}
//console.log(getItems().li);

function setQueryParam(number){
    pageSearchParam.set('page',number);  
    return getPathFromUrl(window.location.href) + '?page='+number;
}

function setSearchParam(number){
    pageSearchParam.set('page',Number(pageParam+number));  
    return getPathFromUrl(window.location.href) + '?page='+Number(pageParam+number);
}



function switchPage(pageLink){
    pageLink.addEventListener('click',()=>{
        getNews();    
    })
}

function getPathFromUrl(url) {
    return url.split("?")[0];    
}

function populateData(result){   
    const col = document.querySelectorAll('.col-lg-6'); 
    let length = col.length;
    //console.log(length);
    for(let n = 0; n<length;n++){
        let news = result.list[n];
        let title = document.querySelectorAll('.title');
        title[n].innerHTML = news.title;
        let img = document.querySelectorAll('.image');
        img[n].src = news.image;
        let des = document.querySelectorAll('.desc');
        des[n].innerHTML = news.description;
        let link = document.querySelectorAll('.wrapper');
        link[n].href = articleLink+'?id='+ news.id;
    }
}
function appendRow(newsSize,col){ 
    for(let i=0; i< newsSize; i++){
        let cloneCol = col.cloneNode(true);
        row.append(cloneCol);
     }
}

function refreshUl(){
    ul.innerHTML ='';
}

function refreshRow(row){
    row.innerHTML = '';
}
getNews();