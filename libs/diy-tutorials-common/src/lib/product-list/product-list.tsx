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
  resetUserContext,
  selectProductRange,
  sendEmailWithInstructions,
  showProducts,
  TutorialActions
} from '../+state/tutorial.actions';
import {AppState} from '../+state/app.state';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {BlockAttributes} from '../models/block-attributes.model';
import {ConnectedProduct} from '../product/product';
import {getProductsToCartLink} from '../+state/selectors/tutorial.selectors';
import {UserState} from '../+state/user.reducer';


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
  resetUserContext?: typeof resetUserContext;
}

interface StateProps {
  user?: UserState;
  isVisible?: boolean;
  selectedProductRange?: string;
  optionalProducts?: BlockAttributes[];
  productRanges?: BlockAttributes;
  productRangePrices?: { [uuid: string]: number };
  commonProductsTotalPrice?: number;
  productToCartLink?: string;
  emailMessage?: any;
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
      sendEmailWithInstructions, logout, productToCartLink, resetUserContext, emailMessage
    } = this.props;

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
             className={`product-range-summary col-12 col-md-4
               ${isRenderedInEditor ? 'px-0' : 'p-1'}
          `}>
          <div className={'d-flex flex-column align-items-center'}>
            <p className={'m-0 pt-xs'}>{productRange.headline}</p>
            <p className={'m-0 '}><strong>{total} lei</strong></p>
            <button type="button" className="btn btn-primary text-light d-flex mt-sm pt-xs px-lg"
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
        <div className={'optional-product col-12 col-md-4 p-1'} key={attributes.uuid}>
          <div className={'shadow rounded p-sm'}>
            <ConnectedProduct
              attributes={attributes}
            />
          </div>
        </div>
      );
    });


    return (
      <div
        className={`product-list row mx-n1 ${isVisible ? "show" : "hide"} ${isRenderedInEditor ? 'flex-column' : ''}`}
        data-attributes={serializeAttributes(attributes)}>
        {content}
        {
          isRenderedInEditor ? null :
            [
              <div key={`optional-products`} className={'optional-products col-12 px-1'}>
                <div className={'row mx-n1'}>
                  {productRangesSummary}
                </div>

                <h4 className={'optional-products-headline mt-lg mb-sm'}>Produse optionale</h4>

                <div className={'row mx-n1'}>
                  {optionalProductsContent}
                </div>
              </div>,
              <div key={'actions'} className={`col-12 px-1`}>
                {
                  user ?
                    <div className={'d-print-none'}>
                      {
                        user.isAnonymous ?
                          <div className={'social-login mt-xl pt-xl border-top'}>
                            <p className={`social-login-description`}>Vrei sa cumperi produsele selectate sau sa
                              primesti prin email o lista cu ele?
                              Autentifica-te prin una dintre metodele de mai jos!</p>
                            <div className={'d-flex flex-column align-items-center'}>
                              <button type="button"
                                      className="social-btn-google mb-sm social-btn btn btn-primary text-light text-light d-flex"
                                      onClick={loginWithGoogle}>
                                Google
                              </button>
                              <button type="button"
                                      className="social-btn-facebook mb-sm social-btn btn btn-primary text-light d-flex"
                                      onClick={loginWithFacebook}>
                                Facebook
                              </button>
                            </div>
                          </div>
                          :
                          <div
                            className={'authenticated-user-actions mt-xl pt-xl border-top d-flex flex-column align-items-center'}>
                            <p className={`buy-description`}>Esti la un click distanta de cumpararea produselor
                              necesare!</p>
                            <a href={productToCartLink} target="_blank" rel="noopener noreferrer"
                               className="buy-action mb-xl social-btn btn btn-primary text-light d-flex">
                              Cumpara produsele
                            </a>
                            <p className={`notify-description`}>Vrei sa primesti un email cu instructiunile la
                              adresa {user.email} ?</p>
                            <button type="button"
                                    className="notify-action mb-sm social-btn btn btn-primary text-light d-flex"
                                    onClick={sendEmailWithInstructions}>
                              Trimite email
                            </button>

                            {emailMessage ?
                              <p className={`email-success-message text-${emailMessage.severity}`}>
                                <small>{emailMessage.text}</small>
                              </p> : null
                            }


                            <div className={'user-context-actions mt-xl pt-xl w-100 d-flex justify-content-center'}>
                              <button type="button" className="btn-reset btn btn-link" onClick={resetUserContext}>
                                <small>Resetare</small>
                              </button>
                              <div className={'my-xs border-right'}></div>
                              <button type="button" className="btn-logout btn btn-link" onClick={logout}>
                                <small>Logout</small>
                              </button>
                            </div>
                          </div>
                      }
                    </div>
                    : null
                }
              </div>
            ]
        }

      </div>
    );
  }
}


function mapStateToProps(state: AppState, ownProps: ProductListProps, ownState: ProductListState): StateProps {

  return {
    user: state.user,
    emailMessage: state.userContext.emailMessage,
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
    resetUserContext,
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
