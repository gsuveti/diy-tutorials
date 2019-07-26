import React from 'react';
import {generateUUID, ROOT_ID, Tutorial} from '@diy-tutorials/diy-tutorials-common';

// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {Component} = window.wp.element;
// @ts-ignore
const {BlockControls, InspectorControls, AlignmentToolbar, InnerBlocks} = window.wp.editor;
// @ts-ignore
const {withSelect, withDispatch} = window.wp.data;


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
  })(
    withDispatch((dispatch, ownProps) => {
      const {init} = dispatch('diy-tutorial');
      return {
        init
      };
    })(
      (props) => {
        const {attributes, className, innerBlocks, name, init} = props;
        const {uuid} = attributes;
        init(innerBlocks);

        if (!uuid) {
          props.setAttributes({
            uuid: generateUUID(),
            name: name,
          })
        }

        const BLOCKS_TEMPLATE = [
          ['irian/diy-section'],
          ['irian/diy-product-list']
        ];
        const ALLOWED_BLOCKS = ['irian/diy-section', 'irian/diy-product-list'];


        return ([
            <BlockControls key='controls'>

            </BlockControls>,
            <InspectorControls key='inspector'>

            </InspectorControls>,

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
          ]
        );
      }
    )
  ),

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

