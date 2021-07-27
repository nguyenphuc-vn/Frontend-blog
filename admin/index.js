const token = localStorage.getItem('app-token');
if(token ==undefined|| token =='' || token ==null){
  window.location.href =  "./login.html";
}
//const urlHost = "http://localhost:8080";
const urlHost = "https://personalblog1996.herokuapp.com";

let urlParam = new URLSearchParams();
let current = urlParam.get("page");
const board = document.querySelector(".table");
const boardTBody = board.querySelector(".article-table-body");
const pageLink = document.querySelector(".article-paging");
const createUpdateHTML = "./create-update.html?";
//console.log(token);



function showPage() {
  getPage().then((result) => {
    showTable(result);
    showNavigation(result);
  });
}

async function getPage() {
  let response = await fetch(urlHost+`/api/articles/?` + urlParam);
  let data = await response.json();
  //console.log(data);
  return data;
}

function showTable(result) {
  //console.log(board);
  for (let i = 0; i < result.list.length; i++) {
    let id = result.list[i].id;
    const boardBodyRow = document.createElement("tr");
    boardBodyRow.className = "boardBodyRow";

    const boardBodyId = document.createElement("td");
    boardBodyId.innerHTML = id;

    const boardBodyTitle = document.createElement("td");
    boardBodyTitle.innerHTML = result.list[i].title;

    const boardBodyBody = document.createElement("td");
    boardBodyBody.innerHTML = result.list[i].body.slice(0, 100) + "<br>...";

    const boardBodyTag = document.createElement("td");
    for (let j = 0; j < result.list[i].tags.length; j++) {
      boardBodyTag.innerHTML += result.list[i].tags[j].name + " ";
    }
    const boardAction = document.createElement("td");

    const info = document.createElement("a");
    info.innerHTML = "INFO ";
    info.href = createUpdateHTML + result.list[i].id;

    const deleteAction = document.createElement("a");
    deleteAction.innerHTML = " DELETE";
    deleteAction.href = "javascript:deleteArticle(" + id + ")";
    deleteAction.onclick = isConfirm;

    boardAction.append(info, deleteAction);
    boardBodyRow.append(
      boardBodyId,
      boardBodyTitle,
      boardBodyBody,
      boardBodyTag,
      boardAction
    );
    boardTBody.append(boardBodyRow);
    board.append(boardTBody);
  }
}
async function deleteArticle(id) {
  let res = await fetch(urlHost+"/api/article/" + Number(id), {
    method: "DELETE",
    mode: "cors",
    withCredentials: true,
    credentials: 'include',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      'Authorization': `Bearer ${token}`
    },
  });
  let result = await res.text();
  //console.log(result);
  location.reload();
}
function showNavigation(result) {
  if (current == null) {
    current = 1;
  }
  if (result.prevEnabled) {
    const prevLink = document.createElement("a");
    prevLink.title = "go to previous page";
    prevLink.href = "javascript:showPage()";
    prevLink.innerText = "Prev ";
    prevLink.addEventListener("click", () => {
      current = Number(current - 1);
      setStateAndEmptyPage();
    });
    pageLink.append(prevLink);
  }
  if (current < result.totalPages) {
    const nextLink = document.createElement("a");

    nextLink.title = "go to next page";
    nextLink.href = "javascript:showPage()";
    nextLink.innerText = "Next";
    nextLink.addEventListener("click", () => {
      current = Number(current + 1);
      setStateAndEmptyPage();
    });
    pageLink.append(nextLink);
  }
}

function setStateAndEmptyPage() {
  urlParam.set("page", current);
  window.history.replaceState("", "", "?" + urlParam.toString());
  boardTBody.innerHTML = "";
  pageLink.innerHTML = "";
}
function isConfirm() {
  return confirm("Are you sure you want to delete this item?");
}

showPage();
function logout(){
  localStorage.setItem('app-token','');
  window.location.href =  "./login.html";
}