// @ts-ignore
import {BlockNames, filterBlocksByName, getBlockAttributesList} from '@diy-tutorials/diy-tutorials-common';
// @ts-ignore
const {registerStore} = window.wp.data;

const DEFAULT_STATE = {
  blocks: [],
  sectionsOrder: [],
  sectionOptions: [],
  productRangeOptions: [],
  productTypeOptions: [],
  measurementFormsOrder: [],
  measurementsOrder: {}
};

export const actions = {

  init(blocks) {
    return {
      type: 'INIT',
      blocks,
    };
  }
};

registerStore('diy-tutorial', {
  reducer(state = DEFAULT_STATE, action) {
    switch (action.type) {
      case 'INIT':

        const {blocks} = action;

        const blockAttributesList = getBlockAttributesList(blocks);
        const sections = filterBlocksByName(blockAttributesList, BlockNames.Section);

        const sectionsOrder = sections.map(attributes => attributes.uuid);
        const sectionOptions = [{value: "null", label: "Next section"}].concat(
          sections.map((attributes, index) => {
            return {
              value: attributes.uuid,
              label: `Section ${index + 1}`
            };
          })
        );

        const measurementFormsOrder = filterBlocksByName(blockAttributesList, BlockNames.MeasurementForm)
          .map(attributes => attributes.uuid);

        const measurementsOrder = filterBlocksByName(blockAttributesList, BlockNames.Measurement)
          .reduce((acc, block) => {
            const index = acc.parentBlockUUID === block.parentBlockUUID ? acc.index + 1 : 0;
            const orders = {
              ...acc.orders,
              [block.uuid]: index
            };

            return {
              orders,
              parentBlockUUID: block.parentBlockUUID,
              index,
            };
          }, {orders: {}, parentBlockUUID: null, index: 0})
          .orders;


        const productRanges = filterBlocksByName(blockAttributesList, BlockNames.ProductRange);
        const productRangeOptions = [{value: "null", label: "Fara gama"}].concat(
          productRanges.map(attributes => {
            return {
              value: attributes.uuid,
              label: attributes.headline
            };
          })
        );

        const productTypes = filterBlocksByName(blockAttributesList, BlockNames.ProductType);
        const productTypeOptions = [{value: "null", label: "Fara tip"}].concat(
          productTypes.map(attributes => {
            return {
              value: attributes.uuid,
              label: attributes.headline
            };
          })
        );

        return {
          ...state,
          blocks: blockAttributesList,
          sectionsOrder,
          measurementFormsOrder,
          measurementsOrder,
          sectionOptions,
          productRangeOptions,
          productTypeOptions
        };
    }

    return state;
  },

  actions,

  selectors: {
    getSectionIndex(state, clientId) {
      const {sectionsOrder} = state;
      return sectionsOrder.indexOf(clientId);
    },

    getMeasurementIndex(state, clientId) {
      const {measurementsOrder} = state;
      return measurementsOrder[clientId];
    },

    getSectionOptions(state) {
      return state.sectionOptions;
    },
    getProductRangeOptions(state) {
      return state.productRangeOptions;
    },
    getProductTypeOptions(state) {
      return state.productTypeOptions;
    },
  },

  controls: {},
  resolvers: {},
});
