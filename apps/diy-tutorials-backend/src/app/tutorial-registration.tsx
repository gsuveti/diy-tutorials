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


registerBlockType('irian/diy-tutorial', {
  title: 'Tutorial',
  icon: 'info',
  category: 'common',
  keywords: [],
  attributes: {
    uuid: {type: 'string'},
    name: {type: 'string'},
  },

  edit: withSelect((select, ownProps) => {
    const {getCurrentPostId, getBlocks} = select("core/editor");

    return {
      postId: getCurrentPostId(),
      innerBlocks: getBlocks(ownProps.clientId)
    };
  })((props) => {
    const {attributes, className, innerBlocks, name} = props;
    const {uuid} = attributes;

    const sections = innerBlocks.map((block) => block.clientId);

    if (!uuid) {
      props.setAttributes({
        uuid: generateUUID(),
        name: name,
      })
    }

    const BLOCKS_TEMPLATE = [
      ['irian/diy-section']
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
  }),

  save: (props: any) => {
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
  }
});

