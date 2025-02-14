const suggestionContainer = document.getElementById('suggestion_container');
const statisticsContainer = document.getElementById('statistics_container');

const suggestions = document.querySelector('.suggestions');
const statistics = document.querySelector('.statistics');

const boxes = document.querySelectorAll('.box');
const input = document.getElementById('input');

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && input.value !== '') {
        event.preventDefault();
        callTextGear(input.value);
    }
});

boxes.forEach((box) => {
    box.addEventListener('click', function (event) {
        const clickedElement = event.target.closest('.suggestions, .statistics');

        if (clickedElement) {
            suggestions.classList.remove('active', 'inactive');
            statistics.classList.remove('active', 'inactive');

            if (clickedElement === suggestions) {
                suggestions.classList.add('active');
                statistics.classList.add('inactive');
                suggestionContainer.style.display = 'block';
                statisticsContainer.style.display = 'none';
            } else if (clickedElement === statistics) {
                statistics.classList.add('active');
                suggestions.classList.add('inactive');
                statisticsContainer.style.display = 'block';
                suggestionContainer.style.display = 'none';
            }
        }
    });
});

async function callTextGear(text) {
    const apiKey = `${settings.textGear.apiKey}`;
    const url = `https://api.textgears.com/analyze?key=${apiKey}&text=${encodeURIComponent(text)}&language=en-GB`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        suggestionContainer.innerHTML = '';
        statisticsContainer.innerHTML = '';

        const grammarErrors = data.response?.grammar?.errors || [];
        if (grammarErrors.length > 0) {
            grammarErrors.forEach(error => {
                addSuggestion(error.type, error.bad, error.better, error.offset, error.length, error.description);
            });
        } else {
            const cardHTML = `
            <div class="suggestion">
                <div class="row">
                    <div class="label">Type</div>
                    <div class="text">Errors Will Be Shown Here</div>
                </div><hr>
                <div class="row">
                    <div class="label">Phrase</div>
                    <div class="text">The Part of the Passage That Has Error</div>
                </div><hr>
                <div class="row">
                    <div class="label">Suggestions</div>
                    <div class="text">Possible Fixes For the Potential Error</div>
                </div>
            </div>
        `;
        suggestionContainer.insertAdjacentHTML('beforeend', cardHTML);
        }
        if (data.response.stats) {
            const stats = data.response.stats;
            addStatistic(
                stats.fleschKincaid?.readingEase || 'N/A',
                stats.fleschKincaid?.grade || 'N/A',
                stats.fleschKincaid?.interpretation || 'N/A',
                stats.gunningFog || 'N/A',
                stats.colemanLiau || 'N/A',
                stats.SMOG || 'N/A',
            );
        }
    } catch (err) {
        console.error(err);
    }
}

function addSuggestion(type, phrase, suggestions, offset, length) {
    const cardHTML = `
        <div class="suggestion">
            <div class="row">
                <div class="label">Type</div>
                <div class="text">${type}</div>
            </div><hr>
            <div class="row">
                <div class="label">Phrase</div>
                <div class="text">${phrase}</div>
            </div><hr>
            <div class="row">
                <div class="label">Suggestions</div>
                <div class="text">${suggestions.join(', ')}</div>
            </div><hr>
            <div class="row judge">
                <div class="label approve" data-offset="${offset}" data-length="${length}" data-suggestion="${suggestions[0]}">
                    <i class="fa-regular fa-thumbs-up"></i>
                </div>
                <div class="label reject">
                    <i class="fa-regular fa-thumbs-down"></i>
                </div>
            </div>
        </div>
    `;
    suggestionContainer.insertAdjacentHTML('beforeend', cardHTML);

    const lastCard = suggestionContainer.lastElementChild;
    const approveButton = lastCard.querySelector('.approve');
    const rejectButton = lastCard.querySelector('.reject');

    approveButton.addEventListener('click', () => {
        const offset = parseInt(approveButton.dataset.offset);
        const length = parseInt(approveButton.dataset.length);
        const suggestion = approveButton.dataset.suggestion;

        replacePhrase(offset, length, suggestion);
        adjustIndices(offset, length, suggestion.length);

        lastCard.remove();
    });

    rejectButton.addEventListener('click', () => {
        lastCard.remove();
    });
}

function replacePhrase(offset, length, suggestion) {
    const text = input.value;
    const before = text.slice(0, offset);
    const after = text.slice(offset + length);
    input.value = before + suggestion + after; 
}

function adjustIndices(offset, length, newLength) {
    const suggestions = document.querySelectorAll('.suggestion');

    suggestions.forEach((suggestion) => {
        const approveButton = suggestion.querySelector('.approve');
        let currentOffset = parseInt(approveButton.dataset.offset);

        if (currentOffset > offset) {
            currentOffset = currentOffset - length + newLength; 
            approveButton.dataset.offset = currentOffset;
        }
    });
}

function addStatistic(fleschReadingEase, fleschGrade, fleschInterpretation, gunningFog, colemanLiau, SMOG) {
    const text = input.value;
    const characters = text.length;
    const words = text.split(/\s+/).filter(Boolean).length; 
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;

    const counterCard = `
    <div class="statistic">
        <div class="row">
            <div class="label">Characters</div>
            <div class="text">${characters}</div>
        </div><hr>
        <div class="row">
            <div class="label">Words</div>
            <div class="text">${words}</div>
        </div><hr>
        <div class="row">
            <div class="label">Sentences</div>
            <div class="text">${sentences}</div>
        </div>
    </div>`;
    statisticsContainer.insertAdjacentHTML('beforeend', counterCard);

    const fleschCard = `
    <div class="statistic">
        <div class="row">
            <div class="label">Reading Ease</div>
            <div class="text">${fleschReadingEase}</div>
        </div><hr>
        <div class="row">
            <div class="label">Grade Level</div>
            <div class="text">${fleschGrade}</div>
        </div><hr>
        <div class="row">
            <div class="label">Interpretation</div>
            <div class="text">${fleschInterpretation}</div>
        </div>
    </div>`;
    statisticsContainer.insertAdjacentHTML('beforeend', fleschCard);
        
    const readabilityCard = `
    <div class="statistic">
        <div class="row">
            <div class="label">Gunning Fog Index</div>
            <div class="text">${gunningFog}</div>
        </div><hr>
        <div class="row">
            <div class="label">Coleman–Liau Index</div>
            <div class="text">${colemanLiau}</div>
        </div><hr>
        <div class="row">
            <div class="label">SMOG</div>
            <div class="text">${SMOG}</div>
        </div>
    </div>`;
    statisticsContainer.insertAdjacentHTML('beforeend', readabilityCard);
}