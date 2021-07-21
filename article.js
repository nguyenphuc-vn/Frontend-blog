let idUrl = location.search == "" ? " " : Number(location.search.substr(1));
console.log(idUrl);
if (!Number.isInteger(idUrl)) {
    idUrl = 1;
}


async function getData() {
    let res = await fetch("https://personalblog1996.herokuapp.com/api/article/" + Number(idUrl));
    let result = await res.json();
    //console.log(result);
    return result;
}

function display() {
    getData().then(result => {
        getArticle(result);
    })
}
function getArticle(result) {
    let title = document.querySelector('.title');
    //console.log(title);
    title.innerHTML = result.title;
    let content = document.querySelector('.content');
    //console.log(content);
    content.innerHTML = result.body;
}
display();