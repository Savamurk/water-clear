import { render, screen } from '@testing-library/react';
import App from './App.jsx';

describe('Filtr Dam homepage prototype', () => {
  it('renders the approved hero and navigation without legacy AquaClear copy', () => {
    const { container } = render(<App />);

    expect(container.querySelector('.header-brand-logo[aria-label="ФИЛЬТР ДАМ"] img')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Чистая вода — забота о вашем доме',
    );
    expect(screen.getAllByRole('link', { name: 'Узнать стоимость' }).length).toBeGreaterThan(0);
    expect(screen.queryByText(/AQUACLEAR/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/АКВАРЕС/i)).not.toBeInTheDocument();
  });

  it('renders six catalog cards and four problem cards from the plan', () => {
    const { container } = render(<App />);

    expect(screen.getAllByTestId('product-card')).toHaveLength(6);
    expect(screen.getAllByTestId('problem-card')).toHaveLength(4);
    expect(container.querySelectorAll('.problem-card__image')).toHaveLength(4);
    expect(container.querySelectorAll('.product-image span')).toHaveLength(0);
    expect(container.querySelectorAll('.section-label')).toHaveLength(0);
  });

  it('keeps the lead form visual and non-submitting', () => {
    render(<App />);

    const form = screen.getByTestId('lead-form');
    expect(form).toHaveAttribute('data-mode', 'visual');
    expect(screen.getByLabelText('Имя')).toBeInTheDocument();
    expect(screen.getByLabelText('Телефон')).toBeInTheDocument();
  });

  it('uses the logo without duplicate brand text in the footer', () => {
    const { container } = render(<App />);
    const footerBrandline = container.querySelector('.footer-brandline');

    expect(footerBrandline).toBeInTheDocument();
    expect(screen.getByAltText('ФИЛЬТР ДАМ')).toBeInTheDocument();
    expect(footerBrandline.querySelector('img')).toBeInTheDocument();
    expect(footerBrandline).not.toHaveTextContent('ФИЛЬТР ДАМ');
  });
});
