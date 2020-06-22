import React from 'react';
import {connect} from 'react-redux';

import './product-range.scss';
import {serializeAttributes} from '../utils';
import {ConnectedProduct} from '../product/product';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {Block} from '../models/block.model';
import {
    addProductsToCart,
    selectProductRange,
    showProductsForProductRange,
    TutorialActions
} from '../+state/tutorial.actions';
import {AppState} from '../+state/app.state';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {BlockAttributes} from '../models/block-attributes.model';

/* tslint:disable:no-empty-interface */
export interface OwnProps {
    attributes?: {
        uuid: string;
        name: string;
        headline: string;
        description: string;
        imageUrl: string;
    };
    children?: any;
    isRenderedInEditor?: boolean;
    innerBlocks?: Block[];
}

interface DispatchProps {
    addProductsToCart?: typeof addProductsToCart,
    selectProductRange?: typeof selectProductRange
    showProductsForProductRange?: typeof showProductsForProductRange
}

interface StateProps {
    commonProducts?: BlockAttributes[];
    isSelected?: boolean;
    productRangePrices?: { [uuid: string]: number };
    commonProductsTotalPrice?: number;
    showProducts?: boolean;
}

export type ProductRangeProps = StateProps & DispatchProps & OwnProps;


interface ProductRangeState {
}

const allowedComponents = {
    'irian/diy-product': ConnectedProduct,
};

export const ProductRange = (props: ProductRangeProps, state: ProductRangeState) => {
    const {children, innerBlocks, attributes, isRenderedInEditor, commonProducts = []} = props;
    const {isSelected, selectProductRange, showProductsForProductRange, showProducts} = props;

    const {productRangePrices, commonProductsTotalPrice} = props;
    const {headline, imageUrl, description, uuid} = attributes;

    const total = productRangePrices[uuid] + commonProductsTotalPrice;


    const commonProductsContent = commonProducts.map((attributes: any) => {
        return <ConnectedProduct key={attributes.uuid}
                                 attributes={attributes}
        />;
    });

    const content = children ?
        children
        :
        <div className={
            ` ${isRenderedInEditor ? '' : 'product-range-content rounded pt-sm px-sm'}
          ${isSelected ? 'border border-secondary' : ''}
        `
        }>
            {
                isRenderedInEditor ? null :
                    <div>
                        <h4 className={`product-range-headline text-center`}>{headline}</h4>
                        <div
                            className={`product-range-image`}
                            style={{['--background' as any]: 'url(' + imageUrl + ') '}}>
                        </div>

                        <div className={`product-range-details mx-nsm p-sm`}>
                            <p className={`product-range-description pt-md`}>{description}</p>
                            <div key={uuid}
                                 className={`product-range-summary`}>
                                <div className={'d-flex flex-column'}>
                                    <p className={'mb-0 pb-0 text-center'}>
                                        <strong>Prețul pentru proiectul tău:</strong>
                                    </p>
                                    <p className={'mb-sm text-center'}>
                                        <strong>{total} lei</strong>
                                    </p>
                                    <div className={`row`}>
                                        <div className={`col-12 col-sm-6 col-md-12`}>
                                            <div className={`row no-gutters`}>
                                                <button type="button"
                                                        className="btn btn-primary col-12 d-flex align-items-center justify-content-center pt-xs px-sm my-xs"
                                                        onClick={() => {
                                                            selectProductRange(uuid);
                                                        }}>
                                                    <i className={'material-icons mr-xs'}>add_shopping_cart</i>Selectează pachet
                                                </button>
                                            </div>
                                        </div>
                                        <div className={`col-12 col-sm-6 d-md-none`}>
                                            <div className={`row no-gutters`}>
                                                <button type="button"
                                                        className="btn btn-outline-dark col-12 py-xs px-sm my-xs"
                                                        onClick={() => {
                                                            showProductsForProductRange(uuid);
                                                        }}>
                                                    Detalii pachet
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
            }

            <div className={`mt-md ` + (showProducts ? `d-flex flex-column` : `d-none`)}>
                <InnerBlocksContent
                    innerBlocks={innerBlocks}
                    allowedComponents={allowedComponents}
                />

                {commonProductsContent}
            </div>
        </div>
    ;


    return (
        <div
            className={`product-range
          ${isSelected ? 'product-range-selected' : ''}
          ${isRenderedInEditor ? 'px-0' : 'col-12 col-md-4 px-1 pt-md'}
              `}
            data-attributes={serializeAttributes(attributes)}>

            {content}
        </div>
    );
};


function mapStateToProps(state: AppState, ownProps: ProductRangeProps, ownState: ProductRangeState): StateProps {
    const {uuid} = ownProps.attributes;
    const {expandAllProductRanges, expandedProductRanges} = state.userContext;
    const showProducts = expandAllProductRanges || (expandedProductRanges ? expandedProductRanges[uuid] : false);
    return {
        commonProducts: state.tutorial.commonProducts,
        isSelected: state.userContext.selectedProductRange === uuid,
        productRangePrices: state.userContext.productRangePrices,
        commonProductsTotalPrice: state.userContext.commonProductsTotalPrice,
        showProducts
    };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
    bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
        addProductsToCart,
        selectProductRange,
        showProductsForProductRange
    }, dispatch);


export const ConnectedProductRange = connect<StateProps, DispatchProps, ProductRangeProps>(
    mapStateToProps,
    mapDispatchToProps
)(ProductRange);
