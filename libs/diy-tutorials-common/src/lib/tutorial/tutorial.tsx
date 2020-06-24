import React from "react";
import {connect} from 'react-redux';

import './tutorial.scss';
import {ConnectedSection} from '../section/section';
import {serializeAttributes} from '../utils';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {Block} from '../models/block.model';
import {ConnectedProductList} from '../product-list/product-list';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil, tap} from 'rxjs/operators';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {sendEmailWithInstructions, TutorialActions} from '../+state/tutorial.actions';
import {AppState} from '../+state/app.state';
import {ROOT_ID} from '../constants/index';
import HideInEmail from '../hide-in-email/hide-in-email';


/* tslint:disable:no-empty-interface */
export interface OwnProps {
    id?: string;
    uuid?: string;
    children?: any;
    innerBlocks?: Block[];
    attributes?: {
        uuid?: string;
        name?: string;
    };
    isRenderedInEditor?: boolean;
    firebase?: any;
    stickyBannerDebounceTime?: number;
}


interface DispatchProps {
    sendEmailWithInstructions?: typeof sendEmailWithInstructions;
}

interface StateProps {
    instructionsEmailSent: boolean
}


/* tslint:disable:no-empty-interface */
export interface TutorialState {
    displayedSections: number[];
    showBanner: boolean;
    focused: boolean;
}

type TutorialProps = StateProps & DispatchProps & OwnProps;

const allowedComponents = {
    'irian/diy-section': ConnectedSection,
    'irian/diy-product-list': ConnectedProductList
};

export class Tutorial extends React.Component<TutorialProps, TutorialState> {
    private destroy$: Subject<void> = new Subject<void>();
    private showBanner$: Subject<boolean> = new Subject<boolean>();
    private readonly emailInput: React.RefObject<any>;

    constructor(props) {
        super(props);
        this.state = {
            displayedSections: [0],
            showBanner: false,
            focused: false
        };
        this.emailInput = React.createRef();
        this.sendEmail = this.sendEmail.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onMouseOut = this.onMouseOut.bind(this);

        this.showBanner$.pipe(
            distinctUntilChanged(),
            tap((value) => this.setState({showBanner: value})),
            takeUntil(this.destroy$)
        ).subscribe(
            () => {
            },
            (err) => {
                console.log(err);
            });
    }

    componentWillUnmount(): void {
        this.destroy$.next()
    }

    onBlur() {
        // console.log("onBlur");
        this.setState({focused: false})
    }

    onFocus() {
        // console.log("onFocus");
        this.setState({focused: true})
    }


    onMouseOut() {
        // console.log("onMouseOut");
        this.setState({focused: false});
        this.emailInput.current.blur();
    }

    componentDidMount(): void {
        const {stickyBannerDebounceTime} = this.props;

        const scroll$ = fromEvent(window, 'scroll');

        scroll$
            .pipe(
                tap((event) => {
                    if (!this.state.focused) {
                        this.showBanner$.next(false);
                    }
                }),
                debounceTime(stickyBannerDebounceTime || 10000),
                tap((event) => {
                    if (Tutorial.isAfterRootWaypoint(ROOT_ID)
                        && !this.props.instructionsEmailSent
                    ) {
                        this.showBanner$.next(true);
                    }
                }),
                takeUntil(this.destroy$),
            )
            .subscribe(
                () => {
                },
                (err) => {
                    console.log(err)
                },
            );
    }

    static isAfterRootWaypoint(id: string) {
        const contentElement = document.getElementById(id);
        if (contentElement) {
            const bounding = contentElement.getBoundingClientRect();
            return bounding.top < 0;
        }
        return false;
    }

    getSectionClassName(index: number) {
        const {displayedSections} = this.state;
        return displayedSections.indexOf(index) < 0 ? "hide" : "show";
    }

    sendEmail(event): void {
        event.preventDefault();

        const {sendEmailWithInstructions} = this.props;
        sendEmailWithInstructions(this.emailInput.current.value);
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        // console.log(error, errorInfo);
    }

    render(): React.ReactNode {
        const {showBanner} = this.state;
        const {id, attributes, innerBlocks = [], children, instructionsEmailSent} = this.props;

        const content = children ?
            children
            :
            [
                <HideInEmail key={'banner'}>

                    <div
                        className={`${showBanner ? 'show' : ''} sticky-banner bg-light shadow p-sm`}>
                        <div className={`sticky-banner-content`}>
                            <p className={`mb-xs small`}>Nu ai timp acum? <strong>Salvează lucrarea pe mai
                                târziu!</strong>
                            </p>
                            {instructionsEmailSent ?
                                <p className={`p-0 m-0 email-success-message d-flex justify-content-center text-success`}>
                                    <small>E-mailul a fost trims!</small>
                                </p> :
                                <form className="input-group input-group -sm mb-xs" onSubmit={this.sendEmail}>
                                    <input type="text"
                                           id={'sticky-email-input'}
                                           className="form-control pl-sm"
                                           placeholder="Introdu adresa ta de e-mail"
                                           aria-label="Introdu adresa ta de e-mail"
                                           aria-describedby="save-btn"
                                           onFocus={this.onFocus}
                                           onBlur={this.onBlur}
                                           onMouseOut={this.onMouseOut}
                                           ref={this.emailInput}/>
                                    <div className="input-group-append">
                                        <button className="btn btn-primary btn-sm" type="submit"
                                                id="save-btn">
                                            Salvează
                                        </button>
                                    </div>
                                </form>
                            }
                        </div>
                    </div>
                </HideInEmail>,
                <InnerBlocksContent
                    key={'content'}
                    innerBlocks={innerBlocks}
                    allowedComponents={allowedComponents}

                />
            ]
        ;

        return (
            <div id={id}
                 data-attributes={serializeAttributes(attributes)}
            >
                {content}
            </div>
        );
    }
}


function mapStateToProps(state: AppState, ownProps: TutorialProps, ownState: TutorialState): StateProps {
    return {
        instructionsEmailSent: state.userContext.instructionsEmailSent
    };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
    bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
        sendEmailWithInstructions
    }, dispatch);


export const ConnectedTutorial = connect<StateProps, DispatchProps, TutorialProps>(
    mapStateToProps,
    mapDispatchToProps
)(Tutorial);
