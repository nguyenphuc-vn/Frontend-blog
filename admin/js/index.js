
let urlParam =  new URLSearchParams();
let current = urlParam.get('page');
const board = document.querySelector('.table');
const boardTBody = board.querySelector('.article-table-body');
const pageLink = document.querySelector('.article-paging');
function showPage(){ 
  getPage().then((result)=>{
    showTable(result);
    showNavigation(result);
  })
}

async function getPage() {
  
  let response = await fetch(`http://localhost:8080/api/articles/?`+urlParam);
  let data = await response.json()
  //console.log(data);
  return data;
}

function showTable(result){
  
  //console.log(board); 
  for(let i=0;i<result.articles.length;i++){
    
    const boardBodyRow = document.createElement('tr');
    boardBodyRow.className = 'boardBodyRow';

    const boardBodyId = document.createElement('td');
    boardBodyId.innerHTML = result.articles[i].id;
    
    const boardBodyTitle = document.createElement('td');
    boardBodyTitle.innerHTML =result.articles[i].title;

    const boardBodyBody = document.createElement('td');
    boardBodyBody.innerHTML = result.articles[i].body;

    const boardBodyTag = document.createElement('td');
    for(let j=0;j<result.articles[i].tags.length;j++){
      boardBodyTag.innerHTML = result.articles[i].tags[j].name;
    }
    boardBodyRow.append(boardBodyId,boardBodyTitle,boardBodyBody,boardBodyTag);
    boardTBody.append(boardBodyRow);
    board.append(boardTBody);
  } 
}
function showNavigation(result){
  
  if(current ==null){
    current =1;
  }
  if(current >1){
    const prevLink = document.createElement('a');
    prevLink.title = 'go to previous page';
    prevLink.href ='javascript:showPage()';
    prevLink.innerText = 'Prev ';
    prevLink.addEventListener('click',()=>{
      current = Number(current-1);
      setStateAndEmptyPage();
    });
    pageLink.append(prevLink);
  }
  if(current<result.totalPages){
    const nextLink = document.createElement('a');

    nextLink.title = 'go to next page';
    nextLink.href ='javascript:showPage()';
    nextLink.innerText = 'Next';
    nextLink.addEventListener('click',()=>{
      current = Number(current+1);      
      setStateAndEmptyPage();
    });
    pageLink.append(nextLink);
  }
}

function setStateAndEmptyPage(){
  urlParam.set('page',current);
  window.history.replaceState('','','?'+urlParam.toString());
  boardTBody.innerHTML ='';
  pageLink.innerHTML ='';
}


showPage();

