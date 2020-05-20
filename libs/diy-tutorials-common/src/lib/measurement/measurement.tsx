import React, {FormEvent} from 'react';
import {connect} from 'react-redux';

import './measurement.scss';
import {serializeAttributes} from '../utils';
import {AppState} from '../+state/app.state';
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
    property: string;
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
  const {property,required, uuid, parentBlockUUID} = attributes;

  const onMeasurementChange = (event: FormEvent<HTMLInputElement>) => {
    const number = Number.parseFloat(event.currentTarget.value);
    const value = isNaN(number) ?  null : Math.abs(number);

    addMeasurement(
      uuid,
      parentBlockUUID,
      instanceIndex,
      value,
    );
  };

  // `value` prop on `input` should not be null.
  // Consider using an empty string to clear the component or `undefined` for uncontrolled components.
  const value =  typeof (measuredValue) === 'number' ? measuredValue: "";

  return (
    <div className={``}
         data-attributes={serializeAttributes(attributes)}>
      {isRenderedInEditor ? children :
        <div className={`measurement`}>
          <div className="form-group">
            <label
              className={`measurement-label`}
              htmlFor={uuid}>
              {property}
              <ShowInEmail>
                <span><strong>{measuredValue}</strong></span>
              </ShowInEmail>
            </label>
            <HideInEmail>
              <input id={uuid}
                     type="number"
                     step="1"
                     min={0}
                     className="measurement-input form-control"
                     aria-label={property}
                     value={value}
                     aria-describedby="measurementHelp"
                     onChange={onMeasurementChange}/>
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

