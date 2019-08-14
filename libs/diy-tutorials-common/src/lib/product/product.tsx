import React from 'react';
import {connect} from 'react-redux';

import './product.scss';
import {serializeAttributes} from '../utils';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {removeProduct, selectProduct, TutorialActions} from '../tutorial/+state/tutorial.actions';
import {AppState} from '../store';

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
    this.onProductClicked = this.onProductClicked.bind(this)
  }

  onProductClicked(event) {
    const {selectProduct, removeProduct, attributes} = this.props;
    const {uuid} = attributes;

    const isChecked = event.currentTarget.checked;
    if (isChecked) {
      selectProduct(uuid);
    } else {
      removeProduct(uuid);
    }
  }

  render() {
    const {children, attributes, isRenderedInEditor, quantity = 0, isVisible = true, isSelected = false} = this.props;
    const {uuid, imageUrl, url, headline, optional} = attributes;


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
                      aria-label="Checkbox for following text input"
                      checked={isSelected}
                      onChange={this.onProductClicked}
                    />
                    :
                    null
                }
                <p className={'m-0'}>
                  <a target="_blank" href={url}>{headline}</a>
                  <span className="badge badge-light badge-pill">{quantity} buc</span>
                </p>
              </div>
              <img src={imageUrl}/>
            </div>
        }
      </div>
    );
  }
};


function mapStateToProps(state: AppState, ownProps: ProductProps, ownState: ProductState): StateProps {
  const {attributes} = ownProps;
  const {uuid, productType} = attributes;
  const quantity = state.tutorial.productQuantities[uuid];
  return {
    isVisible: productType ? state.tutorial.displayedProductTypes[productType] : true,
    isSelected: state.tutorial.selectedProducts.indexOf(uuid) > -1,
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

