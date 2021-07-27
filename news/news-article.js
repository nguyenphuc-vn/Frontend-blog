//const urlHost = "http://localhost:8080/api/news/";
const urlHost = "https://personalblog1996.herokuapp.com/api/news/";
let pageParam = Number(location.search.substr(4));
//console.log(pageParam);

async function fetchResult(){
    let res = await fetch(urlHost+'article/?id='+pageParam);
    let result = await res.json();
    return result; 
}

function getNews(){
    fetchResult().then(result =>{
        display(result);       
    })
} 

function display(result){
    let title = document.getElementById('title');
    title.innerHTML = result.title;
    let img = document.getElementById('image');
    img.src = result.image;
    let content = document.getElementById('content');
    content.innerHTML = result.content;
}


getNews();