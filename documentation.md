# MixMate – Multi-Database Drink Recommendation App
Team members: Assile Zedian, Zelda Bakhos, Galip Ata Hamdan

## Project Idea

Mixmate is a web-based application that allows users to:

* Add ingredients to their virtual fridge,
* Discover what drinks they can make based on those ingredients,
* Receive real-time notifications when new drinks become possible.

The project integrates three distinct types of databases MongoDB, Neo4j, and Redis.

## Database Use Cases

### 1. MongoDB – Document-Oriented Storage

We used MongoDB to manage:

Users: Authentication and identity.

Fridge: Each user's inventory of ingredients (linked by ObjectId).

Ingredients and Drinks: Initially pulled from an external API and stored as collections for fast access.

Drinks and ingredients are fetched via HTTP from TheCocktailDB and inserted into MongoDB using Mongoose schemas:

Ingredients include: name, imageUrl, unit, description

Drinks include: name, description, category, and an array of ingredients

#### Aggregation Pipelines

**Aggregation 1 – Calculating Ingredient Popularity**

Fridge.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items.ingredientId", total: { $sum: "$items.quantity" } } },
  { $sort: { total: -1 } }
])


- Shows the most frequently stored ingredients across all user fridges.

### 2. Neo4j – Graph Database for Ingredient-Drink Matching

Neo4j was used to efficiently represent and query the relationships between drinks and ingredients. Each:

* Drink is a node (`:Drink`)
* Ingredient is a node (`:Ingredient`)
* A `(:Drink)-[:HAS]->(:Ingredient)` relationship is used

#### Path Traversal Query

```cypher
MATCH (d:Drink)-[:HAS]->(i:Ingredient)
WITH d, collect(toLower(i.name)) AS requiredIngredients
WHERE all(ingredient IN requiredIngredients WHERE ingredient IN $fridge)
RETURN d
```

- Given a user’s fridge ingredients, this query returns all drink nodes whose required ingredients are fully present in the fridge. This is core to the “What I Can Make” feature.

Neo4j’s pattern matching makes it easy to query many-to-many relationships efficiently without manually joining tables.

### 3. Redis – Real-Time Notifications and De-Duplication

Redis was used to manage real-time notifications and prevent duplicate alerts when new drinks became available to a user.

We used the following Redis data types:

* Lists - (`rPush`, `lRange`, `del`):

  * Used to store per-user notifications:
    e.g., `user:123:notifications` → list of JSON-encoded drink alerts.

* Sets - (`sAdd`, `sMembers`):

  * Used to track which drinks a user has already been notified about, avoiding duplicate notifications.
    e.g., `user:123:notified_drinks`

* Strings - (`set`, `get`):

  * Used to cache a user’s current makeable drink IDs, so we can detect when new drinks become possible.
    e.g., `user:123:makeableDrinks`

* Pub/Sub - (`publish`):

  * Used to notify a channel (`new-drinks-channel`) when new drinks are detected for a user.

#### Redis Roles in MixMate

* Notification Queue**:
  When a new ingredient is added, the system determines which drinks become makeable and pushes relevant notifications to a Redis list.

* De-Duplication**:
  A Redis `Set` tracks previously notified drinks, ensuring the user isn't notified twice about the same drink.

* Pub/Sub Integration**:
  Redis `publish` is triggered when new makeable drinks are found, paving the way for future real-time frontend updates via WebSockets or other subscribers.
