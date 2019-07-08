import React from "react";
import './tutorial.scss';
import {Section} from '../section/section';
import {ContextType, TutorialContext} from '../context';
import {serializeAttributes} from '../utils';
import Button from '@material/react-button';
import Immutable from 'immutable';


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
export interface TutorialState extends ContextType {
  activeSectionIndex: number;
  sectionHistory: number[];
}


export class Tutorial extends React.Component<TutorialProps, TutorialState> {
  constructor(props) {
    super(props);
    this.addAnswer = this.addAnswer.bind(this);
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      answers: [],
      activeSectionIndex: 0,
      sectionHistory: []
    };
  }

  addAnswer(answer) {
    const {activeSectionIndex} = this.state;
    const {answers} = this.state;
    const answersMap = Immutable.Map(answers.map(v => [v.uuid, v]));

    const newAnswersMap = answersMap.set(answer.uuid, {
      ...answer,
      section: activeSectionIndex
    });

    this.setState({
      answers: newAnswersMap.toList().toJSON()
    });
  }

  next() {
    const {activeSectionIndex, answers, sectionHistory} = this.state;
    const {sections} = this.props;

    const nextSectionIndex = Math.min(activeSectionIndex + 1, sections.length - 1);
    const newActiveSectionIndex = answers.reduce((nextSectionIndex, answer) => {
      if (answer.section === activeSectionIndex && answer.nextSection) {
        return answer.nextSection;
      }
      return nextSectionIndex;
    }, nextSectionIndex);

    const newSectionHistory = sectionHistory.concat([activeSectionIndex])
    this.setState({
      activeSectionIndex: newActiveSectionIndex,
      sectionHistory: newSectionHistory
    });
  }

  back() {
    const {sectionHistory} = this.state;
    const newSectionHistory = sectionHistory.slice(0, Math.max(0, sectionHistory.length - 1));
    this.setState({
      activeSectionIndex: sectionHistory[sectionHistory.length - 1],
      sectionHistory: newSectionHistory
    });
  }

  submit() {
    const {answers} = this.state;
    console.log(answers);
  }


  render(): React.ReactNode {

    const {id, attributes, className, sections = [], children} = this.props;
    const {uuid} = attributes;
    const {answers, activeSectionIndex} = this.state;
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
        answers: answers,
        addAnswer: this.addAnswer
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
                  onClick={() => this.back()}
                >
                  Back
                </Button> : null
            }

            {
              !(activeSection.attributes.submitForm) ?
                <Button
                  onClick={() => this.next()}
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
}
