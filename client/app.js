require('dotenv').config();
const apiKey = process.env.API_KEY;

const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');

const defaultSource = 'the-washington-post';

const publicVapidKey = 'BMUACjClEvgSrJCs_TOagOb7Jafi_jl9CfiowWl_4wTGcoWs_y8Dmhe5N8eVIrNhkQYl2P3QyIa2Smrgml7Mwmo'

window.addEventListener('load', async e => {
    updateNews();
    await updateSources();

    sourceSelector.value = defaultSource;

    sourceSelector.addEventListener('change', e => {
        updateNews(e.target.value);
    });

    if('serviceWorker' in navigator){
        try {
          const register = await navigator.serviceWorker.register('sw.js');
          console.log('A serviceworker has been registered');

          const subscription = await register.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
          });
          console.log('Push registered');

          await fetch('/subscribe', {
              method: 'POST',
              body: JSON.stringify(subscription),
              headers: {
                  'content-type': 'application/json'
              }
          });
          console.log('Push sent');
        } catch (error) {
          console.log('Registration failed');
        }
    }

    function urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
          .replace(/-/g, '+')
          .replace(/_/g, '/');
      
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
      
        for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      }
});

async function updateSources(){
    const res = await fetch('https://newsapi.org/v1/sources');
    const json = await res.json();

    sourceSelector.innerHTML = json.sources
        .map(src => `<option value="${src.id}">${src.name}</option>`)
        .join('\n');
}

async function updateNews(source = defaultSource){
    const res = await fetch(`https://newsapi.org/v1/articles?source=${source}&apiKey=${apiKey}`);
    const json = await res.json();

    main.innerHTML = json.articles.map(createArticle).join('\n');
}

function createArticle(article){
    return `
        <div class="article">
            <a href="${article.url}">
                <h2>${article.title}</h2>
                <img src="${article.urlToImage}">
                <p>${article.description}</p>
            </a>
        </div>
    `;
}



