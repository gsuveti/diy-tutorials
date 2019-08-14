import React from 'react';
import {connect} from 'react-redux';

import './product-range.scss';
import {serializeAttributes} from '../utils';
import {ConnectedProduct} from '../product/product';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {Block} from '../models/block.model';
import {addProductsToCart, TutorialActions} from '../tutorial/+state/tutorial.actions';
import {AppState} from '../store';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {BlockAttributes} from '../models/block-attributes.model';

/* tslint:disable:no-empty-interface */
export interface OwnProps {
  attributes?: {
    uuid: string;
    name: string;
    headline: string;
    description: string;
  };
  children?: any;
  isRenderedInEditor?: boolean;
  innerBlocks?: Block[];
}

interface DispatchProps {
  addProductsToCart?: typeof addProductsToCart
}

interface StateProps {
  commonProducts?: BlockAttributes[];
  isSelected?: boolean;
}

export type ProductRangeProps = StateProps & DispatchProps & OwnProps;


interface ProductRangeState {
}

const allowedComponents = {
  'irian/diy-product': ConnectedProduct,
};

export const ProductRange = (props: ProductRangeProps, state: ProductRangeState) => {
  const {children, innerBlocks, attributes, isRenderedInEditor, isSelected, commonProducts = []} = props;
  const {headline, description, uuid} = attributes;
  const content = children ?
    children
    :
    <InnerBlocksContent
      innerBlocks={innerBlocks}
      allowedComponents={allowedComponents}
    />
  ;

  const commonProductsContent = commonProducts.map((attributes: any) => {
    return <ConnectedProduct key={attributes.uuid}
                             attributes={attributes}
    />;
  });


  return (
    <div
      className={`product-range
          ${isSelected ? 'border-primary' : 'border-secondary'}
          ${isRenderedInEditor ? 'px-0' : 'col-12 col-md-4 px-sm border'}
              `}
      data-attributes={serializeAttributes(attributes)}>
      {
        isRenderedInEditor ? null :
          <div>
            <h4>{headline}</h4>
            <p>{description}</p>
          </div>
      }
      {content}
      {commonProductsContent}
      {
        isRenderedInEditor ? null :
          <div>

          </div>
      }
    </div>
  );
};


function mapStateToProps(state: AppState, ownProps: ProductRangeProps, ownState: ProductRangeState): StateProps {
  return {
    commonProducts: state.tutorial.commonProducts,
    isSelected: state.tutorial.selectedProductRange === ownProps.attributes.uuid
  };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
    addProductsToCart
  }, dispatch);


export const ConnectedProductRange = connect<StateProps, DispatchProps, ProductRangeProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProductRange);
