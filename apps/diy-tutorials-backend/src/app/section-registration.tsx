import React from 'react';
import {Section} from '@diy-tutorials/diy-tutorials-common';
import {appendRawHtmlToCoreBlocks, serializeBlocksData} from './utils';

// @ts-ignore
const {TextControl} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;

console.log("registerBlockType section");
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
registerBlockType('irian/diy-section', {
  // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
  title: 'diy-section', // Block title.
  icon: 'slides', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
  category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
  keywords: [],
  attributes: {
    displayCondition: {
      type: 'string'
    }
  },

  /**
   * The edit function describes the structure of your block in the context of the editor.
   * This represents what the editor will render when the block is used.
   *
   * The "edit" property must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   */
  edit: function (props: any) {
    const {displayCondition} = props.attributes;


    const BLOCKS_TEMPLATE = [
      // ['irian/diy-content'],
      // ['irian/diy-question'],
    ];
    const ALLOWED_BLOCKS = ['irian/diy-content', 'irian/diy-question'];


    return ([
        <BlockControls key='controls'>

        </BlockControls>,
        <InspectorControls key='inspector'>
          <TextControl label="Conditie de afisare"
                       value={displayCondition}
                       onChange={(value) => {
                         props.setAttributes({displayCondition: value});
                       }}/>

        </InspectorControls>,
        <div className={props.className} key='content'>
          <Section>
            <InnerBlocks
              template={BLOCKS_TEMPLATE} templateLock={false}
              allowedBlocks={ALLOWED_BLOCKS}
            />
          </Section>
        </div>
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

    const innerBlocks = appendRawHtmlToCoreBlocks(props.innerBlocks);
    const innerBlocksData = serializeBlocksData(props.innerBlocks);

    return (
      <div className={props.className} key='content'>
        <Section>
          <InnerBlocks.Content></InnerBlocks.Content>
        </Section>
      </div>
    );
  },
});

