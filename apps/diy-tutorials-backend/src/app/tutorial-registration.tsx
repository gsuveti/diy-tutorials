import React from 'react';
import {generateUUID, ROOT_ID, Tutorial} from '@diy-tutorials/diy-tutorials-common';
import {Icon} from './icon';
import i18n from './i18n/i18n';

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
  title: i18n.tutorial.title,
  icon: <Icon iconClassName={'fa fa-list-ol'}/>,
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
              key='content'>

              <p className={'block-title'} key={'tutorial'}>{i18n.tutorial.title}</p>
              <InnerBlocks
                key={'innerBlocks'}
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

    return (
      <Tutorial
        id={ROOT_ID}
        attributes={attributes}
        key='content'
      >
        <InnerBlocks.Content></InnerBlocks.Content>
      </Tutorial>
    );
  }
});

