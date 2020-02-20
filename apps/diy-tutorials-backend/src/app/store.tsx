// @ts-ignore
import {BlockNames, filterBlocksByName, getBlockAttributesList, groupBy} from '@diy-tutorials/diy-tutorials-common';

// @ts-ignore
const {registerStore} = window.wp.data;

const DEFAULT_STATE = {
  blocks: [],
  sectionsOrder: [],
  questionOptions: [],
  sectionOptions: [],
  productRangeOptions: [],
  productTypeOptions: [],
  measurementFormsOrder: [],
  measurementsOrder: {},
  commonOrOptionalProductUUIDs: []
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
        const sectionOptions = sections.map((attributes, index) => {
          return {
            value: attributes.uuid,
            label: `Section ${index + 1}`
          };
        });

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
        const productRangeOptions = [{value: "", label: "-- Alege o gama --"}].concat(
          productRanges.map(attributes => {
            return {
              value: attributes.uuid,
              label: attributes.headline
            };
          })
        );

        const productLists = filterBlocksByName(blockAttributesList, BlockNames.ProductList);
        let commonOrOptionalProductUUIDs = [];
        if (productLists.length > 0) {
          const productListUUID = productLists[0].uuid;
          commonOrOptionalProductUUIDs = filterBlocksByName(blockAttributesList, BlockNames.Product)
            .filter(product => product.parentBlockUUID === productListUUID)
            .map(product => product.uuid);
        }


        const productTypes = filterBlocksByName(blockAttributesList, BlockNames.ProductType);
        const productTypeOptions = [{value: "", label: "-- Alege un tip --"}].concat(
          productTypes.map(attributes => {
            return {
              value: attributes.uuid,
              label: attributes.headline
            };
          })
        );

        const questions = filterBlocksByName(blockAttributesList, BlockNames.Question);
        const optionsByQuestion = groupBy(filterBlocksByName(blockAttributesList, BlockNames.QuestionOption), 'parentBlockUUID');

        const questionOptions = [{value: "", label: "-- Alege o intrebare --"}].concat(
          questions.map(attributes => {
            return {
              value: attributes.uuid,
              label: attributes.text,
              options: [{value: undefined, label: "-- Alege un raspuns --"}].concat(
                (optionsByQuestion[attributes.uuid] || []).map(attributes => {
                  return {
                    value: attributes.uuid,
                    label: attributes.value
                  };
                })
              )
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
          productTypeOptions,
          questionOptions,
          commonOrOptionalProductUUIDs
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

    getMeasurementFormIndex(state, clientId) {
      const {measurementFormsOrder} = state;
      return measurementFormsOrder.indexOf(clientId);
    },

    getSectionOptions(state) {
      return state.sectionOptions;
    },

    getQuestionOptions(state) {
      return state.questionOptions;
    },

    getProductRangeOptions(state) {
      return state.productRangeOptions;
    },
    getProductTypeOptions(state) {
      return state.productTypeOptions;
    },
    isCommonOrOptionalProduct(state, uuid): boolean {
      return state.commonOrOptionalProductUUIDs.indexOf(uuid) >= 0;
    },
  },

  controls: {},
  resolvers: {},
});
