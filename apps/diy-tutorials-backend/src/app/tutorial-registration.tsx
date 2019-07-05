import React from 'react';
import {generateUUID, ROOT_ID, Tutorial} from '@diy-tutorials/diy-tutorials-common';
import {TutorialWpContext} from './tutorial-wp-context';

// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {Component} = window.wp.element;
// @ts-ignore
const {BlockControls, InspectorControls, AlignmentToolbar, InnerBlocks} = window.wp.editor;
// @ts-ignore
const {withSelect} = window.wp.data;


console.log("registerBlockType tutorial");

export const tutorialEdit = (props) => {
  const {attributes, className, innerBlocks} = props;
  const {uuid} = attributes;

  const sections = innerBlocks.map(( block) => block.clientId);

  if (!uuid) {
    props.setAttributes({uuid: generateUUID()})
  }

  const BLOCKS_TEMPLATE = [
    ['irian/diy-section', {uuid: 'asd'}]
  ];
  const ALLOWED_BLOCKS = ['irian/diy-section'];


  return ([
      <BlockControls key='controls'>

      </BlockControls>,
      <InspectorControls key='inspector'>

      </InspectorControls>,
      <TutorialWpContext.Provider value={
        {
          sections: sections
        }
      }>
        <Tutorial
          id={ROOT_ID}
          attributes={attributes}
          className={className} key='content'>
          <p>{uuid}</p>
          <InnerBlocks
            template={BLOCKS_TEMPLATE}
            templateLock={false}
            allowedBlocks={ALLOWED_BLOCKS}
          />
        </Tutorial>
      </TutorialWpContext.Provider>
    ]
  );
};

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
registerBlockType('irian/diy-tutorial', {
  // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
  title: 'diy-tutorial', // Block title.
  icon: 'info', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
  category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
  keywords: [],
  attributes: {
    uuid: {type: 'string'}
  },

  /**
   * The edit function describes the structure of your block in the context of the editor.
   * This represents what the editor will render when the block is used.
   *
   * The "edit" property must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   */
  edit: withSelect((select, ownProps) => {
    const {getCurrentPostId, getGlobalBlockCount, getBlocks} = select("core/editor");

    return {
      post_id: getCurrentPostId(),
      block_count: getGlobalBlockCount(),
      innerBlocks: getBlocks(ownProps.clientId)
    };
  })(tutorialEdit),

  /**
   * The save function defines the way in which the different attributes should be combined
   * into the final markup, which is then serialized by Gutenberg into post_content.
   *
   * The "save" property must be specified and must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   */
  save: function (props: any) {
    const {attributes} = props;
    console.log(props);

    return (
      <Tutorial
        id={ROOT_ID}
        className={props.className}
        attributes={attributes}
        key='content'
      >
        <InnerBlocks.Content></InnerBlocks.Content>
      </Tutorial>
    );
  },
});

