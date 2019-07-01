import React from 'react';
import ReactDOM from 'react-dom';
import {ROOT_ID, Tutorial} from '@diy-tutorials/diy-tutorials-common';
import {serialize} from '@wordpress/blocks';


const rootElement = document.getElementById(ROOT_ID);

function getSectionsInTutorial(element: HTMLElement) {
  const sections = [];
  (element.firstChild as HTMLElement).childNodes.forEach((node, key) => {
    const sectionElement = node as HTMLElement;
    if (sectionElement.classList && sectionElement.classList.contains("wp-block-irian-diy-section")) {
      sections.push(getSection(sectionElement, key));
    }
  });
  return sections;
}

function getSection(element: HTMLElement, key: number) {
  const blocks = [];
  (element.firstChild as HTMLElement).childNodes.forEach((node, key) => {
    const blockElement = node as HTMLElement;
    if (blockElement.classList && blockElement.classList.contains("wp-block-irian-diy-content")) {
      blocks.push({
        key: key,
        name: 'content',
        html: (blockElement.firstChild as HTMLElement).innerHTML
      });
    } else if (blockElement.classList && blockElement.classList.contains("wp-block-irian-diy-question")) {
      blocks.push({
        name: 'question',
        key: key,
        html: (blockElement.firstChild as HTMLElement).innerHTML
      });
    }
  });

  return {
    name: 'section',
    key: key,
    blocks: blocks
  };
}

const sections = getSectionsInTutorial(rootElement);

if (rootElement) {
  console.log("hydrating root element");

  ReactDOM.render(
    <Tutorial
      sections={sections}
      innerHTML={(rootElement.firstChild as HTMLElement).innerHTML}>
    </Tutorial>,
    rootElement
  );
}

