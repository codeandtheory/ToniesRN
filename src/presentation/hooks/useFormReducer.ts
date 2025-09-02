import { useReducer } from "react";

export type UserState = {
    name: string,
    gender: string,
    dob: Date,
    showPicker: boolean,
};

export interface SetNameAction {
    type: "setName",
    payLoad: string,
}

export interface SetGenderAction {
    type: "setGender",
    payLoad: string,
}

export interface SetDobAction {
    type: "setDob",
    payLoad: Date,
}

export interface ShowPickerAction {
    type: "showPicker"
    payLoad: boolean,
}

export type FormAction = SetNameAction | SetGenderAction | SetDobAction | ShowPickerAction

const defaultState: UserState = {
    name: "",
    gender: "",
    dob: new Date(),
    showPicker: false
}

function formReducer(state: UserState, action: FormAction): UserState {
    switch (action.type) {
        case "setName" : return {...state, name: action.payLoad as string};
        case "setGender": return {...state, gender: action.payLoad as string};
        case "setDob": return {...state, dob: action.payLoad as Date};
        case "showPicker": return {...state, showPicker: action.payLoad as boolean};
        default: return state;
    }
}

export function useFormReducer(initialState: UserState = defaultState) {
    return useReducer(formReducer, initialState);
}