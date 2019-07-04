import React from 'react';
import ReactDOM from 'react-dom';
import {deserializeAttributes, ROOT_ID, Tutorial} from '@diy-tutorials/diy-tutorials-common';
import {serialize} from '@wordpress/blocks';

const rootElement = document.getElementById(ROOT_ID);

function getSectionsInTutorial(element: HTMLElement) {
  const sections = [];
  element.childNodes.forEach((node, key) => {
    const childElement = node as HTMLElement;
    if (childElement.classList && childElement.classList.contains("wp-block-irian-diy-section")) {
      sections.push(getSection(childElement, key));
    }
  });
  return sections;
}

function getSection(element: HTMLElement, key: number) {
  const blocks = [];
  element.childNodes.forEach((node, key) => {
    const childElement = node as HTMLElement;
    let name = "";
    if (childElement.classList && childElement.classList.contains("wp-block-irian-diy-content")) {
      name = "content";
    } else if (childElement.classList && childElement.classList.contains("wp-block-irian-diy-question")) {
      name = "question";
    }

    const {uuid = ""} = childElement.dataset || {};

    if (name) {
      blocks.push({
        name: name,
        key: key,
        uuid: uuid,
        attributes: deserializeAttributes(childElement.dataset.attributes),
        html: childElement.innerHTML
      });
    }
  });

  const uuid = element.dataset.uuid;

  return {
    name: 'section',
    key: key,
    uuid: uuid,
    innerBlocks: blocks,
    attributes: deserializeAttributes(element.dataset.attributes),
  };
}

const sections = getSectionsInTutorial(rootElement);

if (rootElement) {
  console.log("hydrating root element");

  ReactDOM.render(
    <Tutorial
      attributes={deserializeAttributes(rootElement.dataset.attributes)}
      sections={sections}>
    </Tutorial>,
    rootElement
  );
}

