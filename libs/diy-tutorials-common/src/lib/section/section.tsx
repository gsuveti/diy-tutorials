import React from 'react';
import {connect} from 'react-redux';

import './section.scss';
import {Content} from '../content/content';
import {ConnectedQuestion} from '../question/question';
import {serializeAttributes} from '../utils';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {ConnectedMeasurementForm} from '../measurement-form/measurement-form';
import {AppState} from '../store';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {addMeasurement, TutorialActions} from '../tutorial/+state/tutorial.actions';

/* tslint:disable:no-empty-interface */
interface OwnProps {
  className?: string;
  clientId?: string;
  attributes?: {
    uuid: string
    submitForm: boolean
  };
  innerBlocks?: any[];
  children?: any;
}


interface DispatchProps {
}

interface StateProps {
  isDisplayed?: boolean;
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
  const {innerBlocks = [], children, className, attributes, isDisplayed} = props;
  const {uuid} = attributes;


  return (
    <div className={`${className} ${isDisplayed ? "" : "hide"}`}
         data-attributes={serializeAttributes(attributes)}
    >
      {children}
      <InnerBlocksContent
        innerBlocks={innerBlocks}
        allowedComponents={allowedComponents}
      />
    </div>
  );
};


function mapStateToProps(state: AppState, ownProps: SectionProps, ownState: SectionState): StateProps {
  const {attributes} = ownProps;
  const {uuid} = attributes;
  return {
    isDisplayed: state.tutorial.displayedSections.indexOf(uuid) >= 0
  };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
    addMeasurement,
  }, dispatch);


export const ConnectedSection = connect<StateProps, DispatchProps, SectionProps>(
  mapStateToProps,
  mapDispatchToProps
)(Section);
