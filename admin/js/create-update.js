let toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['image'],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],     
  [{ 'align': [] }],
  ['clean']
];
const quill = new Quill('#body_input',{
  modules: {
    // Equivalent to { toolbar: { container: '#toolbar' }}
    toolbar: toolbarOptions
  },
  theme : 'snow'
});


let bodyInput = document.getElementById("body_input");
let idUrl = Number(location.search.substr(1));
console.log(idUrl);
 
async function getData(){   
    let res = await fetch('http://localhost:8080/api/article/'+idUrl);
    let result = await res.json();
    console.log(result);
    return result;
}
 function fillData(){  
   if(Number.isInteger(idUrl)){
    getData().then((result)=>{
      const title = document.getElementById('title_input');
      title.value = result.title;
      console.log(title.value);
      const content = bodyInput.children[0];
      content.innerHTML = result.body;
      const tag = document.getElementById('tag_input');
      for(let i=0;i<result.tags.length;i++){
        tag.value += result.tags[i].name;
      }
    })
 }
}
fillData();

 const save = document.getElementById('save-btn');
 save.addEventListener('click', (e)=>{
  e.preventDefault();
  let title = document.getElementById('title_input').value;
  let content = bodyInput.children[0].innerHTML;
  let tag = getTag();
  let id = 0;
  if(Number.isInteger(idUrl)){
    id = idUrl;
  }
   fetch('http://localhost:8080/api/article/create',{
    method: 'POST',
    mode: "cors",
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin" : "*", 
    },
    body: JSON.stringify({
      id:id,
      title: title,
      body: content,
      tags: tag
    }),
  })
  .then( result =>  result.text())
  .then(data => {
    console.log('Success:', data);   
  })
  .catch((error) => {
    console.error('Error:', error);
  });
})
function getTag(){
 let tag = document.getElementById('tag_input').value; 
 let tagAr = tag.split(',');
 let tags = [];

 for(let i =0;i<tagAr.length;i++){
    tags.push({'name':tagAr[i]});
 }
 return tags;
}