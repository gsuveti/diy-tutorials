import {createSelector} from 'reselect';
import {AppState} from '@diy-tutorials/diy-tutorials-common';

const domurl = require("domurl");
const qs = require('qs');

const getProducts = (state: AppState) => state.tutorial.products;
const getOptionalProducts = (state: AppState) => state.tutorial.optionalProducts;
const getCommonProducts = (state: AppState) => state.tutorial.commonProducts;
const getDisplayedProducts = (state: AppState) => state.userContext.displayedProducts;
const getSelectedProductRange = (state: AppState) => state.userContext.selectedProductRange;
const getSelectedProducts = (state: AppState) => state.userContext.selectedProducts;
const getProductQuantities = (state: AppState) => state.userContext.productQuantities;

export const getDisplayedCommonProductsFromSelectedProductRange = createSelector(
  [getCommonProducts, getDisplayedProducts, getSelectedProductRange],
  (commonProducts, displayedProducts) => {

    return commonProducts
      .filter(product => displayedProducts[product.uuid]);
  }
);

export const getDisplayedOptionalProducts = createSelector(
  [getOptionalProducts, getDisplayedProducts, getSelectedProducts],
  (optionalProducts, displayedProducts, selectedProductsUUIDs) => {

    return optionalProducts
      .filter(product => displayedProducts[product.uuid])
      .filter(product => selectedProductsUUIDs.indexOf(product.uuid) >= 0);

  }
);

export const getDisplayedProductsFromSelectedProductRange = createSelector(
  [getDisplayedCommonProductsFromSelectedProductRange, getProducts, getDisplayedProducts, getSelectedProductRange],
  (commonProducts, products, displayedProducts, selectedProductRange) => {

    return products
      .filter(product => product.parentBlockUUID === selectedProductRange)
      .filter(product => displayedProducts[product.uuid])
      .concat(commonProducts);
  }
);

export const getProductsToCartLink = createSelector(
  [getDisplayedProductsFromSelectedProductRange, getDisplayedOptionalProducts, getProductQuantities],
  (products, optionalProducts, productQuantities): string => {

    const additionalParams = products.concat(optionalProducts)
      .reduce((params, product) => {
        const {contentIds, numItems} = params;
        contentIds.push(product.externalId);
        numItems.push(productQuantities[product.uuid]);

        return {contentIds, numItems};
      }, {
        contentIds: [],
        numItems: []
      });

    const url = new domurl('https://sorelamigo.ro/index.php?route=checkout/cart');
    const params = {
      ...qs.parse(url.query),
      ...additionalParams
    };
    url.query = qs.stringify(params);


    return url.toString();
  }
);
