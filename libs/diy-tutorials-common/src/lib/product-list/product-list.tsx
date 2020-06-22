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
    sendEmailWithProducts,
    showProducts,
    toggleShowProductsForAllProductRanges,
    TutorialActions
} from '../+state/tutorial.actions';
import {AppState} from '../+state/app.state';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {BlockAttributes} from '../models/block-attributes.model';
import {ConnectedProduct} from '../product/product';
import {getProductsToCartLink} from '../+state/selectors/tutorial.selectors';
import {UserState} from '../+state/user.reducer';
import AuthenticationSection from '../authentication-section/authentication-section';
import {ButtonBack, ButtonNext, CarouselProvider, Slide, Slider} from 'pure-react-carousel';


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
    loginWithGoogle?: typeof loginWithGoogle;
    loginWithFacebook?: typeof loginWithFacebook;
    sendEmailWithProducts?: typeof sendEmailWithProducts;
    logout?: typeof logout;
    resetUserContext?: typeof resetUserContext;
    toggleShowProductsForAllProductRanges?: typeof toggleShowProductsForAllProductRanges;
}

interface StateProps {
    user?: UserState;
    isVisible?: boolean;
    optionalProducts?: BlockAttributes[];
    productToCartLink?: string;
    emailMessage?: any;
    expandAllProductRanges?: boolean;
    selectedProductRange?: string;
}

type ProductListProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface ProductListState {
    buyButtonPressed: boolean
}

const allowedComponents = {
    'irian/diy-product-range': ConnectedProductRange,
    'irian/diy-product': ConnectedProduct,
};

export class ProductList extends React.Component<ProductListProps, ProductListState> {

    constructor(props) {
        super(props);
        this.state = {
            buyButtonPressed: false
        }
    }

    render() {
        const {
            children, innerBlocks, attributes, isVisible = true,
            isRenderedInEditor, optionalProducts = [],
            toggleShowProductsForAllProductRanges, expandAllProductRanges,
            selectedProductRange,
            user, sendEmailWithProducts, logout, productToCartLink, resetUserContext, emailMessage
        } = this.props;
        const {buyButtonPressed} = this.state;

        const content = children ?
            children
            :
            <InnerBlocksContent
                innerBlocks={innerBlocks}
                allowedComponents={allowedComponents}
            />
        ;

        const slides = optionalProducts.map((attributes: any, index: number) => {
            return (
                <Slide key={index} index={index}>
                    <div className={'optional-product p-1'} key={attributes.uuid}>
                        <div className={'shadow-sm rounded p-sm'}>
                            <ConnectedProduct
                                attributes={attributes}
                            />
                        </div>
                    </div>
                </Slide>
            );
        });

        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const visibleSlides = vw >= 768 ? 3.5 : 1.5;
        const dragStep = vw >= 768 ? 2 : 1;

        return ([
            <div
                className={`product-list row mx-n1 ${isVisible ? "show" : "hide"} ${isRenderedInEditor ? 'flex-column' : ''}`}
                data-attributes={serializeAttributes(attributes)}
                key='product-list'>
                {content}
                {
                    isRenderedInEditor ? null :
                        [
                            <div key={'toggle-show-products'}
                                 className={`d-none d-md-flex flex-grow-1 row no-gutters justify-content-center`}>
                                <button type="button"
                                        className="mt-md btn btn-outline-dark"
                                        onClick={() => {
                                            toggleShowProductsForAllProductRanges();
                                        }}>
                                    {expandAllProductRanges ? 'Ascunde detalii pachete' : 'Detalii pachete'}
                                </button>
                            </div>,
                            <div id={`optional-products`} key={`optional-products`}
                                 className={'optional-products col-12 px-1'}>
                                {
                                    optionalProducts.length ?
                                        [
                                            <h4 key={'optional-products-headline'}
                                                className={'optional-products-headline mt-lg mb-sm'}>Produse
                                                opționale</h4>,
                                            <div key={'optional-products-content'}
                                                 className={'optional-products-content'}>

                                                <CarouselProvider
                                                    visibleSlides={visibleSlides}
                                                    dragStep={dragStep}
                                                    naturalSlideWidth={100}
                                                    naturalSlideHeight={150}
                                                    totalSlides={optionalProducts.length}
                                                >
                                                    <ButtonBack>
                                                        <i className={'material-icons'}>navigate_before</i>
                                                    </ButtonBack>
                                                    <Slider style={{height: '300px'}}>
                                                        {slides}
                                                    </Slider>
                                                    <ButtonNext>
                                                        <i className={'material-icons'}>navigate_next</i>
                                                    </ButtonNext>
                                                </CarouselProvider>
                                            </div>
                                        ] : null
                                }
                            </div>,
                            <div key={'actions'} className={`col-12 px-1`}>
                                {
                                    user ?
                                        <div className={'d-print-none'}>
                                            {
                                                (user.isAnonymous && !user.email) ?
                                                    <AuthenticationSection></AuthenticationSection> :

                                                    <div
                                                        className={'authenticated-user-actions mt-xl pt-xl border-top d-flex flex-column align-items-center'}>
                                                        <p className={`buy-description`}>
                                                            <strong>
                                                                Apasă "Adaugă în coș" și te vom
                                                                redirecționa către un magazin unde vor apărea deja
                                                                produsele
                                                                selectate în coșul de cumpărături. Pe site-ul
                                                                partenerului
                                                                nostru vei putea finaliza comanda.
                                                            </strong>
                                                        </p>
                                                        <a href={productToCartLink}
                                                           target="_blank"
                                                           rel="noopener noreferrer"
                                                           className={`buy-action wide-btn btn btn-primary text-light ` + (selectedProductRange ? 'd-flex' : 'd-none')}>
                                                            Adaugă în coș
                                                        </a>
                                                        <button
                                                            onClick={() => {
                                                                this.setState({buyButtonPressed: true})
                                                            }}
                                                            className={`buy-action mb-sm wide-btn btn btn-primary text-light ` + (!selectedProductRange ? 'd-flex' : 'd-none')}>
                                                            Adaugă în coș
                                                        </button>
                                                        {(buyButtonPressed && !selectedProductRange) ?
                                                            <p className={`mb-0 pb-0 text-danger`}>
                                                                <small>Selecteza un pachet de produse!</small>
                                                            </p> : null
                                                        }

                                                        <p className={`notify-description mt-xl `}>
                                                            <strong>
                                                                Vrei să primești un email cu lista de produse la
                                                                adresa {user.email} ?
                                                            </strong>
                                                        </p>
                                                        <button type="button"
                                                                className="notify-action mb-sm social-btn btn btn-primary text-light d-flex"
                                                                onClick={sendEmailWithProducts}>
                                                            Trimite email
                                                        </button>

                                                        {emailMessage ?
                                                            <p className={`email-success-message text-${emailMessage.severity}`}>
                                                                <small>{emailMessage.text}</small>
                                                            </p> : null
                                                        }

                                                    </div>
                                            }
                                        </div>
                                        : null
                                }
                            </div>
                        ]
                }

            </div>,
            <div key='reset-or-logout'>
                {
                    isRenderedInEditor ? null :
                        <div className={'user-context-actions mt-xl pt-xl w-100 d-flex justify-content-center'}>
                            <button type="button" className="btn-reset btn btn-link" onClick={resetUserContext}>
                                <small>Resetare</small>
                            </button>
                            {(user.uid && (!user.isAnonymous || user.email)) ?
                                [
                                    <div key="border" className={'my-xs border-right'}></div>,
                                    <button key="logout" type="button" className="btn-logout btn btn-link"
                                            onClick={logout}>
                                        <small>Logout</small>
                                    </button>
                                ] : null
                            }
                        </div>

                }
            </div>
        ]);
    }
}


function mapStateToProps(state: AppState, ownProps: ProductListProps, ownState: ProductListState): StateProps {

    return {
        user: state.user,
        emailMessage: state.userContext.emailMessage,
        isVisible: state.userContext.showProducts,
        optionalProducts: state.tutorial.optionalProducts,
        productToCartLink: getProductsToCartLink(state),
        expandAllProductRanges: state.userContext.expandAllProductRanges,
        selectedProductRange: state.userContext.selectedProductRange
    };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
    bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
        logout,
        resetUserContext,
        showProducts,
        loginWithGoogle,
        loginWithFacebook,
        sendEmailWithProducts,
        toggleShowProductsForAllProductRanges
    }, dispatch);

export const ConnectedProductList = connect<StateProps, DispatchProps, ProductListProps>(
    mapStateToProps,
    mapDispatchToProps
)(ProductList);
