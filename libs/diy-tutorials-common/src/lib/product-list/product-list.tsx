import React from 'react';
import {connect} from 'react-redux';

import './product-list.scss';
import {serializeAttributes} from '../utils';
import {Block} from '../models/block.model';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {ConnectedProductRange} from '../product-range/product-range';
import {addProductsToCart, showProducts, TutorialActions} from '../tutorial/+state/tutorial.actions';
import {AppState} from '../store';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {BlockAttributes} from '../models/block-attributes.model';
import {groupBy} from 'lodash';
import {Button} from '@material/react-button';
import MaterialIcon from '@material/react-material-icon';


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

    const icon = <MaterialIcon icon='shopping_cart'/>;
    return (
      <div key={productRange.uuid} className={'col-sm'}>
        <div className={'row'}>
          <div className={'col'}>
            <h4 className={'m-0'}>{productRange.headline}</h4>
          </div>
        </div>
        <div className={'row'}>
          <div className={'col-4'}>
            <p className={'m-0 pt-xs'}>Total: {total} lei</p>
          </div>
          <div className={'col-8'}>

            <Button
              raised={true}
              dense={true}
              trailingIcon={icon}
              onClick={() => {
                addProductsToCart(products);
              }}>
              Adauga in cos
            </Button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className={`${className ? className : 'product-list '} ${isVisible ? "show" : "hide"}`}
         data-attributes={serializeAttributes(attributes)}>
      <div className={'row'}>
        {content}
      </div>
      {
        isRenderedInEditor ? null :
          <div className={'row'}>
            {productRangesSummary}
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
      .filter(product => displayedProductTypes[product.productType])
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
