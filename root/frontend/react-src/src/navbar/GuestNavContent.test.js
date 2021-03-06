import React from 'react';
import { shallow } from 'enzyme';
import { NavLink } from 'react-router-dom';

import GuestNavContent from './GuestNavContent';

describe('GuestNavContent component', () => {
    it('Should render links to signup and login', () => {
        const wrapper = shallow(<GuestNavContent />);

        expect(wrapper.find(NavLink).findWhere(link => link.props()['to'] === '/login').length).toBe(1);
        expect(wrapper.find(NavLink).findWhere(link => link.props()['to'] === '/signup').length).toBe(1);
    })
})
