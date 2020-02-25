import React from 'react';
import {generateUUID, ROOT_ID, Tutorial} from '@diy-tutorials/diy-tutorials-common';
import {Icon} from './icon';
import i18n from './i18n/i18n';

// @ts-ignore
const {registerBlockType, createBlock} = window.wp.blocks;
// @ts-ignore
const {Component} = window.wp.element;
// @ts-ignore
const {BlockControls, InspectorControls, AlignmentToolbar, InnerBlocks} = window.wp.editor;
// @ts-ignore
const {Button, Text} = window.wp.components;
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
      const {replaceBlock} = dispatch('core/block-editor');

      return {
        init,
        replaceBlock
      };
    })(
      (props) => {
        const {attributes, innerBlocks, name, init, replaceBlock} = props;
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

        const recoverBlock = ({name, attributes, innerBlocks}) =>
          createBlock(name, attributes, innerBlocks);

        const attemptBlockRecovery = (innerBlocks) => {

          innerBlocks.map(
            block => {
              if (block.innerBlocks) {
                attemptBlockRecovery(block.innerBlocks)
              }
              if (!block.isValid) {
                console.log(`attempting block recovery for clientId: ${block.clientId}`);
                replaceBlock(block.clientId, recoverBlock(block));
              }
            }
          );
        };

        return ([
            <BlockControls key='controls'>

            </BlockControls>,
            <InspectorControls key='inspector'>
              <hr/>
              <p>Recover all invalid blocks</p>
              <Button isPrimary
                      onClick={() => attemptBlockRecovery(innerBlocks)}
              >
                Attempt blocks recovery
              </Button>
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

