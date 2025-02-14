const box = document.querySelector('.box');
const filler = document.querySelector('.filler')
const papers_container = document.querySelector('.papers_container');
const input = document.getElementById('input');

const curPage = document.getElementById('curPage')
const left = document.querySelector('.left');
const right = document.querySelector('.right');

let arxivPage = 0; 
let corePage = 0;
let doajPage = 1; 
let openAIREPage = 1;

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && input.value !== '') {
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
    let currentPage = parseInt(curPage.innerText); 
    currentPage = Math.max(1, currentPage - 1);
    curPage.innerText = currentPage;

    if (arxivPage > 0) arxivPage -= 10; 
    if (corePage > 0) corePage -= 10; 
    if (doajPage > 1) doajPage -= 1;
    if (openAIREPage > 1) openAIREPage -= 1;

    if(arxivPage != 0 || doajPage != 1 || openAIREPage != 1){
        papers_container.innerHTML = ``;
        
        callSources(input.value);
    }
});

right.addEventListener('click', function() {
    let currentPage = parseInt(curPage.innerText);
    currentPage = currentPage + 1;
    curPage.innerText = currentPage;

    arxivPage += 10; 
    corePage += 10;
    doajPage += 1;  
    openAIREPage += 1

    papers_container.innerHTML = ``;

    callSources(input.value);
});

function callSources(value){
    fetchOpenAIREPapers(value);
    fetchArxivPapers(value);
    fetchDOAJPapers(value);
    fetchCorePapers(value);
}

function displaySources() {
    box.style.display = 'none';
    filler.style.display = 'flex';
}

async function fetchArxivPapers(topic) {
    try {
        const response = await fetch(
            `https://export.arxiv.org/api/query?search_query=title:${topic}&start=${arxivPage}&max_results=10&sortBy=relevance`
        );
        const data = await response.text();
        const papers = parseArxivXMLResponse(data);
        displayPapers(papers);
    } catch (error) {
        console.log(error);
    }
}

function parseArxivXMLResponse(data) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");
    const entries = xmlDoc.getElementsByTagName("entry");
    const papers = [];

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

        papers.push({ title, authors, doi, year, summary, link });
    });

    return papers;
}

async function fetchDOAJPapers(topic) {
    const baseURL = 'https://doaj.org/api/v2/search/articles/';
    const apiKey = `${settings.doaj.apiKey}`;

    try {
        const response = await fetch(`${baseURL}${topic}?api_key=${apiKey}&pageSize=10&page=${doajPage}`);
        const data = await response.json();
        const papers = data.results.map(result => ({
            title: result.bibjson.title,
            authors: result.bibjson.author.map(element => element.name).join(", "),
            link: result.bibjson.link[0].url,
            year: result.bibjson.year,
            summary: result.bibjson.abstract,
        }));
        displayPapers(papers);
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

        if (!results) {
            console.log("No results found.");
            return;
        }

        const papers = [];
        const resultsArray = Array.isArray(results) ? results : [results];

        resultsArray.forEach((result) => {
            const info = result.metadata?.["oaf:entity"]?.["oaf:result"];
            const creators = Array.isArray(info.creator) ? info.creator : [info.creator];
            papers.push({
                title: info.title.$ || info.title[0].$,
                authors: creators.map(element => element["$"]).join(", "),
                link: info.children?.instance?.[1]?.webresource?.url.$,
                year: info.relevantdate?.$ ? info.relevantdate.$.slice(0, 4) : (Array.isArray(info.relevantdate) && info.relevantdate[0]?.$ ? info.relevantdate[0].$.slice(0, 4) : "Unknown Year"),
                summary: info.description?.$ || "No Description Available",
            });    
        });
        displayPapers(papers);
    } catch (error) {
        console.log(error);
    }
}

async function fetchCorePapers(topic) {
    const url = 'https://api.core.ac.uk/v3/search/works/';
    const apiKey = `${settings.core.apiKey}`;

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };

    const params = new URLSearchParams({ q: topic, corePage });

    try {
        const response = await fetch(`${url}?${params.toString()}`, { headers });

        if (!response.ok) {
            throw new Error(`${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return { error: error.message };
    }
}

function displayPapers(papers) {
    papers.forEach(paper => {
        const source = `
        <div id="source">
            <div class="source_info">
                <div class="row">
                    <div class="label">Title</div>
                    <div class="text">
                        <a href="${paper.link}" target="_blank">
                            ${paper.title}
                        </a>
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
        </div>`;
        papers_container.insertAdjacentHTML('beforeend', source);
    });
}