import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectProductsPage = (state: AppRootState) => state.productsPage;

export const retrieveRestaurant = createSelector(
    selectProductsPage,
    (ProductPages) => ProductPages.restaurant
);

export const retrieveChosenProduct = createSelector(
    selectProductsPage,
    (ProductPages) => ProductPages.chosenProduct
);
export const retrieveProducts = createSelector(
    selectProductsPage,
    (ProductPages) => ProductPages.products
);