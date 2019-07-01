// @ts-ignore
const {serialize} = window.wp.blocks;

export function appendRawHtmlToCoreBlocks(innerBlocks = []) {
  return innerBlocks.map((block) => {
    if (block.name.startsWith("irian/")) {
      return {
        ...block,
        innerBlocks: appendRawHtmlToCoreBlocks(block.innerBlocks)
      };
    } else {
      const html = serialize(block);
      return {
        ...block,
        html
      }
    }
  });
}

export function serializeBlocksData(innerBlocks = []) {
    return btoa(JSON.stringify(innerBlocks));
}
