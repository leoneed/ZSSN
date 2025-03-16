import React from 'react';
import { render, screen } from '@testing-library/react';
import IsInfected from './IsInfected';

jest.mock('./img/infected.png', () => 'infected.png');
jest.mock('./img/notInfected.png', () => 'notInfected.png');

describe('IsInfected Component', () => {
  test('renders the infected image when infected=true', () => {
    render(<IsInfected infected={true} />);

    const image = screen.getByAltText('Infected');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'infected.png');
  });

  test('renders the not infected image when infected=false', () => {
    render(<IsInfected infected={false} />);

    const image = screen.getByAltText('Not infected');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'notInfected.png');
  });
});
