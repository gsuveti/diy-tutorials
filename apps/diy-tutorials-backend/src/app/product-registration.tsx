import React from 'react';
import {initBaseAttributes, Product, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';
import i18n from './i18n/i18n';

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
  title: i18n.product.title,
  icon: 'cart',
  category: 'common',
  keywords: [],
  attributes: withBaseAttributes({
    externalId: {type: 'string'},
    headline: {type: 'string'},
    url: {type: 'string'},
    imageUrl: {type: 'string'},
    productType: {type: 'string', default: ''},
    price: {type: 'string'},
    quantityFormula: {type: 'string'},
    optional: {type: 'boolean', default: false},
    defaultOption: {type: 'string'}
  }),

  edit: withSelect((select, ownProps) => {
    const {getProductRangeOptions} = select("diy-tutorial");
    const {getProductTypeOptions} = select("diy-tutorial");
    const {isCommonOrOptionalProduct} = select("diy-tutorial");

    return {
      productRangeOptions: getProductRangeOptions(),
      productTypeOptions: getProductTypeOptions(),
      isCommonOrOptionalProduct: isCommonOrOptionalProduct(ownProps.attributes.uuid)
    };
  })(
    (props: any) => {
      const {setAttributes, attributes, productTypeOptions, isCommonOrOptionalProduct} = props;
      const {headline, imageUrl, price, quantityFormula, productType, optional, url, externalId, defaultOption} = attributes;

      initBaseAttributes(props);

      const optionalOptions = [
        {value: false, label: "Produs comun"},
        {value: true, label: "Scula"}
      ];

      return ([
          <BlockControls key='controls'>

          </BlockControls>,
          <InspectorControls key='inspector'>


          </InspectorControls>,
          <Product
            isRenderedInEditor={true}
            attributes={attributes}>
            <p className={'block-title'}>{i18n.product.title}</p>
            <TextControl
              label="Id extern"
              key={"externalId"}
              value={externalId}
              onChange={(value) => {
                setAttributes({externalId: value});
              }}/>
            <TextControl
              label="URL"
              key={"url"}
              value={url}
              onChange={(value) => {
                setAttributes({url: value});
              }}/>
            <TextControl
              label="Denumire"
              key={"headline"}
              value={headline}
              onChange={(value) => {
                setAttributes({headline: value});
              }}/>

            <TextControl
              label="Optiune implicita"
              key={"defaultOption"}
              value={defaultOption}
              onChange={(value) => {
                setAttributes({defaultOption: value});
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
            {
              isCommonOrOptionalProduct ?
                <SelectControl
                  key="optional"
                  label="Produs comun sau scula?"
                  value={optional}
                  options={optionalOptions}
                  onChange={(optional) => {
                    const newValue = optional === "true";
                    setAttributes({optional: newValue});
                  }}
                />
                :
                null
            }
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

