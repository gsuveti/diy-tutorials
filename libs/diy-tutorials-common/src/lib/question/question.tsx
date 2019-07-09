import React, {FormEvent} from 'react';

import './question.scss';
import {serializeAttributes} from '../utils';
import Select, {Option} from '@material/react-select';
import TextField, {Input} from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';
import {Answer, ContextType} from '../context';

/* tslint:disable:no-empty-interface */
export interface QuestionProps extends ContextType {
  className?: string;
  attributes?: {
    type: string,
    displayCondition?: string;
    text?: string;
    required?: boolean;
    optionsJSON?: string;
    uuid?: string;
  };
  sectionIndex?: number;
  answer?: Answer;
  children?: any;
  isServer?: boolean;
}


/* tslint:disable:no-empty-interface */
export interface QuestionState {
  options: { value: string, nextSection: number }[] | null
}


export class Question extends React.Component<QuestionProps, QuestionState> {
  constructor(props) {
    super(props);
    this.renderTextQuestion = this.renderTextQuestion.bind(this);
    this.renderSelectOneQuestion = this.renderSelectOneQuestion.bind(this);
    this.state = {
      options: null
    }
  }

  static getDerivedStateFromProps(nextProps: QuestionProps, prevState) {
    const {attributes: {optionsJSON}} = nextProps;

    if (optionsJSON) {
      const options: { value: string, nextSection: number }[] = JSON.parse(optionsJSON)
        .map((option: { value: string, nextSection: string }) => {
          return {
            value: option.value,
            nextSection: Number.parseInt(option.nextSection) || undefined,
          }
        });
      return {options};
    }
    return {options: null};
  }


  submitAnswer(value: string, index?: number, goToNextSection = false) {
    const {addAnswer, attributes, sectionIndex} = this.props;
    const {uuid, text} = attributes;

    const {options = []} = this.state;
    const option = options[index] || {};

    addAnswer({
      uuid: uuid,
      value: value,
      ...option,
      text,
      sectionIndex: sectionIndex,
      goToNextSection
    });
  }

  renderTextQuestion() {
    const {answer} = this.props;
    const value: string = answer ? answer.value : "";

    return (
      <div>
        <TextField
          className={"form-control"}
          onTrailingIconSelect={() => this.submitAnswer("")}
          trailingIcon={<MaterialIcon role="button" icon="delete"/>}
        >
          <Input
            value={value}
            onChange={(event: FormEvent<HTMLInputElement>) => {
              this.submitAnswer(event.currentTarget.value)
            }}/>
        </TextField>
      </div>
    );
  };

  renderSelectOneQuestion() {
    const {answer} = this.props;
    const {options} = this.state;
    const value: string = answer ? answer.value : "";

    if (options) {
      return (
        <Select
          className={"form-control"}
          enhanced
          value={value}
          onEnhancedChange={(index) => this.submitAnswer(undefined, index, true)}
        >
          {options.map(({value}) => (
              <Option key={value} value={value}>{value}</Option>
            )
          )}
        </Select>
      );
    }
    return null;
  };


  render(): React.ReactNode {
    const {className, children, attributes, isServer} = this.props;
    const {text, type} = attributes;


    return (
      <div className={className}
           data-attributes={serializeAttributes(attributes)}>
        {children}

        {isServer ?
          null :
          <div className={"pt-md"}>
            {text ?
              <div>
                <p>{text}</p>
                < div className="d-flex align-items-baseline">
                  {type === 'text' ?
                    this.renderTextQuestion() : null
                  }

                  {type === 'selectOne' ?
                    this.renderSelectOneQuestion() : null
                  }
                </div>
              </div>
              : null
            }
          </div>
        }
      </div>
    );
  }
}
