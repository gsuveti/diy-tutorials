import React from 'react';
import {connect} from 'react-redux';

import './product-list.scss';
import {groupBy, serializeAttributes} from '../utils';
import {Block} from '../models/block.model';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {ConnectedProductRange} from '../product-range/product-range';
import {addProductsToCart, showProducts, TutorialActions} from '../tutorial/+state/tutorial.actions';
import {AppState} from '../store';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {BlockAttributes} from '../models/block-attributes.model';
import {ConnectedProduct} from '../product/product';


/* tslint:disable:no-empty-interface */
interface OwnProps {
  className?: string;
  attributes?: {
    uuid: string
  };
  children?: any;
  innerBlocks?: Block[];
  isRenderedInEditor?: boolean;
}


interface DispatchProps {
  showProducts?: typeof showProducts;
  addProductsToCart?: typeof addProductsToCart;
}

interface StateProps {
  isVisible?: boolean;
  productRanges?: BlockAttributes;
  productsByProductRange?: BlockAttributes;
}

type ProductListProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface ProductListState {
}

const allowedComponents = {
  'irian/diy-product-range': ConnectedProductRange,
  'irian/diy-product': ConnectedProduct,
};

export const ProductList = (props: ProductListProps) => {
  const {
    children, innerBlocks, className, attributes, isVisible = true, productRanges = [],
    isRenderedInEditor, addProductsToCart, productsByProductRange
  } = props;
  const {uuid} = attributes;

  const content = children ?
    children
    :
    <InnerBlocksContent
      innerBlocks={innerBlocks}
      allowedComponents={allowedComponents}
    />
  ;

  const productRangesSummary = productRanges.map(productRange => {
    const products = productsByProductRange[productRange.uuid] || [];
    const total = products
      .reduce((sum, product) => sum + product.price * product.quantity, 0);

    return (
      <div key={productRange.uuid} className={'col-sm'}>
        <div className={'row'}>

          <div className={'col-12'}>
            <p className={'m-0 pt-xs'}>{productRange.headline}: {total} lei</p>
          </div>
          <div className={'col-12'}>
            <button type="button" className="btn btn-outline-primary d-flex"
                    onClick={() => {
                      addProductsToCart(products);
                    }}>
              <span className={'material-icons'}>shopping_cart</span>Adauga in cos
            </button>
          </div>
        </div>

      </div>
    );
  });

  return (
    <div className={`${className ? className : 'product-list row'} ${isVisible ? "show" : "hide"}`}
         data-attributes={serializeAttributes(attributes)}>
      {content}
      {
        isRenderedInEditor ? null :
          <div className={'col-12'}>
            <div className={'row'}>
              {productRangesSummary}
            </div>
          </div>
      }
    </div>
  );
};


function mapStateToProps(state: AppState, ownProps: ProductListProps, ownState: ProductListState): StateProps {
  const {attributes} = ownProps;
  const {uuid} = attributes;
  const productQuantities = state.tutorial.productQuantities;
  const displayedProductTypes = state.tutorial.displayedProductTypes;


  const productsByProductRange = groupBy(
    state.tutorial.products
      .filter(product => {
        if (product.productType) {
          return displayedProductTypes[product.productType];
        }
        return true;
      })
      .map(product => {
        return {...product, quantity: productQuantities[product.uuid]};
      }),
    "parentBlockUUID"
  );


  return {
    isVisible: state.tutorial.showProducts,
    productRanges: state.tutorial.productRanges,
    productsByProductRange: productsByProductRange,
  };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
    showProducts,
    addProductsToCart,
  }, dispatch);


export const ConnectedProductList = connect<StateProps, DispatchProps, ProductListProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProductList);
