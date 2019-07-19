import React, {FormEvent} from 'react';
import {connect} from 'react-redux';

import './question.scss';
import {serializeAttributes} from '../utils';
import Select, {Option} from '@material/react-select';
import TextField, {Input} from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';
import {Answer} from '../models/answer.model';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {addAnswer, TutorialActions} from '../tutorial/+state/tutorial.actions';
import {AppState} from '@diy-tutorials/diy-tutorials-common';

/* tslint:disable:no-empty-interface */
export interface OwnProps {
  className?: string;
  attributes?: {
    type: string,
    displayCondition?: string;
    text?: string;
    required?: boolean;
    optionsJSON?: string;
    uuid?: string;
  };
  children?: any;
  isRenderedInEditor?: boolean;
}

interface DispatchProps {
  addAnswer?: typeof addAnswer
}

interface StateProps {
  answer?: Answer;
}

type QuestionProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface QuestionState {
  options: { value: string, nextSection: string }[] | null
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
      const options: { value: string, nextSection: string }[] = JSON.parse(optionsJSON)
        .map((option: { value: string, nextSection: string }) => {
          return {
            value: option.value,
            nextSection: option.nextSection,
          }
        });
      return {options};
    }
    return {options: null};
  }


  submitAnswer(value: string, index?: number, goToNextSection = false) {
    const {addAnswer, attributes} = this.props;
    const {uuid, text} = attributes;

    const {options = []} = this.state;
    const option = options[index] || {};

    addAnswer({
      uuid: uuid,
      value: value,
      ...option,
      text,
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
          {options.map(({value}, index) => (
              <Option key={index} value={value}>{value}</Option>
            )
          )}
        </Select>
      );
    }
    return null;
  };


  render(): React.ReactNode {
    const {className, children, attributes, isRenderedInEditor} = this.props;
    const {text, type} = attributes;


    return (
      <div className={className}
           data-attributes={serializeAttributes(attributes)}>
        {children}

        {isRenderedInEditor ?
          null :
          <div className={"pt-md"}>
            {text ?
              <div>
                <p className={'mt-sm mb-0'}>{text}</p>
                <div className="d-flex align-items-baseline">
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

function mapStateToProps(state: AppState, ownProps: QuestionProps, ownState: QuestionState): StateProps {
  return {
    answer: state.tutorial.answers[ownProps.attributes.uuid]
  };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
    addAnswer
  }, dispatch);


export const ConnectedQuestion = connect<StateProps, DispatchProps, QuestionProps>(
  mapStateToProps,
  mapDispatchToProps
)(Question);

