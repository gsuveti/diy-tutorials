import React from "react";
import './tutorial.scss';
import {ConnectedSection} from '../section/section';
import {serializeAttributes} from '../utils';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {Block} from '../models/block.model';
import {ConnectedProductList} from '../product-list/product-list';
import {connect} from 'react-redux';


/* tslint:disable:no-empty-interface */
export interface TutorialProps {
  id?: string;
  uuid?: string;
  children?: any;
  innerBlocks?: Block[];
  attributes?: {
    uuid?: string;
    name?: string;
  };
  isRenderedInEditor?: boolean;
  firebase?: any;
}

/* tslint:disable:no-empty-interface */
export interface TutorialState {
  displayedSections: number[];
}

const allowedComponents = {
  'irian/diy-section': ConnectedSection,
  'irian/diy-product-list': ConnectedProductList
};

export class Tutorial extends React.Component<TutorialProps, TutorialState> {

  constructor(props) {
    super(props);
    this.state = {
      displayedSections: [0]
    };
  }


  componentDidMount(): void {


  }

  getSectionClassName(index: number) {
    const {displayedSections} = this.state;
    return displayedSections.indexOf(index) < 0 ? "hide" : "show";
  }

  render(): React.ReactNode {

    const {id, attributes, innerBlocks = [], children} = this.props;

    const content = children ?
      children
      :
      <InnerBlocksContent
        innerBlocks={innerBlocks}
        allowedComponents={allowedComponents}

      />
    ;

    return (
      <div id={id}
           data-attributes={serializeAttributes(attributes)}
      >
        {content}
      </div>
    );
  }
}

