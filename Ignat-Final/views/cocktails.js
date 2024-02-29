document.getElementById('cocktailForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const cocktailNameInput = document.getElementById('cocktailName').value;
    const url = `https://the-cocktail-db.p.rapidapi.com/search.php`;

    const options = {
      method: 'GET',
      url,
      params: { s: cocktailNameInput },
      headers: {
        'X-RapidAPI-Key': '98445a03f2msh06b5f9b2fb4a9f1p1bf90ajsn8f0cb9bbf3cd',
        'X-RapidAPI-Host': 'the-cocktail-db.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const data = response.data;
      
      if (data.drinks) {
        displayCocktailResults(data.drinks);
      } else {
        displayNoResults();
      }
    } catch (error) {
      console.error(error);
      displayNoResults();
    }
  });

  function displayCocktailResults(drinks) {
const cocktailResults = document.getElementById('cocktailResults');
cocktailResults.innerHTML = '';

drinks.forEach(cocktail => {
  const cocktailCard = document.createElement('div');
  cocktailCard.innerHTML = `
    <h2>${cocktail.strDrink}</h2>
    <p><strong>Category:</strong> ${cocktail.strCategory}</p>
    <p><strong>Glass:</strong> ${cocktail.strGlass}</p>
    <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
    <p><strong>Ingredients:</strong></p>
    <ul>
      ${getIngredientsList(cocktail)}
    </ul>
    <hr>
  `;
  cocktailResults.appendChild(cocktailCard);
});
}

function getIngredientsList(cocktail) {
let ingredientsList = '';
for (let i = 1; i <= 15; i++) {
  const ingredient = cocktail[`strIngredient${i}`];
  if (ingredient) {
    ingredientsList += `<li>${ingredient}</li>`;
  }
}
return ingredientsList;
}

  function displayNoResults() {
    const cocktailResults = document.getElementById('cocktailResults');
    cocktailResults.innerHTML = '<p>No cocktails found.</p>';
  }

  function scrollToForm() {
    var formElement = document.getElementById('xdd');
    formElement.scrollIntoView({ behavior: 'smooth' });
  }