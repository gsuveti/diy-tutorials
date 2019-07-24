import React, {FormEvent} from 'react';
import {connect} from 'react-redux';

import './question.scss';
import {serializeAttributes} from '../utils';
import Select, {Option} from '@material/react-select';
import TextField, {Input} from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';
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


  submitResponse(value: string, index?: number, goToNextSection = false) {
    const {addResponse, attributes, options = []} = this.props;
    const {uuid, text} = attributes;

    const option = options[index] || {value: undefined, nextSection: undefined, uuid: undefined};

    addResponse({
      questionUUID: uuid,
      responseUUID: option.uuid,
      value: value || option.value,
      text,
      nextSection: option.nextSection,
      goToNextSection
    });
  }

  renderTextQuestion() {
    const {response} = this.props;
    const value: string = response ? response.value : "";

    return (
      <div>
        <TextField
          className={"form-control"}
          onTrailingIconSelect={() => this.submitResponse("")}
          trailingIcon={<MaterialIcon role="button" icon="delete"/>}
        >
          <Input
            value={value}
            onChange={(event: FormEvent<HTMLInputElement>) => {
              this.submitResponse(event.currentTarget.value)
            }}/>
        </TextField>
      </div>
    );
  };

  renderSelectOneQuestion() {
    const {response, options} = this.props;
    const value: string = response ? response.value : "";

    if (options) {
      return (
        <Select
          className={"form-control"}
          enhanced
          value={value}
          onEnhancedChange={(index) => this.submitResponse(undefined, index, true)}
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

