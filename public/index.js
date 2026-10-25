const reply = document.getElementById('reply');
const promptForm = document.getElementById('prompt-form');
const userInput = document.getElementById('user-input');
const queryPromptEl = document.getElementById('query-prompt');
const userPromptsEl = document.getElementById('user-prompts');

const userPrompts = [];
let current

promptForm.addEventListener("submit", handleGiftRequest);

async function handleGiftRequest(e) {
    // Prevent default form submission
    e.preventDefault();
    reply.textContent = "Thinking..."

    // Get user input, trim whitespace, exit if empty
    const userPrompt = userInput.value.trim();
    promptForm.reset();
    if (!userPrompt) return;
    userPrompts.push(userPrompt);
    displayUserPrompt(userPrompt);


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
    const newPar = document.createElement('p');
    newPar.textContent = userPrompt;
    userPromptsEl.appendChild(newPar)
}
