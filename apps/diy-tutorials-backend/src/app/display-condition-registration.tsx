import React from 'react';
import {DisplayCondition, generateUUID, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';

// @ts-ignore
const {Toolbar, SelectControl} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;
// @ts-ignore
const {withSelect} = window.wp.data;


console.log("registerBlockType display condition");

registerBlockType('irian/diy-display-condition', {
  title: 'Conditie de afisare',
  icon: 'admin-settings',
  category: 'common',
  keywords: [],
  attributes: withBaseAttributes({
    question: {type: 'string'},
    condition: {type: 'string', default: "eq"},
    response: {type: 'string'}
  }),

  edit: withSelect((select, ownProps) => {
    const {getQuestionOptions} = select("diy-tutorial");

    return {
      questionOptions: getQuestionOptions()
    };
  })(
    (props: any) => {
      const {attributes, clientId, setAttributes, name, index, questionOptions, className} = props;
      const {uuid, submitForm, question, response} = attributes;


      if (!uuid) {
        props.setAttributes({
          uuid: generateUUID(),
          name: name,
        })
      }


      const responseOptions = question ? questionOptions.find(option => option.value === question).options : [];

      return ([
          <BlockControls key='controls'>
          </BlockControls>,
          <InspectorControls key='inspector'>
          </InspectorControls>,
          <DisplayCondition key='content'
                            className={className}
                            attributes={attributes}
          >
            <div className={'d-flex'}>
              <SelectControl
                className={"pr-sm m-0"}
                key="question"
                value={question}
                options={questionOptions}
                onChange={(question) => {
                  setAttributes({question: question, response: "null"});
                }}
              />
              <SelectControl
                className={"pr-sm m-0"}
                key="response"
                value={response}
                options={responseOptions}
                onChange={(response) => {
                  setAttributes({response});
                }}
              />
            </div>

          </DisplayCondition>
        ]
      );
    }),

  save: function (props: any) {
    const {attributes} = props;

    return (
      <DisplayCondition
        attributes={attributes}>
      </DisplayCondition>
    );
  },
});

