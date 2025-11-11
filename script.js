// --- DOM Elements ---
const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate-btn');
const spinner = document.getElementById('spinner');
const imageGrid = document.getElementById('image-grid');

// The URL for our own proxy function on Netlify
const PROXY_URL = '/.netlify/functions/proxy';

// --- Event Listener ---
generateBtn.addEventListener('click', generateImages);

async function generateImages() {
    const userPrompt = promptInput.value;
    if (!userPrompt) {
        alert('Please enter a prompt!');
        return;
    }

    // --- UI State: Loading ---
    generateBtn.disabled = true;
    spinner.style.display = 'block';
    imageGrid.innerHTML = '';

    try {
        // This is the data structure the Perchance API expects
        const requestBody = {
            prompt: userPrompt + ", digital art, masterpiece, high quality",
            negativePrompt: "blurry, pixelated, ugly, bad anatomy",
            resolution: "768x768",
            numImages: 4, // Perchance generator is fast, let's get 4
            model: "sd15-standard" // The model Perchance uses
        };

        // --- Fetch from our own Proxy ---
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const responseJSON = await response.json();
        
        // --- Display Images ---
        if (responseJSON.outputs && responseJSON.outputs.length > 0) {
            responseJSON.outputs.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.url; // Perchance returns direct URLs
                imageGrid.appendChild(imgElement);
            });
        } else {
             throw new Error('API did not return any images.');
        }

    } catch (error) {
        console.error(error);
        alert('An error occurred: ' + error.message);
    } finally {
        // --- UI State: Finished ---
        generateBtn.disabled = false;
        spinner.style.display = 'none';
    }
}