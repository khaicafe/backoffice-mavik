import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import ProductService from "../../services/productService"; // Import ProductService

const CreateProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    roasted: "",
    imagelink_square: "",
    imagelink_portrait: "",
    ingredients: "",
    special_ingredient: "",
    discount: 0,
    average_rating: 0,
    ratings_count: "",
    favourite: false,
    type: "",
    index: 0,
    product_options: [
      {
        temperature_size_id: 0,
        default: false,
      },
    ],
    product_modifiers: [
      {
        modifier_id: 0,
        min_qty: 0,
        max_qty: 0,
      },
    ],
  });
  const [modifiers, setModifiers] = useState([]);
  const [selectedModifier, setSelectedModifier] = useState({
    modifier_id: "",
    min_qty: 0,
    max_qty: 0,
  });

  useEffect(() => {
    // Lấy danh sách các modifier từ API khi component được mount
    ProductService.getAllModifiers()
      .then((response) => {
        console.log('modifier list', response.data)
        setModifiers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the modifiers!", error);
      });
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };
  const handleModifierChange = (e) => {
    const { name, value } = e.target;
    setSelectedModifier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addModifier = () => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      product_modifiers: [...prevProduct.product_modifiers, selectedModifier],
    }));
    setSelectedModifier({ modifier_id: "", min_qty: 0, max_qty: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const productTemp =  {
    //     "average_rating": 4.9,
    //     "description": "Latte is a popular coffee drink made with espresso and steamed milk. It's creamy and smooth, perfect for a cozy morning or an afternoon pick-me-up.",
    //     "discount": 0,
    //     "favourite": true,
    //     "id": 2,
    //     "imagelink_portrait": "/path/to/latte_portrait.png",
    //     "imagelink_square": "/path/to/latte_square.png",
    //     "index": 1,
    //     "ingredients": "Espresso, Milk",
    //     "modifiers": {
    //         "choices": [
    //             {
    //                 "currency": "$",
    //                 "default": false,
    //                 "id": 4,
    //                 "name": "Vanilla Syrup",
    //                 "price": 0.5
    //             },
    //             {
    //                 "currency": "$",
    //                 "default": false,
    //                 "id": 5,
    //                 "name": "Caramel Syrup",
    //                 "price": 0.7
    //             },
    //             {
    //                 "currency": "$",
    //                 "default": false,
    //                 "id": 6,
    //                 "name": "Almond Milk",
    //                 "price": 1
    //             }
    //         ],
    //         "maxqty": 3,
    //         "minqty": 0
    //     },
    //     "name": "Latte",
    //     "options": [
    //         {
    //             "choices": [
    //                 {
    //                     "default": true,
    //                     "name": "Hot",
    //                     "TemperatureId": 1,
    //                     "size_options": [
    //                         {
    //                             "SizeOptionId": 1,
    //                             "currency": "$",
    //                             "default": true,
    //                             "name": "Small",
    //                             "price": 3
    //                         },
    //                         {
    //                             "SizeOptionId": 2,
    //                             "currency": "$",
    //                             "default": false,
    //                             "name": "Medium",
    //                             "price": 3.5
    //                         },
    //                         {
    //                             "SizeOptionId": 3,
    //                             "currency": "$",
    //                             "default": false,
    //                             "name": "Large",
    //                             "price": 4
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "default": false,
    //                     "name": "Iced",
    //                     "TemperatureId": 2,
    //                     "size_options": [
    //                         {
    //                             "SizeOptionId": 1,
    //                             "currency": "$",
    //                             "default": false,
    //                             "name": "Small",
    //                             "price": 3.5
    //                         },
    //                         {
    //                             "SizeOptionId": 2,
    //                             "currency": "$",
    //                             "default": false,
    //                             "name": "Medium",
    //                             "price": 4
    //                         },
    //                         {
    //                             "SizeOptionId": 3,
    //                             "currency": "$",
    //                             "default": false,
    //                             "name": "Large",
    //                             "price": 4.5
    //                         }
    //                     ]
    //                 }
    //             ],
    //             "name": "Temperature"
    //         }
    //     ],
    //     "ratings_count": "8,124",
    //     "roasted": "Light Roasted",
    //     "special_ingredient": "With Foam Milk",
    //     "type": "Coffee"
    // }

    const productTemp =  {
        "average_rating": 4.8,
        "description": "Delicious and creamy ice cream, perfect for a hot summer day.",
        "discount": 0,
        "favourite": true,
        "id": 1,
        "imagelink_portrait": "/path/to/icecream_portrait.png",
        "imagelink_square": "/path/to/icecream_square.png",
        "index": 0,
        "ingredients": "Milk, Sugar, Cream",
        "modifiers": {
            "choices": [
                {
                    "ModifierId": 1,
                    "ProductModifierId": 1,
                    "currency": "$",
                    "default": true,
                    "name": "Sprinkles",
                    "price": 0.5
                },
                {
                    "ModifierId": 2,
                    "ProductModifierId": 2,
                    "currency": "$",
                    "default": false,
                    "name": "Nuts",
                    "price": 0.75
                },
                {
                    "ModifierId": 3,
                    "ProductModifierId": 3,
                    "currency": "$",
                    "default": false,
                    "name": "Chocolate Sauce",
                    "price": 1
                }
            ],
            "maxqty": 3,
            "minqty": 0
        },
        "name": "Americano",
        "options": [
            {
                "choices": [
                    {
                        "default": true,
                        "name": "",
                        "size_options": [
                            {
                                "SizeOptionId": 1,
                                "currency": "$",
                                "default": true,
                                "name": "Small",
                                "price": 2.5
                            },
                            {
                                "SizeOptionId": 2,
                                "currency": "$",
                                "default": false,
                                "name": "Medium",
                                "price": 3.5
                            },
                            {
                                "SizeOptionId": 3,
                                "currency": "$",
                                "default": false,
                                "name": "Large",
                                "price": 4.5
                            }
                        ]
                    }
                ],
                "name": "Temperature"
            }
        ],
        "ratings_count": "1,234",
        "roasted": "",
        "special_ingredient": "With Chocolate Topping",
        "type": "Dessert"
    }

    
    try {
      await ProductService.createProduct(productTemp);
      toast.success("Product created successfully!");
      // Reset form hoặc chuyển hướng người dùng
    } catch (error) {
      toast.error("There was an error creating the product.");
      console.error("There was an error creating the product!", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
        ></textarea>
      </div>
      <div>
        <label>Roasted:</label>
        <input
          type="text"
          name="roasted"
          value={product.roasted}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Image Link Square:</label>
        <input
          type="text"
          name="imagelink_square"
          value={product.imagelink_square}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Image Link Portrait:</label>
        <input
          type="text"
          name="imagelink_portrait"
          value={product.imagelink_portrait}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Ingredients:</label>
        <input
          type="text"
          name="ingredients"
          value={product.ingredients}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Special Ingredient:</label>
        <input
          type="text"
          name="special_ingredient"
          value={product.special_ingredient}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Discount:</label>
        <input
          type="number"
          name="discount"
          value={product.discount}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Average Rating:</label>
        <input
          type="number"
          name="average_rating"
          value={product.average_rating}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Ratings Count:</label>
        <input
          type="text"
          name="ratings_count"
          value={product.ratings_count}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Favourite:</label>
        <input
          type="checkbox"
          name="favourite"
          checked={product.favourite}
          onChange={(e) =>
            setProduct((prevProduct) => ({
              ...prevProduct,
              favourite: e.target.checked,
            }))
          }
        />
      </div>
      <div>
        <label>Type:</label>
        <input
          type="text"
          name="type"
          value={product.type}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Index:</label>
        <input
          type="number"
          name="index"
          value={product.index}
          onChange={handleChange}
        />
      </div>
      {/* Form để chọn modifier */}
      <div>
        <label>Modifier:</label>
        <select
          name="modifier_id"
          value={selectedModifier.modifier_id}
          onChange={handleModifierChange}
        >
          <option value="">Select Modifier</option>
          {modifiers.map((modifier) => (
            <option key={modifier.id} value={modifier.id}>
              {modifier.name}
            </option>
          ))}
        </select>
        <label>Min Qty:</label>
        <input
          type="number"
          name="min_qty"
          value={selectedModifier.min_qty}
          onChange={handleModifierChange}
        />
        <label>Max Qty:</label>
        <input
          type="number"
          name="max_qty"
          value={selectedModifier.max_qty}
          onChange={handleModifierChange}
        />
        <button type="button" onClick={addModifier}>
          Add Modifier
        </button>
      </div>

      {/* Add UI for product_options and product_modifiers here */}
      <button type="submit">Create Product</button>
    </form>
  );
};

export default CreateProductForm;
