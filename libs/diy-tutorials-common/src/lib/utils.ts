import {Block} from './models/block.model';
import {BlockNames} from './constants';
import {BlockAttributes} from './models/block-attributes.model';

const uuidv4 = require('uuid/v4')

export function serializeAttributes(attributes = {}) {
  const orderedAttributes = {};
  Object.keys(attributes).sort().forEach(function (key) {
    orderedAttributes[key] = attributes[key];
  });
  return btoa(JSON.stringify(orderedAttributes));
}


export function deserializeAttributes(attributes = "W10=") {
  return JSON.parse(atob(attributes));
}

export function generateUUID() {
  return uuidv4();
}


export function withBaseAttributes(attributes) {
  return {
    ...attributes,
    uuid: {type: 'string'},
    name: {type: 'string'},
  };
}


export function getInnerBlocks(element: HTMLElement, parentBlockUUID?: string): Block[] {
  const innerBlocks = [];
  element.childNodes.forEach((node, key) => {
    const childElement = node as HTMLElement;
    if (childElement.dataset && childElement.dataset.attributes) {
      innerBlocks.push(getBlock(childElement, parentBlockUUID));
    }
  });
  return innerBlocks;
}

export function getBlockList(blocks: Block[], depth = 1): BlockAttributes[] {
  return blocks.reduce((accumulator, block, index) => {
    accumulator.push({
      ...block.attributes,
      depth,
      index
    });
    if (block.innerBlocks) {
      accumulator.push(...getBlockList(block.innerBlocks, depth + 1))
    }
    return accumulator;
  }, []);
}

export function filterBlocksByName(blocks: BlockAttributes[], blockName:BlockNames): BlockAttributes[] {
  return blocks
    .filter(block => block.name === blockName);
}

export function getQuestionsToSectionMap(blocks: Block[]): { [uuid: string]: string } {
  return blocks
    .filter(block => block.attributes.name === BlockNames.Section)
    .reduce((map, block) => {

      const newMap = block.innerBlocks
        .filter((innerBlock) => innerBlock.attributes.name === BlockNames.Question)
        .reduce((map, innerBlock) => {
          return {
            ...map,
            [innerBlock.attributes.uuid]: block.attributes.uuid
          }
        }, {});
      return {
        ...map,
        ...newMap
      }
    }, {});
}

export function getBlock(element: HTMLElement, parentBlockUUID?: string) {
  const attributes = deserializeAttributes(element.dataset.attributes);
  const innerBlocks = getInnerBlocks(element, attributes.uuid);

  return {
    key: attributes.uuid,
    innerBlocks: innerBlocks,
    attributes: {...attributes, parentBlockUUID},
    html: innerBlocks.length ? undefined : element.innerHTML
  };
}
