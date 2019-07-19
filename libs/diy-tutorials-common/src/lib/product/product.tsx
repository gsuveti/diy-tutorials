import React from 'react';
import {connect} from 'react-redux';

import './product.scss';
import {serializeAttributes} from '../utils';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {addMeasurement, TutorialActions} from '../tutorial/+state/tutorial.actions';
import {AppState} from '../store';

/* tslint:disable:no-empty-interface */
interface OwnProps {
  children?: any;
  attributes?: {
    uuid: string;
    name: string;
    headline: string;
    imageUrl: string;
    productType: string;
    productRange: string;
    price: number;
    quantityFormula: string;
  };
  isRenderedInEditor?: boolean;
}


interface DispatchProps {
}

interface StateProps {
  quantity?: number;
}

type ProductProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface ProductState {
}

export const Product = (props: ProductProps) => {
  const {children, attributes, isRenderedInEditor, quantity} = props;
  const {price, imageUrl, headline} = attributes;

  return (
    <div data-attributes={serializeAttributes(attributes)}>
      {children}
      {
        isRenderedInEditor ? null :
          <div>
            <p className={'m-0'}>{headline}</p>
            <img src={imageUrl}/>
            <p className={'m-0'}><strong>{quantity}</strong> X {price} = {quantity * price}</p>
          </div>
      }
    </div>
  );
};


function mapStateToProps(state: AppState, ownProps: ProductProps, ownState: ProductState): StateProps {
  const {attributes} = ownProps;
  const {uuid} = attributes;
  return {
    quantity: state.tutorial.productQuantities[uuid]
  };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
    addMeasurement,
  }, dispatch);


export const ConnectedProduct = connect<StateProps, DispatchProps, ProductProps>(
  mapStateToProps,
  mapDispatchToProps
)(Product);

