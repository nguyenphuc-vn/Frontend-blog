const urlHost = "http://localhost:8080";
//const urlHost = "https://personalblog1996.herokuapp.com";

const ul = document.querySelector('.pagination');
const container = document.querySelector('.mx-auto');
const articleLink = './article.html?';
let urlParam = new URLSearchParams();
let current = urlParam.get("page");
//console.log(current);

async function getArticles() {
    let res = await fetch(urlHost+"/api/articles/?" + urlParam);
    let result = await res.json();
    //console.log(result);
    return result;
}

function display() {

    getArticles().then(result => {
        getArticle(result);
        navigate(result);
    })
}
function getArticle(result) {

    let size = result.list.length;
    for (let i = 0; i < size; i++) {
        const card = document.createElement('div');
        card.className = 'card border-light';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        let h3 = document.createElement('h3');
        h3.className = 'card-title';
        h3.innerHTML = result.list[i].title;

        let p = document.createElement('p');
        p.className = 'card-text';
        p.innerHTML = sliceArticle(result.list[i].body);

        let a = document.createElement('a');
        a.className = 'btn btn-primary';
        a.href = articleLink + result.list[i].id;
        a.textContent = 'Read More';

        cardBody.append(h3, p, a);
        card.append(cardBody);
        container.append(card);
    }
}

display();
function navigate(result) {
    let articlePage = result.number + 1;
    let pageItems = document.querySelectorAll('.page-item');
    let pageLinks = document.querySelectorAll('.page-link');

    if (current == null) {
        current = 1;
    }

    checkValidPage(pageItems[0], pageLinks[0], result.prevEnabled, articlePage - 1);
    setActive(pageItems[1], pageLinks[1], articlePage);
    checkValidPage(pageItems[2], pageLinks[2], result.hasNext, articlePage + 1);
}

function setActive(pageItem, pageLink, articlePage) {
    if (current == articlePage) {
        pageItem.className = 'page-item active';
        pageItem.setAttribute('aria-current', 'page');
        pageLink.textContent = current;
    }
}

function checkValidPage(pageItem, pageLink, result, currentPage) {

    if (result) {
        pageItem.className = 'page-item';
        pageLink.href = "javascript:display()";
        pageLink.addEventListener('click', () => {
            current = currentPage;
            setStateAndEmptyPage();
        });
    } else
        pageItem.className = 'page-item disabled';
    pageLink.setAttribute('aria-disabled', true);
    pageLink.setAttribute('tabindex', -1);

}

function setStateAndEmptyPage() {
    urlParam.set('page', current);
    window.history.replaceState('', '', '?' + urlParam.toString());
    container.innerHTML = '';
}
function sliceArticle(body) {
    return body.substr(0, body.indexOf(','));
}
