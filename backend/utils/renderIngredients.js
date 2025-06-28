export const renderIngredients = (ingredients) => {
    const dataText = ingredients.map((ingredient) => {
      return articleElement(ingredient);
    });
  
    const fragment = document.createDocumentFragment();
    for (const element of dataText) {
      fragment.appendChild(element);
    }
  
    const container = document.querySelector("#app");
    container.innerHTML = "";
    container.appendChild(fragment);
  };
  