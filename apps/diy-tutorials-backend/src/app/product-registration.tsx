import React from 'react';
import {initBaseAttributes, Product, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';

// @ts-ignore
const {TextControl, Button, SelectControl, TextareaControl, CheckboxControl, IconButton} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;
// @ts-ignore
const {withSelect} = window.wp.data;

console.log("registerBlockType content");

registerBlockType('irian/diy-product', {
  title: 'Produs',
  icon: 'cart',
  category: 'common',
  keywords: [],
  attributes: withBaseAttributes({
    headline: {type: 'string'},
    imageUrl: {type: 'string'},
    productType: {type: 'string', default: ''},
    price: {type: 'string'},
    quantityFormula: {type: 'string'},
    optional: {type: 'boolean', default: false},
  }),

  edit: withSelect((select, ownProps) => {
    const {getProductRangeOptions} = select("diy-tutorial");
    const {getProductTypeOptions} = select("diy-tutorial");

    return {
      productRangeOptions: getProductRangeOptions(),
      productTypeOptions: getProductTypeOptions()
    };
  })(
    (props: any) => {
      const {setAttributes, attributes, productRangeOptions, productTypeOptions} = props;
      const {headline, imageUrl, price, quantityFormula, productType} = attributes;

      initBaseAttributes(props);

      return ([
          <BlockControls key='controls'>

          </BlockControls>,
          <InspectorControls key='inspector'>


          </InspectorControls>,
          <Product
            isRenderedInEditor={true}
            attributes={attributes}>
            <TextControl
              label="Denumire"
              key={"headline"}
              value={headline}
              onChange={(value) => {
                setAttributes({headline: value});
              }}/>
            <TextControl
              label="URL Imagine"
              key={"imageUrl"}
              value={imageUrl}
              onChange={(value) => {
                setAttributes({imageUrl: value});
              }}/>
            <TextControl
              label="Pret"
              key={"price"}
              value={price}
              onChange={(value) => {
                setAttributes({price: value});
              }}/>
            <TextControl
              label="Formula cantitate"
              key={"quantityFormula"}
              value={quantityFormula}
              onChange={(value) => {
                setAttributes({quantityFormula: value});
              }}/>
            <SelectControl
              className={"pr-sm m-0"}
              key="productType"
              value={productType}
              options={productTypeOptions}
              onChange={(value) => {
                props.setAttributes({productType: value});
              }}
            />
          </Product>
        ]
      );
    }),


  save: function (props: any) {
    const {attributes} = props;

    return (
      <Product
        attributes={attributes}/>
    );
  },
});

