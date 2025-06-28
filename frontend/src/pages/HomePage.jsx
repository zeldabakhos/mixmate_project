import { useEffect, useState } from "react";
import { fetchIngredients } from "../utils/fetchIngredients.js";
import CardComponent from "../components/CardComponent.jsx";

const HomePage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadIngredients = async () => {
    setLoading(true);
    try {
      const data = await fetchIngredients();
      console.log("Fetched ingredients:", data);
      setIngredients(data);
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
            imageUrl={ingredient.imageUrl || "https://placehold.co/300x200"}
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
