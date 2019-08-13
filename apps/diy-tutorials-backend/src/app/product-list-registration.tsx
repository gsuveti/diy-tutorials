import React from 'react';
import {initBaseAttributes, ProductList, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';
import i18n from './i18n/i18n';

// @ts-ignore
const {TextControl} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;
// @ts-ignore
const {withSelect} = window.wp.data;

console.log("registerBlockType content");

registerBlockType('irian/diy-product-list', {
  title: i18n.productList.title,
  icon: 'slides',
  category: 'common',
  keywords: [],
  attributes: withBaseAttributes({}),

  edit:
    withSelect((select, ownProps) => {
      const {getCurrentPostId, getBlocks} = select("core/editor");
      return {
        postId: getCurrentPostId(),
        innerBlocks: getBlocks(ownProps.clientId)
      };
    })(
      (props: any) => {
        const {className, attributes} = props;
        const ALLOWED_BLOCKS = [
          'irian/diy-product',
          'irian/diy-product-type',
          'irian/diy-product-range'];


        initBaseAttributes(props);

        return ([
            <BlockControls key='controls'>

            </BlockControls>,
            <InspectorControls key='inspector'>


            </InspectorControls>,

            <ProductList
              attributes={attributes}
              isRenderedInEditor={true}>
              <p className={'block-title'}>{i18n.productList.title}</p>
              <InnerBlocks allowedBlocks={ALLOWED_BLOCKS}
              />
            </ProductList>
          ]
        );
      }),

  save: function (props: any) {
    const {attributes} = props;
    return (
      <ProductList attributes={attributes} isRenderedInEditor={true}>
        <InnerBlocks.Content/>
      </ProductList>
    );
  },
});

