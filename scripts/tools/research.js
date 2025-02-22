const papers_container = document.querySelector('.papers_container');
const loadContainer = document.getElementById('loadContainer')
const input = document.getElementById('input');

const curPage = document.getElementById('curPage')
const left = document.querySelector('.left');
const right = document.querySelector('.right');

let papersList = [];
let displayedTitles = new Set();
let curIndex = 0;

let arxivPage = 0; 
let corePage = 0;
let doajPage = 1; 
let openAIREPage = 1;

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && input.value !== '') {
        loadContainer.style.display = 'flex'
        papers_container.style.display = 'none'
        curPage.innerText = 1

        papersList = [];
        displayedTitles.clear();
        curIndex = 0;

        arxivPage = 0; 
        corePage = 0;
        doajPage = 1;  
        openAIREPage = 1;

        papers_container.innerHTML = ``;

        callSources(input.value);
        displaySources();
    }
});

left.addEventListener('click', function() {
    loadContainer.style.display = 'flex'
    papers_container.style.display = 'none'

    let currentPage = parseInt(curPage.innerText); 
    currentPage = Math.max(1, currentPage - 1);
    curPage.innerText = currentPage;
    curIndex = (currentPage - 1) * 10;

    displayPapers();
});

right.addEventListener('click', function() {
    loadContainer.style.display = 'flex'
    papers_container.style.display = 'none'

    let currentPage = parseInt(curPage.innerText);
    currentPage = currentPage + 1;
    curPage.innerText = currentPage;
    curIndex = (currentPage - 1) * 10;

    if(curIndex >= papersList.length){
        arxivPage += 10; 
        corePage += 10;
        doajPage += 1;  
        openAIREPage += 1
        
        callSources(input.value)
    } else {
        displayPapers();
    }
});

async function callSources(value) {
    await Promise.all([
        fetchOpenAIREPapers(value),
        fetchArxivPapers(value),
        fetchDOAJPapers(value),
        fetchCorePapers(value)
    ]);
    displayPapers();
}

async function fetchArxivPapers(topic) {
    try {
        const response = await fetch(
            `https://export.arxiv.org/api/query?search_query=title:${topic}&start=${arxivPage}&max_results=10&sortBy=relevance`
        );
        const data = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "application/xml");
        const entries = xmlDoc.getElementsByTagName("entry");
    
        Array.from(entries).forEach(entry => {
            const doi = entry.getElementsByTagName("id")[0].textContent.split('/').pop();
            const title = entry.getElementsByTagName("title")[0].textContent;
            const authors = Array.from(entry.getElementsByTagName("author"))
                .map(author => author.getElementsByTagName("name")[0].textContent)
                .join(", ");
            const summary = entry.getElementsByTagName("summary")[0]?.textContent.trim() || "No Description";
            const publishedDate = entry.getElementsByTagName("published")[0].textContent;
            const year = new Date(publishedDate).getFullYear();
            
            const link = doi.includes("/") ? `https://doi.org/${doi}` : `https://arxiv.org/abs/${doi}`;
    
            papersList.push({ title, authors, doi, year, summary, link });
        });
    } catch (error) {
        console.log(error);
    }
}

async function fetchDOAJPapers(topic) {
    const baseURL = 'https://doaj.org/api/v2/search/articles/';
    const apiKey = `${settings.doaj.apiKey}`;

    try {
        const response = await fetch(`${baseURL}${topic}?api_key=${apiKey}&pageSize=10&page=${doajPage}`);
        const data = await response.json();
        data.results.forEach(result => {
            papersList.push({
                title: result.bibjson.title,
                authors: result.bibjson.author.map(element => element.name).join(", "),
                link: result.bibjson.link[0].url,
                year: result.bibjson.year,
                summary: result.bibjson.abstract || "No Description Available",
            });
        });        
    } catch (error) {
        console.log(error);
    }
}

async function fetchOpenAIREPapers(topic) {
    const baseURL = 'https://api.openaire.eu/search/publications';
    try {
        const response = await fetch(`${baseURL}?title=${topic}&format=json&page=${openAIREPage}`);
        const data = await response.json();
        const results = data.response?.results?.result;
        const resultsArray = Array.isArray(results) ? results : [results];

        resultsArray.forEach((result) => {
            const info = result.metadata?.["oaf:entity"]?.["oaf:result"];
            const creators = Array.isArray(info.creator) ? info.creator : [info.creator];
            papersList.push({
                title: info.title.$ || info.title[0].$,
                authors: creators.map(element => element["$"]).join(", "),
                link: info.children?.instance?.[1]?.webresource?.url.$,
                year: info.relevantdate?.$ ? info.relevantdate.$.slice(0, 4) : (Array.isArray(info.relevantdate) && info.relevantdate[0]?.$ ? info.relevantdate[0].$.slice(0, 4) : "Unknown Year"),
                summary: info.description?.$ || "No Description Available",
            });    
        });
    } catch (error) {
        console.log(error);
    }
}

async function fetchCorePapers(topic) {
    const url = 'https://api.core.ac.uk/v3/search/works/';
    const apiKey = `${settings.core.apiKey}`;
    const params = new URLSearchParams({ q: topic, corePage });
    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(`${url}?${params.toString()}`, { headers });

        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        const data = await response.json();
        results = data.results;
    } catch (error) {
        return { error: error.message };
    }

    results.forEach((result) => {
        const authors = result.authors.map(author => author.name.replace(/,/g, '')).join(", ");
        papersList.push({
            title: result.title,
            authors: authors,
            link: result.links[1],
            year: result.yearPublished,
            summary: result.abstract || "No Description Available"
        });
    });    
}

function displaySources() {
    const box = document.querySelector('.box');
    const filler = document.querySelector('.filler')

    box.style.display = 'none';
    filler.style.display = 'flex';
}

function displayPapers() {
    loadContainer.style.display = 'none'
    papers_container.style.display = 'flex'
    papers_container.innerHTML = "";
    const displayedPapers = papersList.slice(curIndex, curIndex + 10); 

    displayedPapers.forEach(paper => {
        const source = document.createElement("div");
        source.classList.add("source");
        source.innerHTML = `
            <div class="source_info">
                <div class="row">
                    <div class="label">Title</div>
                    <div class="text">
                        <a href="${paper.link}" target="_blank">${paper.title}</a>
                    </div>
                </div><hr>
                <div class="row">
                    <div class="label">Authors</div>
                    <div class="text">${paper.authors}</div>
                </div><hr>
                <div class="row">
                    <div class="label">Year</div>
                    <div class="text">${paper.year}</div>
                </div><hr>
                <div class="row">
                    <div class="label">Description</div>
                    <div class="text">${paper.summary}</div>
                </div>
            </div>
        `;
        papers_container.appendChild(source);
    });
}