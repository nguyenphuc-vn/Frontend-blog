const url = "http://localhost:8080/api/auth/login";
const submit = document.getElementById("submit-btn");
let header = new Headers();

submit.addEventListener("click", (e) => {
  e.preventDefault();
  auth();
});

async function auth(e) {
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
    /* let  jwt = JSON.parse(atob(token.split('.')[1]));
    
    let iat  = new Date(jwt.iat *1000);
    let exp = new Date(jwt.exp *1000);
    console.log(iat);
    console.log(exp);
    console.log(jwt); */
  }
  
}
