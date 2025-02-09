import React from "react";
import "./styles.css";

import faker from "faker";
import { useState, useReducer } from "react";

faker.seed(123);

const data = [...Array(50)].map((item) => ({
  id: faker.random.uuid(),
  name: faker.commerce.productName(),
  image: faker.random.image(),
  price: faker.commerce.price(),
  material: faker.commerce.productMaterial(),
  brand: faker.lorem.word(),
  inStock: faker.random.boolean(),
  fastDelivery: faker.random.boolean(),
  ratings: faker.random.arrayElement([1, 2, 3, 4, 5]),
  offer: faker.random.arrayElement([
    "Save 50",
    "70% bonanza",
    "Republic Day Sale",
  ]),
  idealFor: faker.random.arrayElement([
    "Men",
    "Women",
    "Girl",
    "Boy",
    "Senior",
  ]),
  level: faker.random.arrayElement([
    "beginner",
    "amateur",
    "intermediate",
    "advanced",
    "professional",
  ]),
  color: faker.commerce.color(),
}));
const initialState = {
  name: "",
  sort: "",
  outOfStock: false,
  fastDelivery: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "OUT_OF_STOCK":
      return { ...state, outOfStock: !state.outOfStock };
    case "FAST_DELIVERY":
      return { ...state, fastDelivery: !state.fastDelivery };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const filterdData = data
    .filter((product) => {
      const matchesName = product.name
        .toLowerCase()
        .includes(state.name.toLowerCase());
      // othere filters
      if (!matchesName) return false;

      if (state.outOfStock && product.inStock) return false;

      if (state.fastDelivery && !product.fastDelivery) return false;

      return true;
    })
    .sort((a, b) => {
      //4. sort based on price
      if (state.sort === "high-to-low") {
        return b.price - a.price;
      } else if (state.sort === "low-to-high") {
        return a.price - b.price;
      }
      return 0;
    });

  return (
    <>
      <form>
        <label>
          Search:
          <input
            type="text"
            value={state.name}
            placeHolder="Search By Name"
            onChange={(e) =>
              dispatch({ type: "SET_NAME", payload: e.target.value })
            }
          />
        </label>
        <button>Search</button>

        <fieldset>
          <legend>Sort By</legend>
          <input
            type="radio"
            id="high-to-low"
            value="high-to-low"
            name="sort"
            checked={state.sort === "high-to-low"}
            onChange={(e) =>
              dispatch({ type: "SET_SORT", payload: e.target.value })
            }
          />
          <label htmlFor="high-to-low">Price - High to Low</label> <br />
          <input
            type="radio"
            id="low-to-high"
            name="sort"
            value="low-to-high"
            checked={state.sort === "low-to-high"}
            onChange={(e) =>
              dispatch({ type: "SET_SORT", payload: e.target.value })
            }
          />
          <label htmlFor="low-to-high">Price - Low to High</label>
        </fieldset>

        <fieldset>
          <legend>Filters</legend>
          <input
            type="checkbox"
            id="out-of-stock"
            checked={state.outOfStock}
            onChange={() => dispatch({ type: "OUT_OF_STOCK" })}
          />
          <label htmlFor="out-of-stock">Include Out of Stock </label>
          <input
            type="checkbox"
            id="fast-delivery"
            checked={state.fastDelivery}
            onChange={() => dispatch({ type: "FAST_DELIVERY" })}
          />
          <label htmlFor="fast-delivery">Fast Delivery Only </label>
        </fieldset>
        <button onClick={() => dispatch({ type: "RESET" })}>RESET</button>
      </form>

      <div className="App" style={{ display: "flex", flexWrap: "wrap" }}>
        {filterdData.map(
          ({
            id,
            name,
            image,
            price,
            productName,
            inStock,
            level,
            fastDelivery,
          }) => (
            <div
              key={id}
              style={{
                border: "1px solid #4B5563",
                borderRadius: "0 0 0.5rem 0.5rem",
                margin: "1rem",
                maxWidth: "40%",
                padding: "0 0 1rem",
              }}
            >
              <img src={image} width="100%" height="auto" alt={productName} />
              <h3> {name} </h3>
              <div>Rs. {price}</div>
              {inStock && <div> In Stock </div>}
              {!inStock && <div> Out of Stock </div>}
              <div>{level}</div>
              {fastDelivery ? (
                <div> Fast Delivery </div>
              ) : (
                <div> 3 days minimum </div>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}
