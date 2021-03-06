import React from 'react';
import {generateUUID, Question, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';
import i18n from './i18n/i18n';
import {ShareByEmail} from '../../../../libs/diy-tutorials-common/src/lib/share-by-email/share-by-email';

// @ts-ignore
const {TextControl, Button, SelectControl, TextareaControl, CheckboxControl, IconButton} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;
// @ts-ignore
const {withSelect} = window.wp.data;

console.log("registerBlockType share-by-email");
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
registerBlockType('irian/diy-share-by-email', {
  // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
  title: i18n.shareByEmail.title, // Block title.
  icon: 'forms', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
  category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
  keywords: [],
  attributes: withBaseAttributes({
    description: {type: 'string'}
  }),

  /**
   * The edit function describes the structure of your block in the context of the editor.
   * This represents what the editor will render when the block is used.
   *
   * The "edit" property must be a valid function.
   *
   * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
   */
  edit: withSelect((select, ownProps) => {

    return {};
  })(
    (props: any) => {
      const {isSelected, attributes, className, setAttributes, name} = props;
      const {uuid, description} = attributes;

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
          <ShareByEmail attributes={attributes}
                    key='content'
                    isRenderedInEditor={true}>
            <div>
              <p className={'block-title'}>{i18n.shareByEmail.title}</p>
              <TextControl
                label={i18n.shareByEmail.description}
                key={"description"}
                value={description}
                onChange={(value) => {
                  props.setAttributes({description: value});
                }}/>
            </div>

          </ShareByEmail>
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
    const {attributes} = props;

    return (
      <ShareByEmail
        attributes={attributes} key='content'
        isRenderedInEditor={true}
       >
        <InnerBlocks.Content/>
      </ShareByEmail>
    );
  },
});

