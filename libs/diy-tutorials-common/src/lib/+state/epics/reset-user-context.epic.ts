import {Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {AddResponse, setUserContext, TutorialActionTypes} from '../tutorial.actions';
import {map} from 'rxjs/operators';
import {AppState} from '../app.state';
import {getSectionsPath} from '../get-sections-path';
import {initialUserContextState} from '../user-context.reducer';

export const resetUserContextEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
    return action$.pipe(
        ofType(TutorialActionTypes.ResetUserContext),
        map((action: AddResponse) => {
            const state = state$.value;
            const tutorialState = state.tutorial;
            const userContextState = state.userContext;

            const firstSection = userContextState.displayedSections[0];
            const displayedSections = getSectionsPath(tutorialState, firstSection);
            const instancesCountByMeasurementForm = {};
            const productQuantities = {};

            const {measurementForms, questions} = tutorialState;
            
            // if the tutorial doesn't have any measurements or questions show the products section
            const showProducts = !(measurementForms && measurementForms.length) && !(questions && questions.length);

            Object.keys(userContextState.instancesCountByMeasurementForm).map(key => {
                instancesCountByMeasurementForm[key] = 1;
            });
            Object.keys(userContextState.productQuantities).map(key => {
                productQuantities[key] = 0;
            });

            return {
                ...initialUserContextState,
                showProducts,
                displayedSections,
                instancesCountByMeasurementForm,
                productQuantities
            };
        }),
        map(userContextState => setUserContext(userContextState))
    );
};
