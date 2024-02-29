document.getElementById('lowcarbRecipeForm').addEventListener('submit', async function (event) {
  event.preventDefault();

  const lowcarbFoodInput = document.getElementById('lowcarbFoodInput').value;
  
  try {
    const response = await fetch(`http://localhost:3000/lowcarb-recipes?name=${encodeURIComponent(lowcarbFoodInput)}`);
    const data = await response.json();

    if (data.message && data.message.toLowerCase().includes('no results')) {
      displayNoResultsMessage();
    } else {
      displayLowcarbResults(data);
    }
  } catch (error) {
    console.error(error);
    displayErrorMessage();
  }
});

function displayNoResultsMessage() {
  const lowcarbRecipeResults = document.getElementById('lowcarbRecipeResults');
  lowcarbRecipeResults.innerHTML = '<p>No low-carb recipes found.</p>';
}

function displayErrorMessage() {
  const lowcarbRecipeResults = document.getElementById('lowcarbRecipeResults');
  lowcarbRecipeResults.innerHTML = '<p>No low-carb recipes found.</p>';
}

function displayLowcarbResults(results) {
  const lowcarbRecipeResults = document.getElementById('lowcarbRecipeResults');
  lowcarbRecipeResults.innerHTML = '';

  if (results.length === 0) {
    lowcarbRecipeResults.innerHTML = '<p>No low-carb recipes found.</p>';
    return;
  }

  results.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.innerHTML = `
      <h2>${recipe.name}</h2>
      <p><strong>Ingredients:</strong> ${formatIngredients(recipe.ingredients)}</p>
      <p><strong>Servings:</strong> ${recipe.servings}</p>
      <p><strong>Instructions:</strong> ${recipe.steps}</p>
      <hr>
    `;
    lowcarbRecipeResults.appendChild(recipeCard);
  });
}

function formatIngredients(ingredients) {
  return ingredients.map(ingredient => ingredient.name).join(', ');
}

function scrollToForm() {
  var formElement = document.getElementById('xdd');
  formElement.scrollIntoView({ behavior: 'smooth' });
}