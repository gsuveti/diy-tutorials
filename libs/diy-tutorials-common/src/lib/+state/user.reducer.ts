import {AnyAction, createReducer} from 'redux-starter-kit'
import {GetUserData, TutorialActionTypes} from './tutorial.actions';

export interface UserState {
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    providerId: string;
    /**
     * The user's unique ID.
     */
    uid: string;
    isAnonymous: boolean;
}

export const initialUserState: UserState = {
    displayName: null,
    email: null,
    phoneNumber: null,
    photoURL: null,
    providerId: null,
    uid: null,
    isAnonymous: true,
};

export const userReducer = createReducer(initialUserState, {
    [TutorialActionTypes.GetUserData]: (state: UserState, action: GetUserData) => {
        const {user} = action.payload;
        if (user) {
            state.isAnonymous = user.isAnonymous;
            state.email = user.email;
            state.displayName = user.displayName;
            state.uid = user.uid;
        } else {
            //reset user
            state.isAnonymous = undefined;
            state.email = undefined;
            state.displayName = undefined;
            state.uid = undefined;
        }

        return state;
    },
    [TutorialActionTypes.LoginWithEmail]: (state: UserState, action: AnyAction) => {
        const {email} = action.payload;

        state.email = email;

        return state;
    },
});
