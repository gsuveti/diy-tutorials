import React from 'react';
import {connect} from 'react-redux';

import './product-list.scss';
import {groupBy, serializeAttributes} from '../utils';
import {Block} from '../models/block.model';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {ConnectedProductRange} from '../product-range/product-range';
import {selectProductRange, showProducts, TutorialActions} from '../tutorial/+state/tutorial.actions';
import {AppState} from '../store';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {BlockAttributes} from '../models/block-attributes.model';
import {ConnectedProduct} from '../product/product';


/* tslint:disable:no-empty-interface */
interface OwnProps {
  attributes?: {
    uuid: string
  };
  children?: any;
  innerBlocks?: Block[];
  isRenderedInEditor?: boolean;
}


interface DispatchProps {
  showProducts?: typeof showProducts;
  selectProductRange?: typeof selectProductRange;
}

interface StateProps {
  isVisible?: boolean;
  selectedProductRange?: string;
  optionalProducts?: BlockAttributes[];
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
    children, innerBlocks, attributes, isVisible = true, productRanges = [],
    isRenderedInEditor, selectProductRange, selectedProductRange, productsByProductRange, optionalProducts = []
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

    const isSelected = selectedProductRange === productRange.uuid;

    return (
      <div key={productRange.uuid}
           className={`product-range-summary col-12 col-md-4 border
               ${isSelected ? 'border-primary' : 'border-secondary'}
               ${isRenderedInEditor ? 'px-0' : 'px-sm'}
          `}>
        <div className={'row no-gutters p-sm'}>
          <div className={'col-12'}>
            <p className={'m-0 pt-xs'}>{productRange.headline}: {total} lei</p>
          </div>
          <div className={'col-12'}>
            <button type="button" className="btn btn-outline-primary d-flex"
                    onClick={() => {
                      selectProductRange(productRange.uuid);
                    }}>
              Selecteaza
            </button>
          </div>
        </div>

      </div>
    );
  });

  const optionalProductsContent = optionalProducts.map((attributes: any) => {
    return (
      <div className={'col-sm px-0'} key={attributes.uuid}>
        <div className={'row no-gutters'}>
          <ConnectedProduct
            attributes={attributes}
          />
        </div>
      </div>
    );
  });

  return (
    <div
      className={`product-list row no-gutters ${isVisible ? "show" : "hide"} ${isRenderedInEditor ? 'flex-column' : ''}`}
      data-attributes={serializeAttributes(attributes)}>
      {content}
      {
        isRenderedInEditor ? null :
          <div className={'col-12'}>
            <div className={'row no-gutters'}>
              {productRangesSummary}
            </div>

            <h4 className={'my-sm'}>Produse optionale</h4>

            <div className={'row no-gutters'}>
              {optionalProductsContent}
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
    selectedProductRange: state.tutorial.selectedProductRange,
    optionalProducts: state.tutorial.optionalProducts,
    productsByProductRange: productsByProductRange,
  };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
    showProducts,
    selectProductRange
  }, dispatch);


export const ConnectedProductList = connect<StateProps, DispatchProps, ProductListProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProductList);
