import React from 'react';
import {connect} from 'react-redux';

import './product.scss';
import {serializeAttributes} from '../utils';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {removeProduct, selectProduct, TutorialActions} from '../+state/tutorial.actions';
import {AppState} from '../+state/app.state';

/* tslint:disable:no-empty-interface */
interface OwnProps {
  children?: any;
  attributes?: {
    uuid: string;
    name: string;
    headline: string;
    url: string;
    imageUrl: string;
    productType: string;
    price: number;
    quantityFormula: string;
    optional: boolean;
    externalId: string;
    parentBlockUUID: string;
    defaultOption: string;
  };
  isRenderedInEditor?: boolean;
}


interface DispatchProps {
  selectProduct?: typeof selectProduct;
  removeProduct?: typeof removeProduct;
}

interface StateProps {
  isVisible?: boolean;
  isSelected?: boolean;
  quantity?: number;
}

type ProductProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface ProductState {
}

export class Product extends React.Component<ProductProps, ProductState> {
  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    const {children, attributes, isRenderedInEditor, quantity = 0, isVisible = true, isSelected = false} = this.props;
    const {selectProduct, removeProduct} = this.props;
    const {uuid, imageUrl, url, headline, optional, defaultOption} = attributes;

    const badgeColor = (optional && isSelected) ? 'badge-success' : 'badge-light';
    return (
      <div data-attributes={serializeAttributes(attributes)}
           className={`product pb-md mb-md border-bottom col-12 px-0 ${isVisible ? "show" : "hide"}`}>
        {children}
        {
          isRenderedInEditor ? null :
            <div>
              <div style={{position: 'relative'}}>
                <span className={'m-0'}>
                  <a data-tooltip
                     data-title={headline}
                     title={headline}
                     target="_blank"
                     href={url}
                     className={`product-title`}
                     rel="noopener noreferrer">
                    <span className={'headline'}>{headline}</span>
                  </a>
                  <span className={`product-quantity quantity-badge badge badge-pill ${badgeColor}`}>{quantity} buc</span>
                  {defaultOption?
                    <span className={`badge badge-pill badge-warning`}>Diverse optiuni</span>:null
                  }
                </span>
              </div>
              <div className={'image-wrapper'}>
                <img src={imageUrl}/>
              </div>
              {
                optional ?
                  <div className={'d-flex justify-content-center'}>
                    {
                      isSelected ?
                        <button className={'btn btn-light ml btn-sm d-flex align-items-center'}
                                onClick={() => removeProduct(uuid)}>
                          <i className={'material-icons'}>remove_shopping_cart</i>Scoate din cos
                        </button>
                        :
                        <button className={'btn btn-outline-primary btn-sm d-flex align-items-center'}
                                onClick={() => selectProduct(uuid)}>
                          <i className={'material-icons'}>add_shopping_cart</i>Adauga in cos
                        </button>
                    }
                  </div>
                  :
                  null
              }
            </div>
        }
      </div>
    );
  }
};


function mapStateToProps(state: AppState, ownProps: ProductProps, ownState: ProductState): StateProps {
  const {attributes} = ownProps;
  const {uuid, productType, parentBlockUUID} = attributes;
  const quantity = state.userContext.productQuantities[uuid];
  const {selectedProductRange} = state.userContext;


  return {
    isVisible: productType ? state.userContext.displayedProductTypes[productType] : true,
    isSelected: state.userContext.selectedProducts.indexOf(uuid) > -1,
    quantity,
  };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
    selectProduct,
    removeProduct,
  }, dispatch);


export const ConnectedProduct = connect<StateProps, DispatchProps, ProductProps>(
  mapStateToProps,
  mapDispatchToProps
)(Product);

