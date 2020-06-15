import {EMPTY, Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {showProducts, TutorialActionTypes, UpdateDisplayedSections} from '../tutorial.actions';
import {filter, map} from 'rxjs/operators';
import {AppState} from '../app.state';

export const showProductsIfThereAreNoMeasurementsEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
    return action$.pipe(
        ofType(TutorialActionTypes.UpdateDisplayedSections),
        map((action: UpdateDisplayedSections) => {
            const {displayedSections} = action.payload;
            const state = state$.value;
            const tutorialState = state.tutorial;
            const {measurementForms} = tutorialState;

            if (measurementForms && measurementForms.length) {
                return false;
            }

            const lastSection = tutorialState.sections
                .filter(section => displayedSections.indexOf(section.uuid) >= 0)
                .find(section => section.submitForm);

            return !!lastSection;
        }),
        filter(show => show),
        map(show => showProducts(show))
    );
};
