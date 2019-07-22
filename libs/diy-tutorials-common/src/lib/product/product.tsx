import React from 'react';
import {connect} from 'react-redux';

import './product.scss';
import {serializeAttributes} from '../utils';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {addMeasurement, TutorialActions} from '../tutorial/+state/tutorial.actions';
import {AppState} from '../store';

/* tslint:disable:no-empty-interface */
interface OwnProps {
  className?: string;
  children?: any;
  attributes?: {
    uuid: string;
    name: string;
    headline: string;
    imageUrl: string;
    productType: string;
    price: number;
    quantityFormula: string;
  };
  isRenderedInEditor?: boolean;
}


interface DispatchProps {
}

interface StateProps {
  isVisible?: boolean;
  quantity?: number;
}

type ProductProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface ProductState {
}

export const Product = (props: ProductProps) => {
  const {className, children, attributes, isRenderedInEditor, quantity = 0, isVisible = true} = props;
  const {price, imageUrl, headline} = attributes;

  return (
    <div data-attributes={serializeAttributes(attributes)}
         className={`${className} ${isVisible ? "show" : "hide"}`}>
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
  const quantity = state.tutorial.productQuantities[uuid];
  return {
    isVisible: true,
    quantity,
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

