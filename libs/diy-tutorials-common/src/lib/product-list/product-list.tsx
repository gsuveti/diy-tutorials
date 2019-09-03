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
  selectProductRange,
  sendEmailWithInstructions,
  showProducts,
  TutorialActions
} from '../tutorial/+state/tutorial.actions';
import {AppState} from '../store';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {BlockAttributes} from '../models/block-attributes.model';
import {ConnectedProduct} from '../product/product';
import * as firebase from 'firebase';


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
}

interface StateProps {
  user?: firebase.User;
  isVisible?: boolean;
  selectedProductRange?: string;
  optionalProducts?: BlockAttributes[];
  productRanges?: BlockAttributes;
  productsByProductRange?: BlockAttributes;
  productRangePrices?: { [uuid: string]: number };
  commonProductsTotalPrice?: number;
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
      isRenderedInEditor, selectProductRange, selectedProductRange, productsByProductRange, optionalProducts = [],
      user, loginWithGoogle, loginWithFacebook, productRangePrices, commonProductsTotalPrice, sendEmailWithInstructions
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
            <p className={'m-0 pt-xs'}>{productRange.headline}: {total} lei</p>
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


              {
                user ?
                  <div className={'d-print-none'}>
                    {
                      user.isAnonymous ?
                        <div className={'mt-xl pt-xl border-top'}>
                          <p>Vrei sa descarci tutorialul in format pdf? Autentifica-te prin una dintre metodele de mai
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
                          <p>Vrei sa primesti un email cu instructiunile la adresa {user.email} ?</p>
                          <button type="button" className="mb-sm social-btn btn btn-outline-primary d-flex"
                                  onClick={sendEmailWithInstructions}>
                            Trimite email
                          </button>

                          {/*<button type="button" className="mt-xl btn btn-link" onClick={logout}>*/}
                          {/*Logout*/}
                          {/*</button>*/}
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
    user: state.tutorial.user,
    isVisible: state.tutorial.showProducts,
    productRanges: state.tutorial.productRanges,
    selectedProductRange: state.tutorial.selectedProductRange,
    optionalProducts: state.tutorial.optionalProducts,
    productRangePrices: state.tutorial.productRangePrices,
    commonProductsTotalPrice: state.tutorial.commonProductsTotalPrice,
  };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
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
