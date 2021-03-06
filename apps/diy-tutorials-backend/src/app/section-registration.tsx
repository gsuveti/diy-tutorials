import React from 'react';
import {initBaseAttributes, Section, SUBMIT_FORM, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';
import i18n from './i18n/i18n';

// @ts-ignore
const {Toolbar, SelectControl} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;
// @ts-ignore
const {withSelect} = window.wp.data;


console.log("registerBlockType section");


registerBlockType('irian/diy-section', {
  title: i18n.section.title, // Block title.
  icon: 'layout', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
  category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
  keywords: [],
  attributes: withBaseAttributes({
    nextSection: {type: 'string', default: ''},
    submitForm: {type: 'boolean', default: false}
  }),


  edit: withSelect((select, ownProps) => {
    const {getSectionIndex, getSectionOptions} = select("diy-tutorial");

    return {
      index: getSectionIndex(ownProps.attributes.uuid),
      sectionOptions: [
        {value: "", label: "-- Urmatoarea sectiune --"},
        ...getSectionOptions(),
        {value: SUBMIT_FORM, label: "Sectiunea de produse"}
      ]
    };
  })(
    (props: any) => {
      const {attributes, clientId, setAttributes, name, sectionOptions, index} = props;
      const {uuid, submitForm, nextSection} = attributes;

      initBaseAttributes(props);

      const BLOCKS_TEMPLATE = [
        ['irian/diy-content'],
        ['irian/diy-question']
      ];
      const ALLOWED_BLOCKS = [
        'irian/diy-content',
        'irian/diy-question',
        'irian/diy-measurement-form',
        'irian/diy-share-by-email'
      ];


      return ([
          <BlockControls key='controls'>
          </BlockControls>,
          <InspectorControls key='inspector'>
          </InspectorControls>,
          <Section
            key='content'
            clientId={clientId}
            attributes={attributes}
            isRenderedInEditor={true}
          >
            <div>
              <p className={'block-title'}>{i18n.section.title} {`(${index + 1})`}</p>
              <SelectControl
                key="nextSection"
                label="Ce se afiseaza dupa aceasta sectiune?"
                value={nextSection}
                options={sectionOptions}
                onChange={(section) => {
                  setAttributes({nextSection: section, submitForm: section === SUBMIT_FORM});
                }}
              />
              <InnerBlocks
                key={'innerBlocks'}
                template={BLOCKS_TEMPLATE} templateLock={false}
                allowedBlocks={ALLOWED_BLOCKS}
              />
            </div>
          </Section>

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
    const {attributes, clientId} = props;

    return (
      <Section
        key='content'
        clientId={clientId}
        attributes={attributes}>
        <InnerBlocks.Content></InnerBlocks.Content>
      </Section>
    );
  },
});

