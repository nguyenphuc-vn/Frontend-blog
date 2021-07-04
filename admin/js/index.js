
let article;
let pageNumber =1;
let apiUrl = 'http://localhost:8080/api/articles/?pageNumber';

async function getJson(apiUrl){
  let response = await fetch(apiUrl+pageNumber);
  article = await response.json();
  console.log(article);
  return article;
}

function appendTable(){
  getJson(apiUrl).then(()=>{
    const articleTable = document.querySelector('table');
    let length = article.articles.length;
    console.log(length);
    for(let i=0; i<length;i++){
      let articleTableBodyRow = document.createElement('tr');
      articleTableBodyRow.className = 'articleTableBodyRow';
      let title = document.createElement('td');
      title.scope = 'row';
      title.innerText = article.articles[i].title;

      let body = document.createElement('td');
      body.scope = 'row';
      body.innerText = article.articles[i].body;

      let tag = document.createElement('td');
      tag.scope = 'row';
      let tagLen = article.articles[i].tags.length;
      console.log(tagLen);
      for(let j =0;j<tagLen;j++){
        tag.innerText +=  article.articles[i].tags[j].name +' ';
      }
      articleTableBodyRow.append(title,body,tag);
      articleTable.append(articleTableBodyRow);
    }
    
  })
}
appendTable();


