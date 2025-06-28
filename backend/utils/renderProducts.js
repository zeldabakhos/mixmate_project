export const renderProducts = (products) => {
    const dataText = products.map((product) => {
      return articleElement(product);
    });
  
    const fragment = document.createDocumentFragment();
    for (const element of dataText) {
      fragment.appendChild(element);
    }
  
    const container = document.querySelector("#app");
    container.innerHTML = "";
    container.appendChild(fragment);
  };
  