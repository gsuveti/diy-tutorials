const {registerBlockType} = wp.blocks;
const {TextControl} = wp.components;

registerBlockType('myguten/meta-block', {
	title: 'Meta Block',
	icon: 'smiley',
	category: 'common',

	attributes: {
		blockValue: {
			type: 'string',
			source: 'meta',
			meta: 'myguten_meta_block_field'
		}
	},

	edit: function (props) {

		function updateBlockValue(blockValue) {
			props.setAttributes({blockValue});
		}

		return (
			<div className={props.className}>
				<TextControl value={props.attributes.blockValue} onChange={updateBlockValue}></TextControl>
			</div>
		);
	},

	// No information saved to the block
	// Data is saved to post meta via attributes
	save: function () {
		return null;
	}
});
