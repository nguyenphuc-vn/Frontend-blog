const token = localStorage.getItem('app-token');
if(token ==undefined){
  window.location.href =  "./login.html";
}
let toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["image"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["clean"],
];
const quill = new Quill("#body_input", {
  modules: {
    // Equivalent to { toolbar: { container: '#toolbar' }}
    toolbar: toolbarOptions,
  },
  theme: "snow",
});

let idUrl = location.search == "" ? " " : Number(location.search.substr(1));

async function getData() {
  let res = await fetch("http://localhost:8080/api/article/" + idUrl);
  let result = await res.json();
  console.log(result);
  return result;
}
function fillData() {
  if (Number.isInteger(idUrl)) {
    getData().then((result) => {
      const title = getTitleInput();
      title.value = result.title;
      const content = getContentInput();
      content.innerHTML = result.body;

      let isPublished = getPublished();
      isPublished.checked = result.published;
      const tag = getTagInput();
      for (let i = 0; i < result.tags.length; i++) {
        tag.value += result.tags[i].name;
      }
    });
  }
}
fillData();

const notif = document.createElement("span");
const save = document.getElementById("save-btn");
save.addEventListener("click", (e) => {
  e.preventDefault();
  let title = getTitleInput().value;
  let content = getContentInput().innerHTML;
  let isPublished = getPublished().checked;
  let tag = getTag();
  let id = 0;
  if (Number.isInteger(idUrl)) {
    id = idUrl;
  }
  fetch("http://localhost:8080/api/article/", {
    method: "POST",
    mode: "cors",
    withCredentials: true,
    credentials: 'include',
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      id: id,
      title: title,
      body: content,
      published: isPublished,
      tags: tag,
    }),
  })
    .then((result) => result.text())
    .then((data) => {
      notif.innerHTML = "Saved" + data;
    })
    .catch((error) => {
      notif.innerHTML = "Can't connect to server";
    });
  const notification = document.getElementById("notification").append(notif);
});

function getTag() {
  let tag = getTagInput().value;
  let tagAr = tag.split(`\w`);
  let tags = [];

  for (let i = 0; i < tagAr.length; i++) {
    tags.push({ name: tagAr[i] });
  }
  return tags;
}

function getTitleInput() {
  return document.getElementById("title_input");
}
function getContentInput() {
  let bodyInput = document.getElementById("body_input");
  return bodyInput.children[0];
}
function getPublished() {
  return document.getElementById("checkbox-input");
}
function getTagInput() {
  return document.getElementById("tag_input");
}
