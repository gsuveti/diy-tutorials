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
    price: number;
    quantityFormula: string;
    optional: boolean;
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
  const {children, attributes, isRenderedInEditor, quantity = 0, isVisible = true} = props;
  const {imageUrl, headline, optional} = attributes;

  return (
    <div data-attributes={serializeAttributes(attributes)}
         className={`product col-12 px-0 ${isVisible ? "show" : "hide"}`}>
      {children}
      {
        isRenderedInEditor ? null :
          <div>
            <div className={'d-flex align-items-baseline'}>
              {
                optional ?
                  <input
                    className="mr-sm"
                    type="checkbox"
                    aria-label="Checkbox for following text input"/>
                  :
                  null
              }
              <p className={'m-0'}>{headline}
                <span className="badge badge-light badge-pill">{quantity} buc</span>
              </p>
            </div>

            <img src={imageUrl}/>
          </div>
      }
    </div>
  );
};


function mapStateToProps(state: AppState, ownProps: ProductProps, ownState: ProductState): StateProps {
  const {attributes} = ownProps;
  const {uuid, productType} = attributes;
  const quantity = state.tutorial.productQuantities[uuid];
  return {
    isVisible: productType ? state.tutorial.displayedProductTypes[productType] : true,
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

