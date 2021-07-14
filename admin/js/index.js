const token = localStorage.getItem('app-token');
let urlParam = new URLSearchParams();
let current = urlParam.get("page");
const board = document.querySelector(".table");
const boardTBody = board.querySelector(".article-table-body");
const pageLink = document.querySelector(".article-paging");
const createUpdateHTML = "./create-update.html?";
console.log(token);
if(token ==undefined){
  window.location.href =  "./login.html";
}


function showPage() {
  getPage().then((result) => {
    showTable(result);
    showNavigation(result);
  });
}

async function getPage() {
  let response = await fetch(`http://localhost:8080/api/articles/?` + urlParam);
  let data = await response.json();
  //console.log(data);
  return data;
}

function showTable(result) {
  //console.log(board);
  for (let i = 0; i < result.articles.length; i++) {
    let id = result.articles[i].id;
    const boardBodyRow = document.createElement("tr");
    boardBodyRow.className = "boardBodyRow";

    const boardBodyId = document.createElement("td");
    boardBodyId.innerHTML = id;

    const boardBodyTitle = document.createElement("td");
    boardBodyTitle.innerHTML = result.articles[i].title;

    const boardBodyBody = document.createElement("td");
    boardBodyBody.innerHTML = result.articles[i].body.slice(0, 100) + "<br>...";

    const boardBodyTag = document.createElement("td");
    for (let j = 0; j < result.articles[i].tags.length; j++) {
      boardBodyTag.innerHTML += result.articles[i].tags[j].name + " ";
    }
    const boardAction = document.createElement("td");

    const info = document.createElement("a");
    info.innerHTML = "INFO ";
    info.href = createUpdateHTML + result.articles[i].id;

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
  let res = await fetch("http://localhost:8080/api/article/" + Number(id), {
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
  console.log(result);
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
