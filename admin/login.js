//const urlHost = "http://localhost:8080";
const urlHost = "https://personalblog1996.herokuapp.com";
const url = urlHost+"/api/auth/login";
const submit = document.getElementById("submit-btn");
let header = new Headers();

submit.addEventListener("click", (e) => {
  e.preventDefault();
  auth();
});

async function auth() {
  let username = document.getElementById("username-input").value;
  //console.log(username);
  let password = document.getElementById("password-input").value;
  //console.log(password);
  let response = await fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: "Basic " + btoa("username:password"),
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  let token = await response.json();
  
  if(response.status == 200){
    localStorage.setItem('app-token', token.jwt);
    window.location.href =  "./index.html";
  }
  
}


