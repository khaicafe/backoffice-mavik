# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

### table https://dbdiagram.io/

Table Product {
ID int [pk, increment] // Primary key
Name varchar
Description text
Roasted varchar
ImageLinkSquare varchar
ImageLinkPortrait varchar
Ingredients varchar
SpecialIngredient varchar
Discount float
AverageRating float
RatingsCount varchar
Favourite boolean
Type varchar
Index int
}

Table ProductGroup {
ID int [pk, increment] // Primary key
// Foreign key reference to Product
ProductID int [ref: > Product.ID]
GroupID int [ref: > Group.ID]
// Foreign key reference to Modifier
Type int

}
Table ProductTemperatureSize {
ID int [pk, increment] // Primary key
TemperatureID int [ref: > Temperature.ID]
SizeID int [ref: > Size.ID]
ProductID int [ref: > Product.ID]
Price float
Currency varchar
Default boolean
}

Table Temperature {
ID int [pk, increment] // Primary key
Name varchar
}

Table Size {
ID int [pk, increment] // Primary key
Name varchar

}
Table Group {
ID int [pk, increment] // Primary key
// Foreign key reference to Product
Name varchar
MinQty int
MaxQty int
// Foreign key reference to Modifier

}

Table GroupModifier {
ID int [pk, increment] // Primary key
GroupID int [ref: > Group.ID] // Foreign key reference to Product

ModifierID int [ref: > Modifier.ID] // Foreign key reference to Modifier
Default boolean
}

Table Modifier {
ID int [pk, increment] // Primary key
Name varchar
Price float
Currency varchar

}
Table ProductCategories {
ID int [pk, increment] // Primary key
ProductID int [ref: > Product.ID]
CategoriesID int [ref: > Categories.ID]
}

Table Categories {
ID int [pk, increment] // Primary key
Name varchar
}
#   b a c k o f f i c e - m a v i k  
 