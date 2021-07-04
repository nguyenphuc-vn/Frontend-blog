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

//console.log(body);


let save = document.getElementById('save-btn');
 save.addEventListener('click', (e)=>{
  e.preventDefault();
  let title = document.getElementById('title_input').value;
  let tag = getTag();
  let bodyInput = document.getElementById("body_input");
  let content = bodyInput.children[0].innerHTML;

   fetch('http://localhost:8080/api/article/create',{
    method: 'POST',
    mode: "cors",
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin" : "*", 
      "Access-Control-Allow-Credentials" : true 
    },
    body: JSON.stringify({
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