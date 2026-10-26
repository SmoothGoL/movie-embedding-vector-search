const reply = document.getElementById('reply');
const promptForm = document.getElementById('prompt-form');
const userInput = document.getElementById('user-input');
const queryPromptEl = document.getElementById('query-prompt');
const userPromptsEl = document.getElementById('user-prompts');

let loadedData = [];
try {
    const stored = localStorage.getItem('userPrompts');
    if (stored) loadedData = JSON.parse(stored);
} catch (e) {
    console.error("Error parsing local storage data.", e);
}
const userPrompts = [...loadedData];

// SVG extracted for cleaner template reuse
const trashIconSVG = `<svg class="trash-emoticon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;

displayAllUserPrompts();
displayQueryPrompt();

promptForm.addEventListener("submit", handleGiftRequest);

async function handleGiftRequest(e) {
    if (e) e.preventDefault();
    
    const userPrompt = userInput.value.trim();
    promptForm.reset();
    
    if (!userPrompt && userPrompts.length === 0) return;
    
    reply.textContent = "Thinking...";
    
    if (userPrompt) {
        userPrompts.push(userPrompt);
        displayAllUserPrompts(); // Re-render the whole list to guarantee accurate trash indices
        localStorage.setItem('userPrompts', JSON.stringify(userPrompts));
    }

    try {
        const response = await fetch('/api', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userPrompts }),
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || "Server error");
        }

        const { queryPrompt, aiResponse, queryResults, error } = data;

        // index.js
        if (error) {
            reply.textContent = error;
            return;
        }

        reply.textContent = ''; // Clear "Thinking..." as soon as a valid response arrives

        if (aiResponse) {
            reply.innerHTML = aiResponse;
        } else if (queryResults) {
            reply.innerHTML = queryResults;
        }

        if (queryPrompt !== undefined && queryPrompt !== null) {
            queryPromptEl.textContent = queryPrompt ? `Query prompt: ${queryPrompt}` : 'No constraints detected.';
            localStorage.setItem('queryPrompt', queryPrompt);
        }
    } catch (error) {
        console.error(error);
        reply.textContent = "Sorry, I can't access what I need right now. Please try again in a bit.";
    }
}

function displayAllUserPrompts() {
    userPromptsEl.innerHTML = ''; 
    
    if (userPrompts.length > 0) {
        userPrompts.forEach((userPrompt, index) => {
            const wrapper = document.createElement('div');
            
            const textDiv = document.createElement('div');
            textDiv.textContent = userPrompt; // Text content prevents XSS
            
            const iconWrapper = document.createElement('div');
            iconWrapper.innerHTML = trashIconSVG;
            iconWrapper.firstChild.dataset.trash = index; // Apply index directly to the SVG

            wrapper.appendChild(textDiv);
            wrapper.appendChild(iconWrapper.firstChild);
            userPromptsEl.appendChild(wrapper);
        });
    } else {
        queryPromptEl.textContent = '';
        localStorage.removeItem('userPrompts');
    }
}

// Replaced rigid loop with event delegation via .closest()
userPromptsEl.addEventListener('click', e => {
    const trashBtn = e.target.closest('.trash-emoticon');
    if (trashBtn) {
        const index = parseInt(trashBtn.dataset.trash, 10);
        userPrompts.splice(index, 1);
        
        localStorage.setItem('userPrompts', JSON.stringify(userPrompts));
        displayAllUserPrompts();
        
        localStorage.removeItem('queryPrompt');
        displayQueryPrompt();
    }
});

function displayQueryPrompt() {
    const savedPrompt = localStorage.getItem('queryPrompt');
    queryPromptEl.textContent = savedPrompt ? `Query prompt: ${savedPrompt}` : '';
}

document.getElementById('restart').addEventListener('click', () => {
    localStorage.clear();
    userPrompts.length = 0; // Flush array memory so old inputs don't return on next submit
    reply.textContent = '';
    queryPromptEl.textContent = '';
    userPromptsEl.textContent = '';
});
