import React from 'react';
import { NavLink, Link } from 'react-router-dom';

class Navbar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            collapsed: true
        };
        this.toggleNavbar = this.toggleNavbar.bind(this);
        this.collapseNavbar = this.collapseNavbar.bind(this);
    }

    toggleNavbar() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    collapseNavbar() {
        this.setState({
            collapsed: true
        });
    }

    render() {
        const collapsed = this.state.collapsed;
        const collapsibleNavbarClass = collapsed ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';

        return (
            <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top">
                <div className="container">

                    {/* Brand */}
                    <Link className="navbar-brand" to="/">GymMate</Link>

                    {/* Collapse toggler button */}
                    <button onClick={this.toggleNavbar} className="navbar-toggler" type="button">
                        <span className="navbar-toggler-icon"/>
                    </button>

                    {/* Collapsible navbar items */}
                    <div className={collapsibleNavbarClass}>
                        <ul className="navbar-nav ml-auto">

                            <li className="nav-item" onClick={this.collapseNavbar}>
                                <NavLink className="nav-link" exact to="/" >Home</NavLink>
                            </li>

                            <li className="nav-item" onClick={this.collapseNavbar}>
                                <NavLink className="nav-link" to="/programs">Programs</NavLink>
                            </li>

                            <li className="nav-item" onClick={this.collapseNavbar}>
                                <NavLink className="nav-link" to="/exercises">Exercises</NavLink>
                            </li>

                            <li className="nav-item" onClick={this.collapseNavbar}>
                                <NavLink className="nav-link" to="/profile">Profile</NavLink>
                            </li>

                            <li className="nav-item" onClick={this.collapseNavbar}>
                                <a className="nav-link">Sign up</a>
                            </li>

                            <li className="nav-item" onClick={this.collapseNavbar}>
                                <a className="nav-link">Log in</a>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;
