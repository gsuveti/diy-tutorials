import React from 'react';
import {connect} from 'react-redux';

import './product-list.scss';
import {serializeAttributes} from '../utils';
import {Block} from '../models/block.model';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {ConnectedProductRange} from '../product-range/product-range';
import {showProducts, TutorialActions} from '../tutorial/+state/tutorial.actions';
import {AppState} from '../store';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';

/* tslint:disable:no-empty-interface */
interface OwnProps {
  className?: string;
  attributes?: {};
  children?: any;
  innerBlocks?: Block[];
}


interface DispatchProps {
  showProducts?: typeof showProducts;
}

interface StateProps {
  isVisible?: boolean;
}

type ProductListProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface ProductListState {
}

const allowedComponents = {
  'irian/diy-product-range': ConnectedProductRange,
};

export const ProductList = (props: ProductListProps) => {
  const {children, innerBlocks, className, attributes, isVisible = true} = props;

  const content = children ?
    children
    :
    <InnerBlocksContent
      innerBlocks={innerBlocks}
      allowedComponents={allowedComponents}
    />
  ;

  return (
    <div className={`${className ? className : 'product-list row'} ${isVisible ? "show" : "hide"}`}
         data-attributes={serializeAttributes(attributes)}>
      {content}
    </div>
  );
};


function mapStateToProps(state: AppState, ownProps: ProductListProps, ownState: ProductListState): StateProps {
  const {attributes} = ownProps;
  return {
    isVisible: state.tutorial.showProducts
  };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
    showProducts,
  }, dispatch);


export const ConnectedProductList = connect<StateProps, DispatchProps, ProductListProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProductList);
