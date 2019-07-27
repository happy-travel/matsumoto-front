import React from "react";
import { observable } from "mobx";

class UserStore {
    @observable id = 0;
    constructor() {
    }

    setId(value) {
        this.id = value || 0;
    }
}

export const userStore = new UserStore();

export default userStore;