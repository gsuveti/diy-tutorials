import React, {FormEvent} from 'react';
import {connect} from 'react-redux';

import './question.scss';
import {serializeAttributes} from '../utils';
import {Response} from '../models/response.model';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {addResponse, TutorialActions} from '../+state/tutorial.actions';
import {AppState} from '../+state/app.state';
import HideInEmail from '../hide-in-email/hide-in-email';
import ShowInEmail from '../show-in-email/show-in-email';

/* tslint:disable:no-empty-interface */
interface OwnProps {
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

        const responseUUID = response ? response.responseUUID : '';

        if (options) {
            return (
                <div className={`question-content  ${responseUUID ? '' : 'pulse'}`}>
                    <div className={`card d-flex flex-column flex-grow-1`}>
                        <div className={`question-header p-md`}>
                            <label>{text}</label>
                        </div>

                        <HideInEmail>
                            <div className={`d-flex flex-column flex-grow-1`}>
                                <div className={`question-options d-flex flex-column flex-grow-1 p-md`}>
                                    {options.map(({value, uuid, nextSection}, index) => (
                                            <div className={`d-flex flex-grow-1`} key={index}>
                                                <button
                                                    className={`btn d-flex flex-grow-1 align-items-center mb-sm ${responseUUID == uuid ? 'btn-secondary' : 'btn-outline-primary'}`}
                                                    value={index - 1}
                                                    onClick={() => {
                                                        this.submitResponse(value, uuid, nextSection, true);
                                                    }}
                                                >
                                                    <i className={'material-icons pr-sm'}>
                                                        {responseUUID == uuid ? 'radio_button_checked' : 'radio_button_unchecked'}
                                                    </i>
                                                    <span className={`text-left`}>{value}</span>
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                                {responseUUID ? null :
                                    <div className={`question-help px-md pb-md`}>
                                        <small>Alege o opțiune pentru a merge mai departe!</small>
                                    </div>
                                }
                            </div>

                        </HideInEmail>
                        <ShowInEmail>
                            <div className={`question-options`}>
                            {
                                options.map(({value, uuid, nextSection}, index) => (
                                    <p key={index} className={`question-option`}>
                                        <span className={`question-option-icon`}>{(response && value === response.value) ? '☑' : '☐'}</span>
                                        {value}
                                    </p>
                                ))
                            }</div>
                        </ShowInEmail>
                    </div>
                </div>
            );
        }
        return null;
    };

    render(): React.ReactNode {
        const {children, attributes, isRenderedInEditor} = this.props;
        const {text, type} = attributes;


        return (
            <div data-attributes={serializeAttributes(attributes)}>
                {children}


                {isRenderedInEditor ?
                    null :
                    <div className={"question py-lg"}>
                        {text ?
                            <div className="d-flex">
                                {type === 'text' ?
                                    this.renderTextQuestion() : null
                                }

                                {type === 'selectOne' ?
                                    this.renderSelectOneQuestion() : null
                                }
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
        response: state.userContext.responses[ownProps.attributes.uuid],
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

