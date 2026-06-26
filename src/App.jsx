import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Droplets,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Waves,
  X,
} from 'lucide-react';
import heroImage from '../hero-AQ.webp';
import productImage from '../image.png';
import logoImage from '../logo-AQ.webp';
import ironWaterImage from '../iron-water.webp';
import hardWaterImage from '../hard-water.webp';
import mustyWaterImage from '../musty-water.webp';
import muddyWaterImage from '../muddy-water.webp';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: 'Услуги', href: '#problems' },
  { label: 'Каталог', href: '#catalog' },
  { label: 'Этапы', href: '#steps' },
  { label: 'FAQ', href: '#lead' },
];

const products = [
  {
    title: 'Умягчение воды',
    description: 'Снижает жёсткость, защищает сантехнику и технику от накипи.',
    price: 'от 37 тыс. ₽',
  },
  {
    title: 'Обезжелезивание',
    description: 'Убирает железо, металлический привкус и рыжие следы.',
    price: 'от 92 тыс. ₽',
  },
  {
    title: 'Комплексная очистка',
    description: 'Для воды со смешанными проблемами: железо, жёсткость, запах.',
    price: 'от 68 тыс. ₽',
  },
  {
    title: 'Обратный осмос',
    description: 'Финишная питьевая вода для кухни и ежедневного использования.',
    price: 'от 25 тыс. ₽',
  },
  {
    title: 'Магистральный фильтр',
    description: 'Базовая защита дома от песка, ржавчины и механических примесей.',
    price: 'от 9 тыс. ₽',
  },
  {
    title: 'Сменные картриджи',
    description: 'Плановое обслуживание фильтров без лишнего подбора вручную.',
    price: 'от 2 тыс. ₽',
  },
];

const problems = [
  {
    title: 'Железо',
    description: 'Рыжий налёт, металлический привкус и следы на сантехнике.',
    className: 'problem-card--iron',
    icon: ShieldCheck,
    image: ironWaterImage,
  },
  {
    title: 'Жёсткость',
    description: 'Накипь в чайнике, белые разводы и быстрый износ техники.',
    className: 'problem-card--hardness',
    icon: Sparkles,
    image: hardWaterImage,
  },
  {
    title: 'Запах',
    description: 'Сероводород, болотистый запах или посторонний вкус воды.',
    className: 'problem-card--smell',
    icon: Waves,
    image: mustyWaterImage,
  },
  {
    title: 'Мутность',
    description: 'Песок, глина, известь и механические примеси после скважины.',
    className: 'problem-card--turbidity',
    icon: Droplets,
    image: muddyWaterImage,
  },
];

const steps = [
  {
    title: 'Анализ',
    description: 'Проверяем воду и фиксируем основные показатели.',
  },
  {
    title: 'Подбор',
    description: 'Собираем систему под источник, дом и расход воды.',
  },
  {
    title: 'Монтаж',
    description: 'Устанавливаем и настраиваем оборудование под ключ.',
  },
  {
    title: 'Сервис',
    description: 'Поддерживаем систему и вовремя меняем расходники.',
  },
];

const phoneDisplay = '+7 (985) 730-44-66';
const phoneHref = 'tel:+79857304466';
const whatsappHref = 'https://wa.me/79859201800';

function formatRuPhone(value) {
  const digits = value.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);
  const normalized = digits.startsWith('7') ? digits : `7${digits}`;
  const rest = normalized.slice(1);
  const parts = [
    rest.slice(0, 3),
    rest.slice(3, 6),
    rest.slice(6, 8),
    rest.slice(8, 10),
  ].filter(Boolean);

  if (!parts.length) {
    return '+7 ';
  }

  let result = '+7';
  if (parts[0]) result += ` (${parts[0]}`;
  if (parts[0]?.length === 3) result += ')';
  if (parts[1]) result += ` ${parts[1]}`;
  if (parts[2]) result += `-${parts[2]}`;
  if (parts[3]) result += `-${parts[3]}`;
  return result;
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef(null);
  const [navHover, setNavHover] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-drawer-open', isOpen);
    return () => document.body.classList.remove('is-drawer-open');
  }, [isOpen]);

  const closeDrawer = () => setIsOpen(false);
  const moveNavIndicator = (event) => {
    const nav = navRef.current;
    const target = event.currentTarget;

    if (!nav || !target) return;

    const navBox = nav.getBoundingClientRect();
    const targetBox = target.getBoundingClientRect();

    setNavHover({
      x: targetBox.left - navBox.left - 7,
      y: targetBox.top - navBox.top - 6,
      width: targetBox.width + 14,
      height: targetBox.height + 12,
      opacity: 1,
    });
  };
  const hideNavIndicator = () => {
    setNavHover((current) => ({ ...current, opacity: 0 }));
  };

  return (
    <header className={`site-header ${isScrolled ? 'site-header--scrolled' : 'site-header--expanded'}`}>
      <div className="header-shell">
        <nav
          className="desktop-nav"
          aria-label="Основная навигация"
          ref={navRef}
          onPointerLeave={hideNavIndicator}
          onBlur={hideNavIndicator}
          style={{
            '--nav-hover-x': `${navHover.x}px`,
            '--nav-hover-y': `${navHover.y}px`,
            '--nav-hover-width': `${navHover.width}px`,
            '--nav-hover-height': `${navHover.height}px`,
            '--nav-hover-opacity': navHover.opacity,
          }}
        >
          <span className="nav-hover-indicator" aria-hidden="true" />
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onPointerEnter={moveNavIndicator}
              onFocus={moveNavIndicator}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="brand-wordmark" href="#top" aria-label="АКВАРЕС">
          АКВАРЕС
        </a>

        <div className="header-actions">
          <a className="header-link" href={phoneHref}>
            {phoneDisplay}
          </a>
          <a className="button button--ghost header-cta" href="#lead">
            Связаться с нами
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label="Открыть меню"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
          >
            <Menu size={20} strokeWidth={1.9} />
          </button>
        </div>
      </div>

      <div className={`mobile-drawer ${isOpen ? 'mobile-drawer--open' : ''}`}>
        <div className="drawer-panel">
          <div className="drawer-top">
            <span className="brand-wordmark">АКВАРЕС</span>
            <button className="icon-button" type="button" aria-label="Закрыть меню" onClick={closeDrawer}>
              <X size={20} />
            </button>
          </div>
          <nav className="drawer-nav" aria-label="Мобильная навигация">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={closeDrawer}>
                {item.label}
              </a>
            ))}
          </nav>
          <a className="button button--primary button--wide" href="#lead" onClick={closeDrawer}>
            Узнать стоимость
          </a>
          <div className="drawer-contacts">
            <a href={phoneHref}>
              <Phone size={16} />
              {phoneDisplay}
            </a>
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
        <button className="drawer-backdrop" type="button" aria-label="Закрыть меню" onClick={closeDrawer} />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero section-reveal" id="top" style={{ '--hero-bg': `url(${heroImage})` }}>
      <div className="hero-mobile-shade" aria-hidden="true" />
      <div className="hero-copy">
        <h1>Чистая вода — забота о вашем доме</h1>
        <p>Современные системы водоочистки для частных домов. Безопасная вода каждый день.</p>
        <div className="hero-actions">
          <a className="button button--primary" href="#lead">
            Узнать стоимость
          </a>
          <a className="button button--secondary" href="#catalog">
            Каталог
          </a>
        </div>
      </div>
    </section>
  );
}

function Catalog() {
  return (
    <section className="section section-reveal" id="catalog">
      <div className="section-heading">
        <div>
          <h2>Системы под задачу воды</h2>
        </div>
        <a className="text-link" href="#lead">
          Рассчитать проект <ArrowRight size={17} />
        </a>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" data-testid="product-card" key={product.title}>
            <div className="product-image">
              <img src={productImage} alt="" />
            </div>
            <div className="product-body">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <div className="product-bottom">
                <strong>{product.price}</strong>
                <a aria-label={`Узнать стоимость: ${product.title}`} href="#lead">
                  <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Problems() {
  return (
    <section className="section section-reveal" id="problems">
      <div className="section-heading section-heading--stacked">
        <h2>Когда воде нужна система очистки</h2>
        <p>
          Смотрим не на один симптом, а на источник, анализ и режим расхода. Так система получается
          точной, а не избыточной.
        </p>
      </div>
      <div className="problem-grid">
        {problems.map((problem) => {
          const Icon = problem.icon;
          return (
            <article
              className={`problem-card ${problem.className}`}
              data-testid="problem-card"
              key={problem.title}
            >
              <img className="problem-card__image" src={problem.image} alt="" />
              <div className="problem-card__scrim" />
              <div className="problem-card__content">
                <Icon size={22} strokeWidth={1.8} />
                <h3>{problem.title}</h3>
                <p>{problem.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="section section-reveal" id="steps">
      <div className="section-heading section-heading--stacked">
        <h2>Как мы работаем</h2>
      </div>
      <div className="steps-line">
        {steps.map((step, index) => (
          <article className="step-item" key={step.title}>
            <div className="step-index">{String(index + 1).padStart(2, '0')}</div>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LeadForm() {
  const [phone, setPhone] = useState('');

  return (
    <section className="lead-section section-reveal" id="lead">
      <div className="lead-copy">
        <h2>Узнать стоимость системы</h2>
        <p>
          Оставьте имя и телефон. Специалист уточнит источник воды, дом и задачу, а затем подготовит
          ориентир по оборудованию.
        </p>
        <div className="lead-contacts">
          <a href={phoneHref}>
            <Phone size={17} />
            {phoneDisplay}
          </a>
          <a href={whatsappHref} target="_blank" rel="noreferrer">
            <MessageCircle size={17} />
            WhatsApp
          </a>
        </div>
      </div>
      <form className="lead-form" data-testid="lead-form" data-mode="visual" onSubmit={(event) => event.preventDefault()}>
        <label>
          <span>Имя</span>
          <input type="text" name="name" autoComplete="name" placeholder="Алексей" />
        </label>
        <label>
          <span>Телефон</span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(formatRuPhone(event.target.value))}
            placeholder="+7 (___) ___-__-__"
          />
        </label>
        <button className="button button--primary button--form" type="submit">
          Узнать стоимость
        </button>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brandline">
            <img src={logoImage} alt="" />
            <span className="brand-wordmark">АКВАРЕС</span>
          </div>
          <p>Водоочистка для частных домов в Москве и области. Подбор, монтаж и сервис систем под реальную воду.</p>
        </div>
        <nav className="footer-nav" aria-label="Навигация в футере">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="footer-contacts">
          <a href={phoneHref}>{phoneDisplay}</a>
          <a href={whatsappHref} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <span>Москва и область</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const appRef = useRef(null);

  useLayoutEffect(() => {
    const resetInitialScroll = () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }

      const hash = window.location.hash;

      if (!hash) {
        window.scrollTo(0, 0);
        return;
      }

      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' });
    };

    resetInitialScroll();
    const frameId = requestAnimationFrame(resetInitialScroll);

    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis;
    let rafId;

    if (!prefersReducedMotion) {
      lenis = new Lenis({
        duration: 1.05,
        easing: (time) => 1 - Math.pow(1 - time, 3),
        smoothWheel: true,
      });

      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      gsap.fromTo(
        '.section-reveal',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: appRef.current,
            start: 'top 85%',
          },
        },
      );

      gsap.to('.hero', {
        backgroundPositionY: '48%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="app" ref={appRef}>
      <Header />
      <main>
        <Hero />
        <Catalog />
        <Problems />
        <Steps />
        <LeadForm />
      </main>
      <Footer />
    </div>
  );
}
