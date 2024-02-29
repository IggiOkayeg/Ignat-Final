document.getElementById('recipeForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const foodInput = document.getElementById('foodInput').value;
    const response = await fetch(`http://localhost:3000/recipes?q=${encodeURIComponent(foodInput)}`);
    const data = await response.json();

    displayResults(data);
  });

  function displayResults(results) {
    const recipeResults = document.getElementById('recipeResults');
    recipeResults.innerHTML = '';

    if (results.length === 0) {
      recipeResults.innerHTML = '<p>No recipes found.</p>';
      return;
    }

    results.forEach(recipe => {
      const recipeCard = document.createElement('div');
      recipeCard.innerHTML = `
        <h2>${recipe.title}</h2>
        <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
        <p><strong>Servings:</strong> ${recipe.servings}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        <hr>
      `;
      recipeResults.appendChild(recipeCard);
    });
  }

  function scrollToForm() {
    var formElement = document.getElementById('xdd');
    formElement.scrollIntoView({ behavior: 'smooth' });
}