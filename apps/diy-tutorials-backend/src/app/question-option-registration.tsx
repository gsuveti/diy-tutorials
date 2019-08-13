import React from 'react';
import {initBaseAttributes, QuestionOption, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';
import i18n from './i18n/i18n';

// @ts-ignore
const {TextControl, Button, SelectControl, TextareaControl, CheckboxControl, IconButton} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;
// @ts-ignore
const {withSelect} = window.wp.data;


console.log("registerBlockType question option");

registerBlockType('irian/diy-question-option', {
  title: i18n.questionOption.title,
  icon: 'editor-ul',
  category: 'common',
  keywords: [],
  attributes: withBaseAttributes({
    value: {type: 'string'},
    nextSection: {type: 'string', default: ""},
  }),

  edit: withSelect((select, ownProps) => {
    const {getSectionOptions} = select("diy-tutorial");

    return {
      sectionOptions: getSectionOptions()
    };
  })(
    (props: any) => {
      const {className, attributes, clientId, setAttributes, name, sectionOptions} = props;
      const {uuid, value, nextSection} = attributes;


      initBaseAttributes(props);

      return ([
          <BlockControls key='controls'>
          </BlockControls>,
          <InspectorControls key='inspector'>
          </InspectorControls>,
          <QuestionOption
            key='content'
            attributes={attributes}>
            <p className={'block-title'}>{i18n.questionOption.title}</p>
            <div className={'d-flex'}>
              <TextControl
                placeholder={`Varianta de raspuns`}
                className={"pr-sm m-0"}
                key={"option"}
                value={value}
                onChange={(value) => {
                  setAttributes({value});
                }}/>

              <SelectControl
                className={"pr-sm m-0"}
                key="nextSection"
                value={nextSection}
                options={sectionOptions}
                onChange={(nextSection) => {
                  setAttributes({nextSection});
                }}
              />
            </div>
          </QuestionOption>
        ]
      );
    }),

  save: function (props: any) {
    const {attributes, clientId} = props;

    return (
      <QuestionOption
        attributes={attributes}>
      </QuestionOption>
    );
  },
});

