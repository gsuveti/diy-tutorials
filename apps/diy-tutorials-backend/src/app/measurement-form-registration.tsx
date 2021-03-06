import React from 'react';
import {generateUUID, MeasurementForm, withBaseAttributes} from '@diy-tutorials/diy-tutorials-common';
import i18n from './i18n/i18n';

// @ts-ignore
const {TextControl, CheckboxControl, TextareaControl} = wp.components;
// @ts-ignore
const {registerBlockType} = window.wp.blocks;
// @ts-ignore
const {BlockControls, InspectorControls, InnerBlocks} = window.wp.editor;
// @ts-ignore
const {withSelect} = window.wp.data;

console.log("registerBlockType measurement form");
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
registerBlockType('irian/diy-measurement-form', {
    title: i18n.measurementForm.title, // Block title.
    icon: 'layout',
    category: 'common',
    keywords: [],
    attributes: withBaseAttributes({
        headline: {type: 'string'},
        description: {type: 'string'},
        multipleInstances: {type: 'boolean', default: false},
        instancesCountQuestion: {type: 'string', default: "Numar de instante"},
        formula: {type: 'string', default: "A1"},
        required: {type: 'boolean', default: true}
    }),


    edit: withSelect((select, ownProps) => {
        const {getMeasurementFormIndex} = select("diy-tutorial");

        return {
            index: getMeasurementFormIndex(ownProps.attributes.uuid)
        };
    })((props: any) => {
        const {attributes, className, setAttributes, name, index} = props;
        const {multipleInstances, uuid, formula, instancesCountQuestion, headline, description, required} = attributes;

        if (!uuid) {
            props.setAttributes({
                uuid: generateUUID(),
                name: name,
            })
        }

        const BLOCKS_TEMPLATE = [
            ['irian/diy-measurement']
        ];
        const ALLOWED_BLOCKS = ['irian/diy-measurement'];


        return ([
                <BlockControls key='controls'>

                </BlockControls>,
                <InspectorControls key='inspector'>

                </InspectorControls>,
                <MeasurementForm
                    attributes={attributes}
                    isRenderedInEditor={true}
                >
                    <p className={'block-title'}>{`${i18n.measurementForm.title} (M${index + 1})`}</p>
                    <TextControl
                        label="Titlu"
                        key={"headline"}
                        value={headline}
                        onChange={(value) => {
                            props.setAttributes({headline: value});
                        }}/>

                    <TextareaControl
                        label="Descriere"
                        key={"description"}
                        value={description}
                        onChange={(value) => {
                            props.setAttributes({description: value});
                        }}/>

                    <TextControl
                        label="Formula"
                        key={"formula"}
                        value={formula}
                        onChange={(value) => {
                            props.setAttributes({formula: value});
                        }}/>

                    <CheckboxControl
                        key={"multipleInstances"}
                        label="Repeta masuratori"
                        checked={multipleInstances}
                        onChange={(isChecked) => {
                            props.setAttributes({multipleInstances: isChecked});
                        }}
                    />

                    {multipleInstances ?
                        <TextControl
                            label="Intrebare masuratori muliple"
                            key={"instancesCountQuestion"}
                            value={instancesCountQuestion}
                            onChange={(value) => {
                                props.setAttributes({instancesCountQuestion: value});
                            }}/>
                        :
                        null
                    }
                    <CheckboxControl
                        key={"required"}
                        label="Raspuns obligatoriu"
                        checked={required}
                        onChange={(isChecked) => {
                            props.setAttributes({required: isChecked});
                        }}
                    />

                    <InnerBlocks
                        template={BLOCKS_TEMPLATE} templateLock={false}
                        allowedBlocks={ALLOWED_BLOCKS}
                    />
                </MeasurementForm>

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
        const {attributes, className} = props;

        return (
            <MeasurementForm
                attributes={attributes}>
                <InnerBlocks.Content/>
            </MeasurementForm>
        );
    },
});

