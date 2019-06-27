import React from 'react';

// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, AlignmentToolbar} = window.wp.editor;

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
    blockTitle: {type: 'string'},
    alignment: {
      type: 'string',
      default: 'none',
    },
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
    const {blockTitle, alignment} = props.attributes;

    function onChangeAlignment(newAlignment) {
      props.setAttributes({alignment: newAlignment === undefined ? 'none' : newAlignment});
    }

    function onTitleChange(value) {
      console.log(value);
      props.setAttributes({blockTitle: value})
    }

    return ([
        <BlockControls key='controls'>
          <AlignmentToolbar value={alignment} onChange={onChangeAlignment}></AlignmentToolbar>
        </BlockControls>,
        <InspectorControls key='inspector'>
          <AlignmentToolbar value={alignment} onChange={onChangeAlignment}></AlignmentToolbar>
        </InspectorControls>,
        <div className={props.className} key='content'>
          <p>Section</p>
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
    console.log(props);


    return (
      <div className={props.className} key='content'>
        <p>Section</p>
      </div>
    );
  },
});

