import { USER_ACTION } from './actions';
import { initialState } from './init';

export interface UserState {
  email: string
  signature: string
  credentialId: string
}


export const userReducer = (state: UserState = initialState, action: any): UserState => {
  switch (action.type) {
    case USER_ACTION.SET_EMAIL:
      return {
        ...state,
        email: action.value,
      };
    case USER_ACTION.SET_SIGNATURE:
      return {
        ...state,
        signature: action.value,
      };
    case USER_ACTION.SET_CREDENTIAL_ID:
      return {
        ...state,
        credentialId: action.value,
      };
    case USER_ACTION.SIGN_OUT:
      return {
        email: '',
        credentialId: '',
        signature: '',
      }
    case USER_ACTION.SET_USER:
      return {
        email: action.value.email,
        credentialId: action.value.credentialId,
        signature: action.value.signature,
      }
    default:
      return state;
  }
}
