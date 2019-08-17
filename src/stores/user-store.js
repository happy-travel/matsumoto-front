import React from "react";
import { observable } from "mobx";
import autosave from "core/misc/autosave";

class UserStore {
    @observable id = 0;
    constructor() {
        autosave(this, "_user_store_cache");
    }

    setId(value) {
        this.id = value || 0;
    }
}

export default new UserStore();
