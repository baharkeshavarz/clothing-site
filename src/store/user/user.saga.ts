import { all, call,put, takeLatest } from 'typed-redux-saga/macro';
import { USER_ACTION_TYPES } from './user.types';
import { 
        AdditionalInformation,
        createAuthUserWithEmailAndPassword,
        createUserDocumentForAuth, 
        getCurrentUser,
        signInAuthUserWithEmailAndPassword,
        signOutUser } from '../../utils/firebase/firebase.utils';

import { EmailSignInStart, SignUpStart, SignUpSuccess, signInFailed, signInSuccess,
         signOutFailed, signOutSuccess, signUpFailed, signUpSuccess } from './user.action';
import { signInWithGooglePopup } from '../../utils/firebase/firebase.utils';
import { User } from 'firebase/auth';
 
export function* getSnapshotFromUserAuth (userAuth: User, additionalDetails?: AdditionalInformation) {
    try {
        const userSnapshot = yield* call(createUserDocumentForAuth, userAuth, additionalDetails);
        if (userSnapshot) {
            yield* put(signInSuccess({id: userSnapshot.id, ...userSnapshot.data()}));
        }
    } catch (error) {
        yield* put(signInFailed(error as Error));
    }
}

export function* isUserAuthenticated() {
    try {
        const userAuth = yield* call(getCurrentUser);  
        if (!userAuth) return;
        yield* call(getSnapshotFromUserAuth, userAuth as User);
    } catch (error) {
        yield* put(signInFailed(error as Error));
    }
}

export function* signInWithGoogle() {
    try {
        const {user} = yield* call(signInWithGooglePopup);
        yield* call(getSnapshotFromUserAuth, user);
    } catch (error) {
        yield* put(signInFailed(error as Error));
    }
}

//export function *signInWithEmail(action): it gets all action
export function* signInWithEmail({payload: {email, password}}: EmailSignInStart) {
  try {
    const userCredential = yield* call(signInAuthUserWithEmailAndPassword, email, password);
    if (userCredential) {
        const {user} = userCredential;
        yield* call(getSnapshotFromUserAuth, user);
    }
  } catch (error) { 
    yield* put(signInFailed(error as Error));
  }
}

export function* signUp({payload: {email, password, displayName}}: SignUpStart) {
    try {
       const userCredential = yield* call(createAuthUserWithEmailAndPassword, email, password);
       if (userCredential) {
         const {user} = userCredential;
         yield* put(signUpSuccess(user, {displayName}));
       }
    } catch (error) { 
        yield* put(signUpFailed(error as Error));
      }
} 

export function* signOut() {
    console.log('signOut');
    try {
        yield* call(signOutUser);
        yield* put(signOutSuccess());
    } catch (error) {
        yield* put(signOutFailed(error as Error));
    }
}

export function* signInAfterSignUp({payload: {user, additionalDetails}}: SignUpSuccess) {
   yield* call(getSnapshotFromUserAuth, user, additionalDetails);
}

export function* onGoogleSignInStart() {
    yield* takeLatest(USER_ACTION_TYPES.GOOGLE_SING_IN_START, signInWithGoogle);
}

export function* onEmailSignInStart() {
    yield* takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onCheckUserSession(){
    yield* takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onSignUpStart() {
    yield* takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUp);
}

export function* onSignUpSucess() {
    yield* takeLatest(USER_ACTION_TYPES.SIGN_IN_SUCCESS, signInAfterSignUp);
}

export function* onSignOutStart() {
    yield* takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

// listeners
export function* userSaga() {
    yield* all([
           call(onCheckUserSession),
           call(onGoogleSignInStart),
           call(onEmailSignInStart),
           call(onSignUpStart),
           call(onSignUpSucess),
           call(onSignOutStart),
        ]);
}