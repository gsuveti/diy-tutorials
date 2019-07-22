import React from 'react';
import {generateUUID, MeasurementForm, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';

// @ts-ignore
const {TextControl, CheckboxControl, Toolbar, DropdownMenu} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;

console.log("registerBlockType measurement form");
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
registerBlockType('irian/diy-measurement-form', {
  title: 'Measurement form', // Block title.
  icon: 'layout',
  category: 'common',
  keywords: [],
  attributes: withBaseAttributes({
    formula: {type: 'string', default: "A1"},
  }),


  edit: function (props: any) {
    const {attributes, clientId, setAttributes, name} = props;
    const {submitForm, uuid, formula} = attributes;

    if (!uuid) {
      props.setAttributes({
        uuid: generateUUID(),
        name: name,
      })
    }

    const BLOCKS_TEMPLATE = [
      ['irian/diy-measurement']
    ];
    const ALLOWED_BLOCKS = ['irian/diy-measurement'];

    const controls = [
      {
        icon: `arrow-right-alt`,
        title: `Go next`,
        isActive: !submitForm,
        onClick: () => setAttributes({submitForm: false}),
      }, {
        icon: `external`,
        title: `Submit form`,
        isActive: submitForm,
        onClick: () => setAttributes({submitForm: true}),
      }
    ];


    return ([
        <BlockControls key='controls'>
          <Toolbar controls={controls}>
          </Toolbar>
        </BlockControls>,
        <InspectorControls key='inspector'>

        </InspectorControls>,
        <MeasurementForm
          attributes={attributes}
                         isRenderedInEditor={true}
        >
          <TextControl
            label="Formula"
            key={"formula"}
            value={formula}
            onChange={(value) => {
              props.setAttributes({formula: value});
            }}/>

          <InnerBlocks
            template={BLOCKS_TEMPLATE} templateLock={false}
            allowedBlocks={ALLOWED_BLOCKS}
          />
        </MeasurementForm>

      ]
    );
  },


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
      <MeasurementForm
        attributes={attributes}>
        <InnerBlocks.Content/>
      </MeasurementForm>
    );
  },
});

