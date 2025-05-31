# Silzey POS Application

This is a Point of Sale (POS) application built with React, based on the code provided.

## Features (as per the provided code)

- Product catalog display by category (Flower, Concentrates, Vapes, Edibles).
- Product filtering by tag (Organic, Hybrid, Indica, Sativa) and search term.
- Product sorting (A-Z, Price).
- Product detail view in a modal.
- Shopping cart functionality:
    - Add products to cart.
    - Update quantity of items in cart.
    - Remove items from cart.
    - View cart in a modal.
- Checkout process:
    - Proceed to checkout from cart.
    - Customer information form (First Name, Last Name, DOB, Phone Number).
    - Order summary and total price display.
    - Rewards points calculation and display.
    - Finalize sale.
- UI Elements:
    - Splash screen on initial load.
    - "Thank You" card after finalizing a sale, followed by a page reload.
    - Load More button for product listings.
- Styling: Uses inline styles and some global CSS classes (now in `public/index.html`).

## Project Setup

To run this project locally:

1.  **Create the file structure:**
    Create a root folder (e.g., `silzey-pos-app`) and then the `public` and `src` subfolders. Place the `index.html`, `App.js`, `index.js`, `package.json`, and `.gitignore` files in their respective locations as shown in the structure above.

2.  **Install dependencies:**
    Navigate to the root project directory (`silzey-pos-app`) in your terminal and run:
    ```bash
    npm install
    ```
    or if you use Yarn:
    ```bash
    yarn install
    ```

## Available Scripts

In the project directory, you can run:

### `npm start` or `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build` or `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the Create React App documentation on [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## To Create a Zip for GitHub

1.  Follow the **Project Setup** steps above to create the project folder with all the files and install dependencies.
2.  Once your `silzey-pos-app` folder is ready (optionally, you can delete the `node_modules` folder before zipping to make the zip file much smaller; it can be reinstalled later by anyone who downloads the project using `npm install`).
3.  Right-click on the `silzey-pos-app` folder.
4.  Select "Compress" (on macOS) or "Send to > Compressed (zipped) folder" (on Windows).
5.  This will create a `silzey-pos-app.zip` file, which you can then upload to GitHub or share.
