import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import React, { useState } from "react";

const initialFormValues = {
    id: "",
    name: "",
    description: "",
    price: "",
    currency_type: "",
    average_rating: 0,
    discount: 0,
    favourite: false,
    imagelink_portrait: "",
    imagelink_square: "",
    index: 0,
    ingredients: "",
    options: [
        {
            name: "Temperature",
            choices: [
                {
                    default: true,
                    name: "Hot",
                    size_options: [
                        {
                            SizeOptionId: 1,
                            name: "Small",
                            price: 2.5,
                            currency: "$",
                            default: true,
                        },
                        {
                            SizeOptionId: 2,
                            name: "Medium",
                            price: 3.5,
                            currency: "$",
                            default: false,
                        },
                        {
                            SizeOptionId: 3,
                            name: "Large",
                            price: 4.5,
                            currency: "$",
                            default: false,
                        },
                    ],
                },
                {
                    default: false,
                    name: "Iced",
                    size_options: [
                        {
                            SizeOptionId: 1,
                            name: "Small",
                            price: 3.0,
                            currency: "$",
                            default: false,
                        },
                        {
                            SizeOptionId: 2,
                            name: "Medium",
                            price: 4.0,
                            currency: "$",
                            default: false,
                        },
                        {
                            SizeOptionId: 3,
                            name: "Large",
                            price: 5.0,
                            currency: "$",
                            default: false,
                        },
                    ],
                },
            ],
        },
    ],
    modifiers: {
        minqty: 0,
        maxqty: 3,
        choices: [
            {
                ModifierId: 1,
                ProductModifierId: 1,
                name: "Sprinkles",
                price: 0.5,
                currency: "$",
                default: true,
            },
            {
                ModifierId: 2,
                ProductModifierId: 2,
                name: "Nuts",
                price: 0.75,
                currency: "$",
                default: false,
            },
            {
                ModifierId: 3,
                ProductModifierId: 3,
                name: "Chocolate Sauce",
                price: 1.0,
                currency: "$",
                default: false,
            },
        ],
    },
    ratings_count: "0",
    roasted: "",
    special_ingredient: "",
    type: "Dessert",
};


const AddProductForm = () => {
    const [formValues, setFormValues] = useState(initialFormValues);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormValues({
            ...formValues,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleOptionChange = (optionIndex, choiceIndex, sizeIndex, fieldName, value) => {
        const updatedOptions = [...formValues.options];
        updatedOptions[optionIndex].choices[choiceIndex].size_options[sizeIndex][fieldName] = value;
        setFormValues({ ...formValues, options: updatedOptions });
    };

    const handleModifierChange = (modifierIndex, fieldName, value) => {
        const updatedModifiers = [...formValues.modifiers.choices];
        updatedModifiers[modifierIndex][fieldName] = value;
        setFormValues({
            ...formValues,
            modifiers: { ...formValues.modifiers, choices: updatedModifiers },
        });
    };

    const handleSave = async () => {
        const productData = {
            ...formValues,
        };
        console.log("Product data to be saved:", productData);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Product Name"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Description"
                    name="description"
                    value={formValues.description}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Price"
                    name="price"
                    value={formValues.price}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                    <InputLabel>Currency Type</InputLabel>
                    <Select
                        name="currency_type"
                        label="Currency Type"
                        value={formValues.currency_type}
                        onChange={handleChange}
                    >
                        <MenuItem value="$">USD</MenuItem>
                        <MenuItem value="€">EUR</MenuItem>
                        <MenuItem value="£">GBP</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Ingredients"
                    name="ingredients"
                    value={formValues.ingredients}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Special Ingredient"
                    name="special_ingredient"
                    value={formValues.special_ingredient}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formValues.favourite}
                            onChange={handleChange}
                            name="favourite"
                        />
                    }
                    label="Favourite"
                />
            </Grid>

            {/* Render các options */}
            {formValues.options.map((option, optionIndex) => (
                <Grid item xs={12} key={option.name}>
                    <InputLabel>{option.name}</InputLabel>
                    {option.choices.map((choice, choiceIndex) => (
                        <Grid container key={choiceIndex} spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Choice Name"
                                    name="name"
                                    value={choice.name}
                                    onChange={(e) =>
                                        handleOptionChange(
                                            optionIndex,
                                            choiceIndex,
                                            0,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    fullWidth
                                    margin="dense"
                                />
                            </Grid>
                            {choice.size_options.map((sizeOption, sizeIndex) => (
                                <Grid container key={sizeOption.SizeOptionId} spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Size Option Name"
                                            name="sizeOption"
                                            value={sizeOption.name}
                                            onChange={(e) =>
                                                handleOptionChange(
                                                    optionIndex,
                                                    choiceIndex,
                                                    sizeIndex,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            fullWidth
                                            margin="dense"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Price"
                                            name="price"
                                            value={sizeOption.price}
                                            onChange={(e) =>
                                                handleOptionChange(
                                                    optionIndex,
                                                    choiceIndex,
                                                    sizeIndex,
                                                    "price",
                                                    e.target.value
                                                )
                                            }
                                            fullWidth
                                            margin="dense"
                                        />
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Grid>
            ))}

            {/* Render các modifiers */}
            {formValues.modifiers.choices.map((modifier, modifierIndex) => (
                <Grid item xs={12} sm={6} key={modifier.ModifierId}>
                    <TextField
                        label="Modifier Name"
                        name="name"
                        value={modifier.name}
                        onChange={(e) =>
                            handleModifierChange(modifierIndex, "name", e.target.value)
                        }
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Price"
                        name="price"
                        value={modifier.price}
                        onChange={(e) =>
                            handleModifierChange(modifierIndex, "price", e.target.value)
                        }
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="Currency"
                        name="currency"
                        value={modifier.currency}
                        onChange={(e) =>
                            handleModifierChange(modifierIndex, "currency", e.target.value)
                        }
                        fullWidth
                        margin="dense"
                    />
                </Grid>
            ))}

            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    Save Product
                </Button>
            </Grid>
        </Grid>
    );
};

export default AddProductForm;
