import React from 'react';
import {connect} from 'react-redux';

import './share-by-email.scss';
import {serializeAttributes} from '../utils';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {sendEmailWithInstructions, TutorialActions} from '../+state/tutorial.actions';
import {AppState} from '../+state/app.state';
import HideInEmail from '../hide-in-email/hide-in-email';
import ShowInEmail from '../show-in-email/show-in-email';

/* tslint:disable:no-empty-interface */
interface OwnProps {
    attributes?: {
        description: string,
        uuid?: string;
    };
    children?: any;
    isRenderedInEditor?: boolean;
}

interface DispatchProps {
    sendEmailWithInstructions?: typeof sendEmailWithInstructions
}

interface StateProps {
    instructionsEmailMessage?: any
}

export type ShareByEmailProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface ShareByEmailState {
}


export class ShareByEmail extends React.Component<ShareByEmailProps, ShareByEmailState> {

    private readonly emailInput: React.RefObject<any>;

    constructor(props) {
        super(props);
        this.emailInput = React.createRef();
        this.sendEmail = this.sendEmail.bind(this);
    }


    render(): React.ReactNode {
        const {children, attributes, isRenderedInEditor, instructionsEmailMessage} = this.props;
        const {description} = attributes;


        return (
            <div data-attributes={serializeAttributes(attributes)}>
                {children}


                {isRenderedInEditor ?
                    null :
                    <div className={"share-by-email py-lg"}>
                        <HideInEmail>
                            <div className={`d-flex flex-column`}>
                                <p className={`mb-2`}><strong>{description}</strong></p>
                                <form className={`d-flex flex-column`} onSubmit={this.sendEmail}>
                                    <div className="form-group mb-sm d-flex flex-column">
                                        <input
                                            className={`form-control`}
                                            type="email"
                                            autoComplete="email"
                                            ref={this.emailInput}
                                            data-message={'Introduceti un email valid!'}
                                            placeholder={`Introdu adresa ta de e-mail`}/>
                                    </div>

                                    <button className={`btn btn-primary d-flex justify-content-center`}
                                            type="submit"
                                    >
                                        Trimite rețeta!
                                    </button>

                                    {instructionsEmailMessage ?
                                        <p className={`pt-1 email-success-message d-flex justify-content-center text-${instructionsEmailMessage.severity}`}>
                                            <small>{instructionsEmailMessage.text}</small>
                                        </p> : null
                                    }

                                </form>
                            </div>
                        </HideInEmail>
                        <ShowInEmail>

                        </ShowInEmail>
                    </div>
                }
            </div>
        );
    }

    sendEmail(event): void {
        event.preventDefault();

        const {sendEmailWithInstructions} = this.props;
        sendEmailWithInstructions(this.emailInput.current.value);
    }
}

function mapStateToProps(state: AppState, ownProps: ShareByEmailProps, ownState: ShareByEmailState): StateProps {
    return {
        instructionsEmailMessage: state.userContext.instructionsEmailMessage,
    };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
    bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
        sendEmailWithInstructions
    }, dispatch);


export const ConnectedShareByEmail = connect<StateProps, DispatchProps, ShareByEmailProps>(
    mapStateToProps,
    mapDispatchToProps
)(ShareByEmail);

