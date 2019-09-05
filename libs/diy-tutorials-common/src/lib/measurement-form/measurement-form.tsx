import React, {FormEvent, ReactNode} from 'react';
import {connect} from 'react-redux';

import './measurement-form.scss';
import {Block} from '../models/block.model';
import {ConnectedMeasurement} from '../measurement/measurement';
import {serializeAttributes} from '../utils';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {AppState} from '../store';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {changeInstancesCount, TutorialActions} from '../+state/tutorial.actions';
import HideInEmail from '../hide-in-email/hide-in-email';
import ShowInEmail from '../show-in-email/show-in-email';

/* tslint:disable:no-empty-interface */
interface OwnProps {
  children?: ReactNode;
  innerBlocks?: Block[];
  attributes?: {
    uuid?: string;
    name?: string;
    headline?: string;
    description?: string;
    multipleInstances?: boolean;
    instancesCountQuestion?: string;
  };
  isRenderedInEditor?: boolean;
}


interface DispatchProps {
  changeInstancesCount?: typeof changeInstancesCount
}

interface StateProps {
  instancesCount?: number
  value?: number
}

type MeasurementFormProps = StateProps & DispatchProps & OwnProps;


/* tslint:disable:no-empty-interface */
export interface MeasurementFormState {
}

const allowedComponents = {
  'irian/diy-measurement': ConnectedMeasurement
};

export const MeasurementForm = (props: MeasurementFormProps) => {
  const {
    children, attributes, innerBlocks = [], instancesCount, changeInstancesCount, value,
    isRenderedInEditor
  } = props;
  const {uuid, multipleInstances, instancesCountQuestion, headline, description} = attributes;

  const measurements = new Array(instancesCount || 1).fill(1)
    .map((value, index) => {
      const alteredBlocks = innerBlocks.map(block => {
        return {
          ...block,
          instanceIndex: index
        };
      });

      return (
        <div className="list-group-item d-flex justify-content-between align-items-start" key={index}>
          <div>
            <InnerBlocksContent
              innerBlocks={alteredBlocks}
              allowedComponents={allowedComponents}
            />
          </div>
          <HideInEmail>
            <span className="badge badge-primary badge-pill">{index + 1}</span>
          </HideInEmail>
        </div>
      );
    });

  return (
    <div data-attributes={serializeAttributes(attributes)}>
      {children}
      {
        isRenderedInEditor ?
          null :
          <div id={uuid}>
            <h4>{headline}</h4>
            <p>{description}</p>

            {multipleInstances ?
              <div className="form-group">
                <label id={`${uuid}-label`} htmlFor={uuid}>
                  {instancesCountQuestion}
                  <ShowInEmail>
                    <span>
                      <strong>
                    {instancesCount}
                      </strong>
                    </span>
                  </ShowInEmail>
                </label>
                <HideInEmail>
                  <input id={uuid} type="number" min={1} max={10} className="form-control"
                         aria-label={instancesCountQuestion}
                         value={instancesCount}
                         aria-describedby="basic-addon1"
                         onChange={(event: FormEvent<HTMLInputElement>) => {
                           changeInstancesCount(
                             uuid,
                             Math.min(10, Number.parseInt(event.currentTarget.value))
                           );
                         }}/>
                </HideInEmail>
              </div>
              : null
            }

            <div className="list-group">
              {measurements}
              {/*<HideInEmail className={"list-group-item d-flex justify-content-between align-items-start"} key="total">*/}
              {/*Sum: {value}*/}
              {/*</HideInEmail>*/}
            </div>

          </div>
      }
    </div>
  );
};


function mapStateToProps(state: AppState, ownProps: MeasurementFormProps, ownState: MeasurementFormState): StateProps {
  return {
    instancesCount: state.userContext.instancesCountByMeasurementForm[ownProps.attributes.uuid] || 1,
    value: state.userContext.measuredFormValues[ownProps.attributes.uuid]
  };
}


const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators<TutorialActions, ActionCreatorsMapObject<TutorialActions> & DispatchProps>({
    changeInstancesCount
  }, dispatch);


export const ConnectedMeasurementForm = connect<StateProps, DispatchProps, MeasurementFormProps>(
  mapStateToProps,
  mapDispatchToProps
)(MeasurementForm);

