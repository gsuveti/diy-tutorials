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
  activeSectionIndex: number;
}


export class Tutorial extends React.Component<TutorialProps, TutorialState> {
  constructor(props) {
    super(props);
    this.addFilter = this.addFilter.bind(this);
    this.navigate = this.navigate.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      filters: {},
      activeSectionIndex: 0
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
    const {activeSectionIndex} = this.state;
    const {sections} = this.props;

    const newIndex = Math.min(activeSectionIndex + steps, sections.length - 1);
    this.setState({activeSectionIndex: newIndex});
  }

  submit() {
    const {filters} = this.state;
    console.log(filters);
  }


  render(): React.ReactNode {

    const {id, attributes, className, sections = [], children} = this.props;
    const {uuid} = attributes;
    const {filters, activeSectionIndex} = this.state;
    const activeSection = sections[activeSectionIndex];

    const innerBlocks = sections.map((section, index) => {
      return (
        <Section className={activeSectionIndex != index ? "hide" : "show"} {...section}/>
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
        {activeSection ?
          <div>
            {
              activeSectionIndex > 0 ?
                <Button
                  onClick={() => this.navigate(-1)}
                >
                  Back
                </Button> : null
            }

            {
              !(activeSection.attributes.submitForm) ?
                <Button
                  onClick={() => this.navigate(1)}
                >
                  Next
                </Button> : null
            }
            {
              activeSection.attributes.submitForm ?
                <Button
                  onClick={this.submit}
                >
                  Submit
                </Button> : null
            }
          </div>
          : null
        }
      </div>
    );
  }
};
