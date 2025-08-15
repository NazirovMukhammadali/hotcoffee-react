// @ts-nocheck
import React, { Component } from "react";

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            brand: "Ford",
            model: "Mustang",
            color: "red",
            year: 1964
        };
    }
    changeColor = () => {
        this.setState({ color: "blue" });
    }

    changeDetail = () => {
        this.setState({
            color: "blue",
            brand: "Tesla",
            model: "Model S",
            year: 2023,
        });
    };

    componentDidMount() {
        console.log("componentDidMount");
        // run after first render => RETRIVER DATA FROM BACKEND SERVER
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");
        // run before component unmount
    }

    componentDidUpdate() { }

    render() {
        return (
            <div>
                <h1>My {this.state.brand}</h1>
                <p>
                    Color: {this.state.color} - Model {this.state.model} from{" "} {this.state.year}.
                </p>
                <button
                    type="button"
                    onClick={this.changeDetail}
                >Change Detail</button>
            </div>
        );
    }
}

export default Test;