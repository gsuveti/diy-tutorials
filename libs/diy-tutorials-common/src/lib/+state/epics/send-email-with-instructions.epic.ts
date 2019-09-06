import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddResponse, TutorialActionTypes} from '../tutorial.actions';
import {ignoreElements, tap} from 'rxjs/operators';
import {AppState} from '../app.state';
import * as firebase from 'firebase';


export const sendEmailWithInstructionsEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
  return action$.pipe(
    ofType(TutorialActionTypes.SendEmailWithInstructions),
    tap((action: AddResponse) => {
      const {products, commonProducts, optionalProducts} = state$.value.tutorial;

      const {
        user, displayedProducts, selectedProductRange, productQuantities,
        productRangePrices, selectedProducts: selectedProductsUUIDs,
        commonProductsTotalPrice
      } = state$.value.userContext;

      if (selectedProductRange) {
        const {email} = user;

        const title = getTitle();
        const content = getContent();
        const displayedSections = getSections();

        const total = productRangePrices[selectedProductRange] + commonProductsTotalPrice;

        const selectedProducts = products
          .filter(product => product.parentBlockUUID === selectedProductRange)
          .filter(product => displayedProducts[product.uuid]);

        const selectedCommonProducts = commonProducts
          .filter(product => displayedProducts[product.uuid]);

        const productsContent = selectedProducts.concat(selectedCommonProducts)
          .reduce((html, product) => {
            const quantity = productQuantities[product.uuid];
            return html + getHtmlForProduct(product, quantity);
          }, `<h2>Produse necesare (${total} lei)</h2>`);

        const selectedOptionalProducts = optionalProducts
          .filter(product => displayedProducts[product.uuid])
          .filter(product => selectedProductsUUIDs.indexOf(product.uuid) >= 0);

        const selectedOptionalProductsTotal = selectedOptionalProducts
          .reduce((total, product) => {
            const quantity = productQuantities[product.uuid];
            return total + product.price * quantity;
          }, 0);

        const optionalProductsContent = selectedOptionalProducts
          .reduce((html, product) => {
            const quantity = productQuantities[product.uuid];
            return html + getHtmlForProduct(product, quantity);
          }, `<h2>Produse optionale (${selectedOptionalProductsTotal} lei)</h2>`);


        const html = title + content + displayedSections
          + productsContent + optionalProductsContent;

        const data = {
          html,
          email,
          products: selectedProducts.concat(selectedOptionalProducts),
          optionalProducts
        };

        return firebase.firestore().collection(`emails`).add(data);
      } else {
        alert("Selecteaza o gama de produse!")
      }
    }),
    ignoreElements()
  );
};

function getTitle() {
  return document.querySelector('.post .entry-title').outerHTML;
}

function getContent() {
  return Array.from(document.querySelectorAll('.entry-content > :not(#root)'))
    .reduce((acc, item) => {
      return acc + item.outerHTML
    }, '');
}

function getSections() {
  return Array.from(document.querySelectorAll('#root>div>.show:not(.product-list)'))
    .reduce((acc, item) => {
      return acc + item.outerHTML
    }, '');
}

function getHtmlForProduct(product, quantity): string {
  return `<div>
            <h3><a target="_blank" href="${product.url}">${product.headline}</a> x ${quantity}</h3>
            <img src="${product.imageUrl}"/>
          </div>`;
}
