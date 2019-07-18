import React, {FormEvent, ReactNode} from 'react';
import {connect} from 'react-redux';

import './measurement-form.scss';
import {Block} from '../models/block.model';
import {ConnectedMeasurement} from '../measurement/measurement';
import {serializeAttributes} from '../utils';
import {InnerBlocksContent} from '../inner-blocks-content/inner-blocks-content';
import {AppState} from '../store';
import {ActionCreatorsMapObject, bindActionCreators, Dispatch} from 'redux';
import {changeInstancesCount, TutorialActions} from '../tutorial/+state/tutorial.actions';
import TextField, {Input} from '@material/react-text-field';
import MaterialIcon from '@material/react-material-icon';

/* tslint:disable:no-empty-interface */
interface OwnProps {
  className?: string;
  children?: ReactNode;
  innerBlocks?: Block[];
  attributes?: {
    uuid?: string;
    name?: string;
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
    children, className, attributes, innerBlocks = [], instancesCount, changeInstancesCount, value,
    isRenderedInEditor
  } = props;
  const {uuid} = attributes;

  const measurements = new Array(instancesCount || 1).fill(1)
    .map((value, index) => {
      const alteredBlocks = innerBlocks.map(block => {
        return {
          ...block,
          instanceIndex: index
        };
      });

      return (
        <div key={index}>
          <InnerBlocksContent
            innerBlocks={alteredBlocks}
            allowedComponents={allowedComponents}
          />
        </div>
      );
    });

  return (
    <div className={`${className} mt-md`}
         data-attributes={serializeAttributes(attributes)}>
      {children}
      {
        isRenderedInEditor ?
          null :
          <div>
            <TextField
              label={"Number of instances"}
              className={"form-control"}
              onLeadingIconSelect={() => {
                changeInstancesCount(
                  uuid, instancesCount ? instancesCount + 1 : 2
                );
              }}
              onTrailingIconSelect={() => {
                changeInstancesCount(
                  uuid, instancesCount ? Math.max(instancesCount - 1, 1) : 1
                );
              }}
              leadingIcon={<MaterialIcon role="button" icon="arrow_drop_up"/>}
              trailingIcon={<MaterialIcon role="button" icon="arrow_drop_down"/>}
            >
              <Input
                value={instancesCount || ""}
                onChange={(event: FormEvent<HTMLInputElement>) => {
                  const value = Number.parseInt(event.currentTarget.value.replace(/[^0-9]/, '')) || null;
                  changeInstancesCount(
                    uuid,
                    value
                  );
                }}/>
            </TextField>

            <div>
              {measurements}
            </div>
            
            <p>Sum: {value}</p>

          </div>
      }


    </div>
  );
};


function mapStateToProps(state: AppState, ownProps: MeasurementFormProps, ownState: MeasurementFormState): StateProps {
  return {
    instancesCount: state.tutorial.instancesCountByMeasurementForm[ownProps.attributes.uuid],
    value: state.tutorial.measuredFormValues[ownProps.attributes.uuid]
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

