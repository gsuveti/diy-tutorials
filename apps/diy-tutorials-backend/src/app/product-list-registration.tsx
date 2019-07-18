import React from 'react';
import {ProductList} from '@diy-tutorials/diy-tutorials-common';

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
  title: 'diy-product-list',
  icon: 'slides',
  category: 'common',
  keywords: [],
  attributes: {},

  edit:
    withSelect((select, ownProps) => {
      const {getCurrentPostId, getBlocks} = select("core/editor");
      return {
        postId: getCurrentPostId(),
        innerBlocks: getBlocks(ownProps.clientId)
      };
    })(
      (props: any) => {
        const {innerBlocks} = props;
        const ALLOWED_BLOCKS = ['irian/diy-product-type', 'irian/diy-product-range'];

        const productRangeList = innerBlocks
          .filter(block => block.name === 'irian/diy-product-range')
          .map(block => {
            return {
              clientId: block.clientId,
              headline: block.attributes.headline,
            }
          });

        return ([
            <BlockControls key='controls'>

            </BlockControls>,
            <InspectorControls key='inspector'>


            </InspectorControls>,

            <ProductList>
              {JSON.stringify(productRangeList)}
              <InnerBlocks allowedBlocks={ALLOWED_BLOCKS}
              />
            </ProductList>
          ]
        );
      }),

  save: function (props: any) {
    return (
      <ProductList>
        <InnerBlocks.Content/>
      </ProductList>
    );
  },
});

