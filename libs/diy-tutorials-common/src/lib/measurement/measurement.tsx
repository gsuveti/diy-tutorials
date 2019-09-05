import React, {FormEvent} from 'react';
import {connect} from 'react-redux';

import './measurement.scss';
import {serializeAttributes} from '../utils';
import {AppState} from '../store';
import {addMeasurement, TutorialActions} from '../+state/tutorial.actions';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {BlockAttributes} from '../models/block-attributes.model';
import HideInEmail from '../hide-in-email/hide-in-email';
import ShowInEmail from '../show-in-email/show-in-email';

/* tslint:disable:no-empty-interface */
interface OwnProps {
  children?: any;
  isRenderedInEditor?: boolean;
  attributes: BlockAttributes & {
    property: string
  },
  instanceIndex?: number;
  value?: number;
}

interface DispatchProps {
  addMeasurement?: typeof addMeasurement
}

interface StateProps {
  measuredValue?: string;
}

type MeasurementProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface MeasurementState {
}

export const Measurement = (props: MeasurementProps, state: MeasurementState) => {
  const {
    children, isRenderedInEditor, attributes,
    addMeasurement, measuredValue, instanceIndex
  } = props;
  const {property, uuid, parentBlockUUID} = attributes;

  return (
    <div className={``}
         data-attributes={serializeAttributes(attributes)}>
      {isRenderedInEditor ? children :
        <div>
          <div className="form-group">
            <label htmlFor={uuid}>
              {property}
              <ShowInEmail>
                <span><strong>{measuredValue}</strong></span>
              </ShowInEmail>
            </label>
            <HideInEmail>
              <input id={uuid} type="number" step="0.01" min={1} className="form-control" aria-label={property}
                     value={measuredValue || ""}
                     aria-describedby="measurementHelp"
                     onChange={(event: FormEvent<HTMLInputElement>) => {
                       addMeasurement(
                         uuid,
                         parentBlockUUID,
                         instanceIndex,
                         Number.parseInt(event.currentTarget.value),
                       );
                     }}/>
            </HideInEmail>

          </div>
        </div>
      }
    </div>
  );
};


function mapStateToProps(state: AppState, ownProps: MeasurementProps, ownState: MeasurementState): StateProps {
  const {instanceIndex, attributes} = ownProps;
  const {uuid} = attributes;
  const measuredValues = state.userContext.measuredValues[uuid];
  return {
    measuredValue: measuredValues ? measuredValues[instanceIndex] : undefined
  };
}

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
    addMeasurement,
  }, dispatch);


export const ConnectedMeasurement = connect<StateProps, DispatchProps, MeasurementProps>(
  mapStateToProps,
  mapDispatchToProps
)(Measurement);

