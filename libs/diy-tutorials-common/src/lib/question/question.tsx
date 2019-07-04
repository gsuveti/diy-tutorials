import React, {FormEvent} from 'react';

import './question.scss';
import {serializeAttributes} from '../utils';
import Select, {Option} from '@material/react-select';
import TextField, {Input} from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';

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
  answer?: any;
  isServer?: boolean;
  addFilter?: (filer: any) => void;
}


export class Question extends React.Component<QuestionProps> {
  constructor(props) {
    super(props);
    this.renderTextQuestion = this.renderTextQuestion.bind(this);
    this.renderSelectOneQuestion = this.renderSelectOneQuestion.bind(this);
  }

  submitAnswer(value: any) {
    const {addFilter, attributes} = this.props;
    const {uuid, text} = attributes;

    addFilter({
      key: uuid,
      value: {
        value: value,
        text: text
      }
    })
  }

  renderTextQuestion() {
    const {answer = {}} = this.props;
    const {value} = answer;

    return (
      <div>
        <TextField
          className={"form-control"}
          onTrailingIconSelect={() => this.submitAnswer("")}
          trailingIcon={<MaterialIcon role="button" icon="delete"/>}
        ><Input
          value={value}
          onChange={(event: FormEvent<HTMLInputElement>) => {
            this.submitAnswer(event.currentTarget.value)
          }}/>
        </TextField>
      </div>
    );
  };

  renderSelectOneQuestion() {
    const {answer = {}, attributes} = this.props;
    const {value} = answer;
    const {options} = attributes;

    if (options) {
      return (
        <Select
          className={"form-control"}
          enhanced
          value={value}
          onChange={(event) => this.submitAnswer(event.currentTarget.value)}
          onEnhancedChange={(index, item) => this.submitAnswer(item.getAttribute('data-value'))}
        >

          {options.split(",").map(value => (
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
