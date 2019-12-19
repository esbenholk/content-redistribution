import React, { useEffect, useState, useRef } from "react";

export default class Drunktoggle extends React.Component {
    constructor(props) {
        super(props);
        this.toggleDrunkAnimation = this.toggleDrunkAnimation.bind(this);
        this.state = {
            buttontext: "wanna pretend to be hiiiiigh?"
        };
    }

    toggleDrunkAnimation() {
        this.props.replace();
        this.props.drunkAnimation();
        if (this.state.buttontext === "wanna pretend to be hiiiiigh?") {
            this.setState({
                buttontext: "i am ready to sober up"
            });
        } else {
            this.setState({
                buttontext: "wanna pretend to be hiiiiigh?"
            });
        }
    }
    render() {
        return (
            <div className="drunktoggle">
                <button onClick={this.toggleDrunkAnimation}>
                    {" "}
                    {this.state.buttontext}{" "}
                </button>
            </div>
        );
    }
}
