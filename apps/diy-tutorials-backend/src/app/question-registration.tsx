import React from 'react';
import {generateUUID, Question, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';
import i18n from './i18n/i18n';

// @ts-ignore
const {TextControl, Button, SelectControl, TextareaControl, CheckboxControl, IconButton} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;
// @ts-ignore
const {withSelect} = window.wp.data;

console.log("registerBlockType question");
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
registerBlockType('irian/diy-question', {
  // Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
  title: i18n.question.title, // Block title.
  icon: 'forms', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
  category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
  keywords: [],
  attributes: withBaseAttributes({
    type: {type: 'string', default: 'selectOne'},
    displayCondition: {type: 'string'},
    text: {type: 'string'},
    required: {type: 'boolean', default: false},
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
      const {uuid, displayCondition, text, type, required} = attributes;

      if (!uuid) {
        setAttributes({
          uuid: generateUUID(),
          name: name,
        })
      }

      const ALLOWED_BLOCKS = [
        'irian/diy-question-option'];

      return ([
          <BlockControls key='controls'>

          </BlockControls>,
          <InspectorControls key='inspector'>

          </InspectorControls>,
          <Question attributes={attributes}
                    key='content'
                    isRenderedInEditor={true}>
            <div>
              <p className={'block-title'}>{i18n.question.title}</p>
              <TextControl
                label="Intrebare"
                key={"question"}
                value={text}
                onChange={(value) => {
                  props.setAttributes({text: value});
                }}/>

              <div>

                <SelectControl
                  key={"type"}
                  label="Tip raspuns"
                  value={type}
                  options={[
                    {label: 'Un raspuns', value: 'selectOne'},
                    {label: 'Raspuns multiplu', value: 'selectMany'},
                    {label: 'Text', value: 'text'},
                    {label: 'Numeric', value: 'numeric'},
                  ]}
                  onChange={(value) => {
                    props.setAttributes({type: value});
                  }}
                />

                <CheckboxControl
                  key={"required"}
                  label="Raspuns obligatoriu"
                  checked={required}
                  onChange={(isChecked) => {
                    props.setAttributes({required: isChecked});
                  }}
                />

              </div>
              <InnerBlocks allowedBlocks={ALLOWED_BLOCKS}/>

            </div>

          </Question>
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
      <Question
        attributes={attributes} key='content'
      >
        <InnerBlocks.Content/>
      </Question>
    );
  },
});

