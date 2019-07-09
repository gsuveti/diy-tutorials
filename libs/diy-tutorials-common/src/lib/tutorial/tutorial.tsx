import React from "react";
import './tutorial.scss';
import {Section} from '../section/section';
import {Answer, ContextType, TutorialContext} from '../context';
import {serializeAttributes} from '../utils';
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
  displayedSections: number[];
}


export class Tutorial extends React.Component<TutorialProps, TutorialState> {
  constructor(props) {
    super(props);
    this.addAnswer = this.addAnswer.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      answers: [],
      displayedSections: [0]
    };
  }


  addAnswer(answer: Answer) {
    const {sections} = this.props;
    const {displayedSections} = this.state;
    const {answers} = this.state;
    const answersMap = Immutable.Map(answers.map(v => [v.uuid, v]));
    const newAnswersMap = answersMap.set(answer.uuid, answer);


    const nextSectionIndex = Math.min(answer.sectionIndex + 1, sections.length - 1);
    const newActiveSectionIndex = answer.nextSection ? answer.nextSection : nextSectionIndex;

    const newDisplayedSections = answer.goToNextSection ?
      displayedSections
        .slice(0, Math.max(0, displayedSections.indexOf(answer.sectionIndex)))
        .concat([answer.sectionIndex, newActiveSectionIndex])
      :
      displayedSections.concat([]);


    this.setState({
      answers: newAnswersMap.toList().toJSON(),
      displayedSections: newDisplayedSections
    });
  }


  submit() {
    const {answers} = this.state;
    console.log(answers);
  }

  getSectionClassName(index: number) {
    const {displayedSections} = this.state;
    return displayedSections.indexOf(index) < 0 ? "hide" : "show";
  }

  render(): React.ReactNode {

    const {id, attributes, className, sections = [], children} = this.props;
    const {uuid} = attributes;
    const {answers} = this.state;

    const innerBlocks = sections.map((section, index) => {
      return (
        <Section className={this.getSectionClassName(index)}
                 sectionIndex={index}
                 {...section}/>
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
      </div>
    );
  }
}
