import React from 'react';
import {generateUUID, Question} from '@diy-tutorials/diy-tutorials-common';
import {List} from 'immutable';
import {TutorialWpContext} from './tutorial-wp-context';

// @ts-ignore
const {TextControl, Button, SelectControl, TextareaControl, CheckboxControl, IconButton} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls} = window.wp.editor;
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
  title: 'diy-question', // Block title.
  icon: 'forms', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
  category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
  keywords: [],
  attributes: {
    uuid: {type: 'string'},
    name: {type: 'string'},
    type: {type: 'string', default: 'selectOne'},
    displayCondition: {type: 'string'},
    text: {type: 'string'},
    required: {type: 'boolean', default: false},
    optionsJSON: {type: 'string', default: "[{},{}]"}
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
    const {getSectionOptions} = select("diy-tutorial");

    return {
      sectionOptions: getSectionOptions()
    };
  })(
    (props: any) => {
      const {isSelected, attributes, className, setAttributes, name, sectionOptions} = props;
      const {uuid, displayCondition, text, type, required, optionsJSON} = attributes;

      if (!uuid) {
        setAttributes({
          uuid: generateUUID(),
          name: name,
        })
      }

      const options = List(JSON.parse(optionsJSON));


      function updateOptions(index: number, attribute: string, value: string) {
        const newOptions = options.setIn([index, attribute], value);
        setAttributes({optionsJSON: JSON.stringify(newOptions.toJSON())});
      }


      function deleteOption(index: number) {
        if (options.size > 1) {
          const newOptions = options.delete(index);
          setAttributes({optionsJSON: JSON.stringify(newOptions.toJSON())});
        }
      }

      function addOption() {
        const newOptions = options.setIn([options.size], {});
        setAttributes({optionsJSON: JSON.stringify(newOptions.toJSON())});
      }


      return ([
          <BlockControls key='controls'>

          </BlockControls>,
          <InspectorControls key='inspector'>

          </InspectorControls>,
          <Question className={className}
                    attributes={attributes}
                    key='content'
                    isRenderedInEditor={true}>
            {isSelected ?
              <TutorialWpContext.Consumer>
                {(context) => {
                  const sections = context ? context.sections : [];

                  return (
                    <div>
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
                          label="Raspuns obligatoriu"
                          checked={required}
                          onChange={(isChecked) => {
                            props.setAttributes({required: isChecked});
                          }}
                        />
                      </div>

                      {type.startsWith("select") ?
                        <div key={'select'}>

                          {options.map(({value = "", nextSection = ""}, index) => (
                            <div className={"d-flex flex-row"} key={index}>
                              <TextControl
                                placeholder={`Option ${index + 1}`}
                                className={"pr-sm m-0"}
                                key={"option"}
                                value={value}
                                onChange={(newValue) => {
                                  updateOptions(index, "value", newValue);
                                }}/>

                              <SelectControl
                                className={"pr-sm m-0"}
                                key="nextSection"
                                value={nextSection}
                                options={sectionOptions}
                                onChange={(nextSection) => {
                                  updateOptions(index, "nextSection", nextSection);
                                }}
                              />
                              <IconButton
                                className={"py-0 mb-sm"}
                                key="delete"
                                icon="trash"
                                label="Delete" onClick={() => deleteOption(index)}
                              />
                            </div>
                          ))}
                          <Button
                            isLink={true}
                            onClick={() => addOption()}
                          >
                            Add option
                          </Button>
                        </div>
                        : null
                      }


                      <TextControl
                        label="Id"
                        key={"id"}
                        value={uuid}
                        onChange={(value) => {
                          props.setAttributes({uuid: value});
                        }}/>


                      <TextareaControl
                        key={"displayCondition"}
                        label="Conditie de afisare"
                        value={displayCondition}
                        onChange={(value) => {
                          props.setAttributes({displayCondition: value});
                        }}/>


                    </div>
                  );
                }}
              </TutorialWpContext.Consumer>
              :
              <div>
                <TextControl
                  label="Intrebare"
                  key={"question"}
                  value={text}
                  onChange={(value) => {
                    props.setAttributes({text: value});
                  }}/>
              </div>
            }
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
        className={props.className}
        attributes={attributes} key='content'
        isRenderedInEditor={true}
      />
    );
  },
});

