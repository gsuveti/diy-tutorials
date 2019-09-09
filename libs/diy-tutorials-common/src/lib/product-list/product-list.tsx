import React from 'react';
import {connect} from 'react-redux';

import './product-list.scss';
import {serializeAttributes} from '../utils';
import {Block} from '../models/block.model';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {ConnectedProductRange} from '../product-range/product-range';
import {
  loginWithFacebook,
  loginWithGoogle,
  logout,
  selectProductRange,
  sendEmailWithInstructions,
  showProducts,
  TutorialActions
} from '../+state/tutorial.actions';
import {AppState} from '../+state/app.state';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {BlockAttributes} from '../models/block-attributes.model';
import {ConnectedProduct} from '../product/product';
import * as firebase from 'firebase';
import {getProductsToCartLink} from '../+state/selectors/tutorial.selectors';


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
  loginWithGoogle?: typeof loginWithGoogle;
  loginWithFacebook?: typeof loginWithFacebook;
  sendEmailWithInstructions?: typeof sendEmailWithInstructions;
  logout?: typeof logout;
}

interface StateProps {
  user?: firebase.User;
  isVisible?: boolean;
  selectedProductRange?: string;
  optionalProducts?: BlockAttributes[];
  productRanges?: BlockAttributes;
  productRangePrices?: { [uuid: string]: number };
  commonProductsTotalPrice?: number;
  productToCartLink?: string;
}

type ProductListProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface ProductListState {
}

const allowedComponents = {
  'irian/diy-product-range': ConnectedProductRange,
  'irian/diy-product': ConnectedProduct,
};

export class ProductList extends React.Component<ProductListProps, ProductListState> {

  constructor(props) {
    super(props);
  }

  render() {
    const {
      children, innerBlocks, attributes, isVisible = true, productRanges = [],
      isRenderedInEditor, selectProductRange, selectedProductRange, optionalProducts = [],
      user, loginWithGoogle, loginWithFacebook, productRangePrices, commonProductsTotalPrice,
      sendEmailWithInstructions, logout, productToCartLink
    } = this.props;
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
      const isSelected = selectedProductRange === productRange.uuid;

      const total = productRangePrices[productRange.uuid] + commonProductsTotalPrice;

      return (
        <div key={productRange.uuid}
             className={`product-range-summary col-12 col-md-4 border
               ${isSelected ? 'product-range-selected border-primary' : 'border-secondary'}
               ${isRenderedInEditor ? 'px-0' : 'p-md'}
          `}>
          <div className={'d-flex flex-column align-items-center'}>
            <p className={'m-0 pt-xs'}>{productRange.headline}</p>
            <p className={'m-0 '}><strong>{total} lei</strong></p>
            <button type="button" className="btn btn-outline-primary d-flex mt-sm"
                    onClick={() => {
                      selectProductRange(productRange.uuid);
                    }}>
              Selecteaza
            </button>
          </div>

        </div>
      );
    });

    const optionalProductsContent = optionalProducts.map((attributes: any) => {
      return (
        <div className={'optional-products col-sm px-0'} key={attributes.uuid}>
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


              {
                user ?
                  <div className={'d-print-none'}>
                    {
                      user.isAnonymous ?
                        <div className={'mt-xl pt-xl border-top'}>
                          <p>Vrei sa cumperi produsele selectate sau sa primesti instructiounile prim email?
                            Autentifica-te prin una dintre metodele de mai
                            jos!</p>
                          <div className={'d-flex flex-column align-items-center'}>
                            <button type="button" className="mb-sm social-btn btn btn-outline-primary d-flex"
                                    onClick={loginWithGoogle}>
                              Google
                            </button>
                            <button type="button" className="mb-sm social-btn btn btn-outline-primary d-flex"
                                    onClick={loginWithFacebook}>
                              Facebook
                            </button>
                          </div>
                        </div>
                        :
                        <div className={'mt-xl pt-xl border-top d-flex flex-column align-items-center'}>
                          <p>Esti la un click distanta de cumpararea produselor necesare!</p>
                          <a href={productToCartLink} target="_blank" rel="noopener noreferrer"
                             className="mb-xl social-btn btn btn-outline-primary d-flex">
                            Cumpara produsele
                          </a>
                          <p>Vrei sa primesti un email cu instructiunile la adresa {user.email} ?</p>
                          <button type="button" className="mb-sm social-btn btn btn-outline-primary d-flex"
                                  onClick={sendEmailWithInstructions}>
                            Trimite email
                          </button>


                          <button type="button" className="mt-xl btn btn-link" onClick={logout}>
                            <small>Logout</small>
                          </button>
                        </div>
                    }
                  </div>
                  : null
              }

            </div>
        }

      </div>
    );
  }
}


function mapStateToProps(state: AppState, ownProps: ProductListProps, ownState: ProductListState): StateProps {

  return {
    user: state.userContext.user,
    isVisible: state.userContext.showProducts,
    productRanges: state.tutorial.productRanges,
    selectedProductRange: state.userContext.selectedProductRange,
    optionalProducts: state.tutorial.optionalProducts,
    productRangePrices: state.userContext.productRangePrices,
    commonProductsTotalPrice: state.userContext.commonProductsTotalPrice,
    productToCartLink: getProductsToCartLink(state)
  };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
    logout,
    showProducts,
    selectProductRange,
    loginWithGoogle,
    loginWithFacebook,
    sendEmailWithInstructions
  }, dispatch);


export const ConnectedProductList = connect<StateProps, DispatchProps, ProductListProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProductList);
