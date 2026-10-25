const reply = document.getElementById('reply');
const promptForm = document.getElementById('prompt-form');
const userInput = document.getElementById('user-input');
const queryPromptEl = document.getElementById('query-prompt');
const userPromptsEl = document.getElementById('user-prompts');

let loadedData =[];
if (localStorage.getItem('userPrompts')) {
    loadedData = JSON.parse(localStorage.getItem('userPrompts'));
}
const userPrompts = [...loadedData];

displayAllUserPrompts();

displayQueryPrompt();

promptForm.addEventListener("submit", handleGiftRequest);

async function handleGiftRequest(e) {
    // Prevent default form submission
    if (e) {
        e.preventDefault();
    }
    
    // Get user input, trim whitespace, exit if empty
    const userPrompt = userInput.value.trim();
    promptForm.reset();
    if (!userPrompt && e) return;
    reply.textContent = "Thinking..."
    if (userPrompt) {
        userPrompts.push(userPrompt);
        displayUserPrompt(userPrompt);
        localStorage.setItem('userPrompts', JSON.stringify(userPrompts));
    }

    try {
        // TODO: Step 1 — send fetch request to /api/gift
        const response = await fetch('/api', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userPrompts }),
        })
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Server error")
        }

        // TODO: Step 5 — parse response and extract movieSuggestions
        const { queryPrompt, aiResponse, queryResults, improvedUserPrompt, error } = data;

        if (aiResponse) {
            reply.innerHTML = aiResponse;
        } else if (queryResults) {
            reply.innerHTML = queryResults;
        } 

        if (queryPrompt) {
            queryPromptEl.textContent = `Query prompt: ${queryPrompt}`;
            reply.textContent = '';
            localStorage.setItem('queryPrompt', queryPrompt);
        }
        // Render the result
        // reply.innerHTML = movieSuggestions;
        if (error) {
            reply.textContent = error;
        }
    } catch (error) {
        // Log the error for debugging
        console.error(error);

        // Display friendly error message
        reply.textContent =
            "Sorry, I can't access what I need right now. Please try again in a bit.";
    }
}

function displayUserPrompt(userPrompt) {
    const newPar = document.createElement('div');
    newPar.innerHTML = `<div>${userPrompt}</div><svg data-trash="${userPrompts.length - 1}" class="trash-emoticon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash preview-icon"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;
    userPromptsEl.appendChild(newPar)
}

function displayAllUserPrompts() {
    if (userPrompts.length > 0) {
        let outputHtml = '';
        userPrompts.forEach((userPrompt, index) => {
            outputHtml += `<div><div>${userPrompt}</div><svg data-trash="${index}" class="trash-emoticon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash preview-icon"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></div>`;
        });
        userPromptsEl.innerHTML = outputHtml;
    } else {
        userPromptsEl.textContent = '';
    }
}

userPromptsEl.addEventListener('click', e => {
    console.log(e.target)
    const svgs = userPromptsEl.querySelectorAll('svg');
    if (svgs.length > 0) {
        svgs.forEach(svgEl => {
            if (svgEl.contains(e.target)) {
                const index = JSON.parse(svgEl.dataset.trash);
                userPrompts.splice(index, 1);
                localStorage.setItem('userPrompts', JSON.stringify(userPrompts));
                displayAllUserPrompts();
                handleGiftRequest();
                return;
            }
        })
    }
});

function displayQueryPrompt() {
    if (localStorage.getItem('queryPrompt')) {
        queryPromptEl.textContent = `${userPrompts.join(',')}Query prompt: ${localStorage.getItem('queryPrompt')}`;
    }
}

document.getElementById('restart').addEventListener('click', e => {
    localStorage.clear();
    reply.textContent = '';
    queryPromptEl.textContent = '';
    userPromptsEl.textContent = '';
})
