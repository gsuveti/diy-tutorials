import React from 'react';

import './question.scss';
import {serializeAttributes} from '../utils';
import {TutorialContext} from '../context';


/* tslint:disable:no-empty-interface */
export interface QuestionProps {
  className?: string;
  attributes?: {
    type: string,
    displayCondition?: string;
    text?: string;
    required?: boolean;
    options?: string;
    uuid?: string;
  };
  children?: any;

}

export const Question = (props: QuestionProps) => {
  const {className, children, attributes} = props;
  const {text} = attributes;


  return (
    <div className={className}
         data-attributes={serializeAttributes(attributes)}>

      {children ? children :
        <div>
          <p>{text}</p>
          <TutorialContext.Consumer>
            {({addFilter}) => (<QuestionForm {...attributes} addFilter={addFilter}/>)}
          </TutorialContext.Consumer>
        </div>
      }
    </div>
  );
};

export default Question;


export interface QuestionFormProps {
  className?: string,
  type: string,
  text?: string;
  required?: boolean;
  options?: string;
  uuid?: string;
  addFilter?: any;
}

export interface QuestionFormState {
  value?: any
}

export class QuestionForm extends React.Component<QuestionFormProps, QuestionFormState> {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.renderTextQuestion = this.renderTextQuestion.bind(this);
    this.renderSelectOneQuestion = this.renderSelectOneQuestion.bind(this);
    this.state = {value: ''};
  }

  handleChange(e) {
    this.setState({value: e.target.value});
  }

  renderTextQuestion() {
    return (
      <div>
        <input onChange={this.handleChange}/>
      </div>
    );
  };

  renderSelectOneQuestion() {
    const {options} = this.props;
    return (
      <div>
        <select onChange={this.handleChange}>
          {options.split(",").map(value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>
    );
  };


  render(): React.ReactNode {
    const {type, className, addFilter, uuid} = this.props;
    const {value} = this.state;

    let renderQuestion = null;

    switch (type) {
      case "text": {
        renderQuestion = this.renderTextQuestion();
        break;
      }
      case "selectOne": {
        renderQuestion = this.renderSelectOneQuestion();
        break;
      }
    }

    return (
      <div className={className}>
        {renderQuestion}
        <button className={"button color1"} onClick={() => addFilter({
          key: uuid,
          value
        })}>Submit
        </button>
      </div>

    );
  }
};

