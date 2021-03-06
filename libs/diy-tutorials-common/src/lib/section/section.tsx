import React from 'react';
import {connect} from 'react-redux';

import './section.scss';
import {Content} from '../content/content';
import {ConnectedQuestion} from '../question/question';
import {serializeAttributes} from '../utils';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {ConnectedMeasurementForm} from '../measurement-form/measurement-form';
import {AppState} from '../+state/app.state';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {showProductsOrScrollToMeasurements, TutorialActions} from '../+state/tutorial.actions';
import {ConnectedShareByEmail} from '../share-by-email/share-by-email';

/* tslint:disable:no-empty-interface */
interface OwnProps {
    clientId?: string;
    attributes?: {
        uuid: string
        submitForm: boolean
    };
    innerBlocks?: any[];
    children?: any;
    isRenderedInEditor?: boolean;
}


interface DispatchProps {
    showProductsOrScrollToMeasurements?: typeof showProductsOrScrollToMeasurements;
}

interface StateProps {
    isVisible?: boolean;
    showSubmitFormButton?: boolean;
}

type SectionProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface SectionState {
}

const allowedComponents = {
    'irian/diy-question': ConnectedQuestion,
    'irian/diy-content': Content,
    'irian/diy-measurement-form': ConnectedMeasurementForm,
    'irian/diy-share-by-email': ConnectedShareByEmail,
};


export const Section = (props: SectionProps) => {
    const {
        innerBlocks = [], children, attributes, isVisible = true,
        showSubmitFormButton, showProductsOrScrollToMeasurements, isRenderedInEditor
    } = props;


    return (
        <div className={`${isVisible ? "show" : "hide"}`}
             data-attributes={serializeAttributes(attributes)}
        >
            {children}
            <InnerBlocksContent
                innerBlocks={innerBlocks}
                allowedComponents={allowedComponents}
            />
            {
                isRenderedInEditor ? null :
                    <div>
                        {showSubmitFormButton ?
                            <div className={`class="my-lg d-flex flex-column flex-align-center"`}>
                                <strong>Calculează cantitățile și afișează materiale necesare pentru lucrarea
                                    mea</strong>
                                <button type="button"
                                        className="my-md btn btn-primary wide-btn text-light d-flex align-self-center"
                                        onClick={() => showProductsOrScrollToMeasurements()}>
                                    Calculează
                                </button>
                            </div>
                            : null
                        }
                    </div>
            }
        </div>
    );
};


function mapStateToProps(state: AppState, ownProps: SectionProps, ownState: SectionState): StateProps {
    const {attributes} = ownProps;
    const {uuid, submitForm} = attributes;
    return {
        isVisible: state.userContext.displayedSections.indexOf(uuid) >= 0,
        showSubmitFormButton: submitForm && !state.userContext.showProducts
    };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
    bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
        showProductsOrScrollToMeasurements,
    }, dispatch);


export const ConnectedSection = connect<StateProps, DispatchProps, SectionProps>(
    mapStateToProps,
    mapDispatchToProps
)(Section);
