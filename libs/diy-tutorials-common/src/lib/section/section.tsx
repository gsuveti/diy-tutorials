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
import {showProducts, TutorialActions} from '../+state/tutorial.actions';

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
  showProducts?: typeof showProducts;
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
};


export const Section = (props: SectionProps) => {
  const {
    innerBlocks = [], children, attributes, isVisible = true,
    showSubmitFormButton, showProducts, isRenderedInEditor
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
              <button type="button" className="my-md btn btn-outline-primary d-flex"
                      onClick={() => showProducts()}>
                Afiseaza produsele necesare
              </button>
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
    showProducts,
  }, dispatch);


export const ConnectedSection = connect<StateProps, DispatchProps, SectionProps>(
  mapStateToProps,
  mapDispatchToProps
)(Section);
