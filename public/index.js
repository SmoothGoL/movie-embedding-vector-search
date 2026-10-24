const reply = document.querySelector('.reply');
const promptForm = document.getElementById('prompt-form');
const userInput = document.getElementById('user-input');

promptForm.addEventListener("submit", handleGiftRequest);
await fetch('/api/new')

async function handleGiftRequest(e) {
  // Prevent default form submission
  e.preventDefault();
  reply.textContent = "Thinking..."

  // Get user input, trim whitespace, exit if empty
  const userPrompt = userInput.value.trim();
  promptForm.reset();
  if (!userPrompt) return;

  try {
    // TODO: Step 1 — send fetch request to /api/gift
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userPrompt }),
    })
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Server error")
    }
    
    // TODO: Step 5 — parse response and extract movieSuggestions
    const movieSuggestions = data.content;

    // Render the result
    reply.innerHTML = movieSuggestions;
  } catch (error) {
    // Log the error for debugging
    console.error(error);

    // Display friendly error message
    reply.textContent =
      "Sorry, I can't access what I need right now. Please try again in a bit.";
  }
}
