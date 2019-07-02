import React from "react";
import './tutorial.scss';
import {Section} from '../section/section';
import {TutorialContext} from '../context';
import {serializeAttributes} from '../utils';


/* tslint:disable:no-empty-interface */
export interface TutorialProps {
  id?: string;
  uuid?: string;
  className?: string;
  children?: any;
  sections?: any[];
  attributes?: {
    uuid?: string;
  };
}

/* tslint:disable:no-empty-interface */
export interface TutorialState {
  filters?: {};
}


export class Tutorial extends React.Component<TutorialProps, TutorialState> {
  constructor(props) {
    super(props);
    this.addFilter = this.addFilter.bind(this);
    this.state = {
      filters: {}
    };
  }

  addFilter({key, value}) {
    const {filters} = this.state;

    this.setState({
      filters: {
        ...filters,
        [key]: value
      }
    });
  }

  render(): React.ReactNode {

    const {id, attributes, className, sections = [], children} = this.props;
    const {uuid} = attributes;
    const {filters} = this.state;

    const innerBlocks = sections.map(section => {
      return (
        <Section {...section}/>
      );
    });


    const content = children ?
      children
      :
      <TutorialContext.Provider value={{
        filters: filters,
        addFilter: this.addFilter
      }
      }>
        {innerBlocks}
      </TutorialContext.Provider>
    ;

    return (
      <div id={id}
           className={className}
           data-attributes={serializeAttributes(attributes)}
      >
        {content}
      </div>
    );
  }
};
