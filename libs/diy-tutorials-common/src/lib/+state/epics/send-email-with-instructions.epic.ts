import {from, Observable} from 'rxjs';
import {AnyAction} from 'redux';
import {ofType, StateObservable} from 'redux-observable';
import {SendEmailWithInstructions, TutorialActionTypes} from '../tutorial.actions';
import {map, switchMap} from 'rxjs/operators';
import {AppState} from '../app.state';
import * as firebase from 'firebase/app';

export const sendEmailWithInstructionsEpic = (action$: Observable<AnyAction>, state$: StateObservable<AppState>) => {
    return action$.pipe(
        ofType(TutorialActionTypes.SendEmailWithInstructions),
        switchMap((action: SendEmailWithInstructions) => {
            const {email} = action.payload;

            const content = getContent();
            const displayedSections = getSections();

            const data = {
                title: getTitleText(),
                tutorialUrl: window.location.href,
                createdAt: new Date().toISOString(),
                content,
                displayedSections,
                email
            };

            console.log(JSON.stringify(data));

            return from(firebase.firestore().collection(`instructions-emails`).add(data)).pipe(
                map(() => {
                    return {type: TutorialActionTypes.InstructionsEmailSent}
                })
            );
        })
    );
};

function getTitleText() {
    return document.querySelector('.post .entry-title').innerHTML;
}

function getContent() {
    const rootParent = document.getElementById('root').parentElement;

    return Array.from(rootParent.children)
        .filter(elem => elem.id !== 'root')
        .reduce((acc, item) => {
            return acc + item.outerHTML
        }, '');
}

function getSections() {
    return Array.from(document.querySelectorAll('#root>div>.show:not(.product-list)'))
        .reduce((acc, item) => {
            return acc + item.outerHTML
        }, '');
}
