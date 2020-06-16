import React from 'react';
import {connect} from 'react-redux';

import './authentication-section.scss';
import {Block} from '../models/block.model';
import {loginWithEmail, loginWithFacebook, loginWithGoogle, TutorialActions} from '../+state/tutorial.actions';
import {AppState} from '../+state/app.state';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {UserState} from '../+state/user.reducer';


/* tslint:disable:no-empty-interface */
interface OwnProps {
    attributes?: {
        uuid: string
    };
    children?: any;
    innerBlocks?: Block[];
    isRenderedInEditor?: boolean;
}


interface DispatchProps {
    loginWithEmail?: typeof loginWithEmail;
    loginWithGoogle?: typeof loginWithGoogle;
    loginWithFacebook?: typeof loginWithFacebook;
}

interface StateProps {
    user?: UserState;
}

type AuthenticationSectionProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface AuthenticationSectionState {
}

class AuthenticationSection extends React.Component<AuthenticationSectionProps, AuthenticationSectionState> {

    emailInput: React.RefObject<HTMLInputElement>;

    constructor(props) {
        super(props);
        this.emailInput = React.createRef();
        this.loginWithEmail = this.loginWithEmail.bind(this);
    }

    loginWithEmail(event) {
        event.preventDefault();
        const {loginWithEmail} = this.props;

        const email = this.emailInput.current.value;
        loginWithEmail(email);
    }

    handleValidity = ({target}) => {
        const message = target.dataset.message;
        target.setCustomValidity(message);
    };

    render() {
        const {loginWithGoogle, loginWithFacebook} = this.props;


        return (
            <div className={'social-login mt-xl pt-xl border-top'}>
                <div className={`social-login-description`}>
                    <p className={`mb-0`}>
                        <strong>
                            Ca să-ți trimitem lista cu produse necesare pentru lucrarea ta
                            completează adresa ta de email sau autentifică-te cu contul de Google sau Facebook.
                        </strong>
                    </p>
                    <p>
                        <strong>
                            Cu lista poți merge la cumpărături sau printr-o apăsare de buton te vom redirecționa către
                            un
                            magazin unde vor apărea deja produsele selectate în coșul de cumpărături.
                        </strong>
                    </p>
                </div>
                <div className={'d-flex flex-column align-items-center'}>
                    <form onSubmit={this.loginWithEmail}>
                        <label>Introdu adresa ta de email:</label>
                        <input id={`email`}
                               type="email"
                               autoComplete="email"
                               data-message={'Introduceti un email valid!'}
                               ref={this.emailInput}
                               className="measurement-input form-control mb-md"/>
                        <button type="submit"
                                className="social-btn-facebook social-btn btn btn-primary text-light d-flex"
                        >
                            Autentifica-te cu email
                        </button>
                    </form>
                </div>
                <div className={'d-flex flex-column align-items-center py-md'}>
                    <p className={`m-0`}>sau</p>
                </div>
                <div className={'d-flex flex-column align-items-center'}>
                    <button type="button"
                            className="social-btn-google mb-sm social-btn btn btn-primary text-light text-light d-flex"
                            onClick={loginWithGoogle}>
                        Google
                    </button>
                    <button type="button"
                            className="social-btn-facebook mb-sm social-btn btn btn-primary text-light d-flex"
                            onClick={loginWithFacebook}>
                        Facebook
                    </button>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state: AppState, ownProps: AuthenticationSectionProps, ownState: AuthenticationSectionState): StateProps {

    return {
        user: state.user
    };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
    bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
        loginWithEmail,
        loginWithGoogle,
        loginWithFacebook
    }, dispatch);


export default connect<StateProps, DispatchProps, AuthenticationSectionProps>(
    mapStateToProps,
    mapDispatchToProps
)(AuthenticationSection);

