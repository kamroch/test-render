document.getElementById('planner-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const duration = document.getElementById('duration').value;
    const budget = document.getElementById('budget').value;
    const interests = document.getElementById('interests').value;
    const travelers = document.getElementById('travelers').value;

    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('itinerary-result');
    
    loader.style.display = 'block';
    resultDiv.innerHTML = '';

    const systemPrompt = "You are an expert travel planner for Morocco. Create detailed, day-by-day itineraries based on user preferences. Include specific recommendations for places to visit, restaurants, and activities. Format the output with clear headings and bullet points using HTML tags (<h3>, <ul>, <li>, <strong>, <p>) for nice rendering inside a div. Do not use Markdown code blocks, just raw HTML.";
    
    const userPrompt = `Plan a ${duration}-day trip to Morocco for a ${travelers} with a ${budget} budget.
    Interests: ${interests}.
    Please provide a day-by-day itinerary including:
    - Morning, Afternoon, and Evening activities
    - Recommended cities/regions
    - Food recommendations
    - Travel tips for this specific profile`;

    try {
        const response = await fetch('/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                systemPrompt: systemPrompt,
                userPrompt: userPrompt
            })
        });

        const data = await response.json();
        
        loader.style.display = 'none';

        if (data.choices && data.choices.length > 0) {
            const content = data.choices[0].message.content;
            resultDiv.innerHTML = content;
        } else {
            resultDiv.textContent = 'Sorry, we could not generate an itinerary at this time. Please try again.';
            console.error('API Error:', data);
        }
    } catch (error) {
        loader.style.display = 'none';
        resultDiv.textContent = 'An error occurred. Please try again later.';
        console.error('Fetch Error:', error);
    }
});
