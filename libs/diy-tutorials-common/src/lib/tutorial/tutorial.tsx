import React from "react";
import './tutorial.scss';
import {Section} from '../section/section';
import {TutorialContext} from '../context';
import {serializeAttributes} from '../utils';
import Button from '@material/react-button';


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
  activeSection: number;
}


export class Tutorial extends React.Component<TutorialProps, TutorialState> {
  constructor(props) {
    super(props);
    this.addFilter = this.addFilter.bind(this);
    this.navigate = this.navigate.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      filters: {},
      activeSection: 0
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

  navigate(steps: number) {
    const {activeSection} = this.state;
    this.setState({activeSection: activeSection + steps});
  }

  submit() {
    const {filters} = this.state;
  }


  render(): React.ReactNode {

    const {id, attributes, className, sections = [], children} = this.props;
    const {uuid} = attributes;
    const {filters, activeSection} = this.state;

    const innerBlocks = sections.map((section, index) => {
      return (
        <Section className={activeSection != index ? "hide" : "show"} {...section}/>
      );
    });


    const content = children ?
      children
      :
      <TutorialContext.Provider value={{
        filters: filters,
        addFilter: this.addFilter,
        navigate: this.navigate
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
        <div>
          {
            activeSection > 0 ?
              <Button
                onClick={() => this.navigate(-1)}
              >
                Back
              </Button> : null
          }

          {
            activeSection < (sections.length - 1) ?
              <Button
                onClick={() => this.navigate(1)}
              >
                Next
              </Button> : null
          }
          {
            activeSection === (sections.length - 1) ?
              <Button
                onClick={this.submit}
              >
                Submit
              </Button> : null
          }
        </div>
      </div>
    );
  }
};
