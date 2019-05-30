import React from "react";

import { FieldText } from 'components/form';

import Flag from 'components/flag';
import {Link} from "react-router-dom";

const Tiles = class extends React.Component {

    render() {
        var {
        } = this.props;

        return (
            <div class="search block">
                <section>
                    <div class="form">
                        <div class="row">
                            <FieldText
                                label={'Destination, Hotel name, Location or Landmark'}
                                placeholder={'Choose your Destination, Hotel name, Location or Landmark'}
                                Icon={<span class="icon hotel" />}
                                Flag={false}
                                clearable
                            />
                            <FieldText
                                label={'Check In • Check Out'}
                                placeholder={'Choose date'}
                                Icon={<span class="icon calendar"/>}
                                addClass="size-medium"
                            />
                            <FieldText
                                label={'Adults • Children • Rooms'}
                                placeholder={'Choose options'}
                                Icon={<span class="icon arrows-expand"/>}
                                addClass="size-medium"
                            />
                        </div>
                        <div class="row">
                            <FieldText
                                label={'Residency'}
                                placeholder={'Choose your residency'}
                                clearable
                                Flag={<Flag />}
                                addClass="size-large"
                            />
                            <FieldText
                                label={'Nationality'}
                                placeholder={'Choose your nationality'}
                                clearable
                                Flag={<Flag />}
                                addClass="size-large"
                            />
                            <div class="field">
                                <div class="label"/>
                                <div class="inner">
                                    <Link to="/search">
                                    <button class="button">
                                        Search hotel
                                    </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="additionals">
                        <button class="button-expand">
                            Advanced Search
                        </button>
                        <button class="button-clear">
                            Clear
                        </button>
                    </div>
                </section>
            </div>
        );
    }
};

export default Tiles;
