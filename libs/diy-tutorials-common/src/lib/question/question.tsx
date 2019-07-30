import React, {FormEvent} from 'react';
import {connect} from 'react-redux';

import './question.scss';
import {serializeAttributes} from '../utils';
import {Response} from '../models/response.model';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {addResponse, TutorialActions} from '../tutorial/+state/tutorial.actions';
import {AppState} from '../store';

/* tslint:disable:no-empty-interface */
interface OwnProps {
  className?: string;
  attributes?: {
    type: string,
    displayCondition?: string;
    text?: string;
    required?: boolean;
    uuid?: string;
  };
  children?: any;
  isRenderedInEditor?: boolean;
}

interface DispatchProps {
  addResponse?: typeof addResponse
}

interface StateProps {
  response?: Response;
  options?: { value: string, nextSection: string, uuid: string }[] | null
}

export type QuestionProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface QuestionState {

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
    const {attributes} = nextProps;

    return {options: null};
  }


  submitResponse(value: string, responseUUID?: string, nextSection?: string, goToNextSection = false) {
    const {addResponse, attributes, options = []} = this.props;
    const {uuid, text} = attributes;


    addResponse({
      text,
      questionUUID: uuid,
      responseUUID: responseUUID,
      value: value,
      nextSection: nextSection,
      goToNextSection
    });
  }

  renderTextQuestion() {
    const {response, attributes} = this.props;
    const {text} = attributes;
    const value: string = response ? response.value : "";

    return (
      <div className="form-group">
        <label>{text}</label>
        <input type="text"
               value={value || ""}
               onChange={(event: FormEvent<HTMLInputElement>) => {
                 this.submitResponse(event.currentTarget.value);
               }}/>
      </div>
    );
  };

  renderSelectOneQuestion() {
    const {response, options, attributes} = this.props;
    const {text} = attributes;
    const value: string = response ? options.findIndex(option=>option.uuid===response.responseUUID).toString() : "";

    if (options) {
      return (
        <div className="form-group">
          <label>{text}</label>
          <select className="custom-select"
                  value={value}
                  onChange={(event) => {
                    const index: number = Number.parseInt(event.currentTarget.value);
                    if (index >= 0) {
                      const option = options[index];
                      this.submitResponse(option.value, option.uuid, option.nextSection, true);
                    }
                  }}
          >
            {[{uuid: "", value: '-- Alege un raspuns --'}].concat(options).map(({value, uuid}, index) => (
                <option key={index} value={index - 1}>{value}</option>
              )
            )}
          </select>
        </div>
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
    response: state.tutorial.responses[ownProps.attributes.uuid],
    options: state.tutorial.questionOptions[ownProps.attributes.uuid]
  };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
    addResponse
  }, dispatch);


export const ConnectedQuestion = connect<StateProps, DispatchProps, QuestionProps>(
  mapStateToProps,
  mapDispatchToProps
)(Question);

