import { useEffect, useState } from "react";
import CardComponent from "../components/CardComponent.jsx";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const HomePage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadIngredients = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list");
      const data = await response.json();

      // Transform ingredients to expected format for CardComponent
      const formatted = data.drinks.map((item, index) => ({
        _id: `public-${index}`, // fake ID for frontend only
        name: item.strIngredient1,
        description: `Common cocktail ingredient.`,
        unit: "unit",
        quantity: 1,
        imageUrl: `https://www.thecocktaildb.com/images/ingredients/${item.strIngredient1}-Medium.png`
      }));

      setIngredients(formatted);
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
      {ingredients.length > 0 ? (
        ingredients.map((ingredient) => (
          <CardComponent
            key={ingredient._id}
            ingredient={ingredient}
            title={ingredient.name}
            description={ingredient.description}
            unit={ingredient.unit}
            quantity={ingredient.quantity}
            imageUrl={ingredient.imageUrl}
            showAddToFridgeButton={true}
          />
        ))
      ) : (
        <p className="text-center">No ingredients found.</p>
      )}
    </section>
  );
};

export default HomePage;
