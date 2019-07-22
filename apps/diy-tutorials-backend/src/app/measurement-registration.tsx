import React from 'react';
import {generateUUID, Measurement, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';

// @ts-ignore
const {TextControl, CheckboxControl, Toolbar, DropdownMenu} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;
// @ts-ignore
const {withSelect} = window.wp.data;

console.log("registerBlockType measurement");
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('irian/diy-measurement', {
  title: 'Measurement', // Block title.
  icon: 'layout',
  category: 'common',
  keywords: [],
  attributes: withBaseAttributes({
    property: {type: 'string'},
  }),


  edit: withSelect((select, ownProps) => {
    const {getMeasurementIndex} = select("diy-tutorial");

    return {
      index: getMeasurementIndex(ownProps.attributes.uuid)
    };
  })((props: any) => {
    const {isSelected, setAttributes, attributes, className, index, name, clientId} = props;
    const {uuid, property} = attributes;


    if (!uuid) {
      setAttributes({
        uuid: generateUUID(),
        name: name,
      })
    }

    return ([
        <BlockControls key='controls'>
        </BlockControls>,
        <InspectorControls key='inspector'>
        </InspectorControls>,
        <Measurement
          isRenderedInEditor={true}
          attributes={attributes}>
          <div>
            <TextControl
              label={`Proprietate masurabila (A${index + 1})`}
              key={"property"}
              value={property}
              onChange={(value) => {
                props.setAttributes({property: value});
              }}/>
          </div>
        </Measurement>

      ]
    );
  }),


  /**
   * The save function defines the way in which the different attributes should be combined
   * into the final markup, which is then serialized by Gutenberg into post_content.
   *
   * The "save" property must be specified and must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   */
  save: function (props: any) {
    const {attributes, clientId} = props;

    return (
      <Measurement
        attributes={attributes}>
      </Measurement>
    );
  },
});

