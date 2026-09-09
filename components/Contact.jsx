'use client';

import { useState } from 'react';
import Magnetic from '@/components/Magnetic';
import { CONTACT_EMAIL, LINKS, LINK_LABELS } from '@/lib/config';

const IDLE = { state: 'idle', message: '' };

export default function Contact() {
  const [status, setStatus] = useState(IDLE);
  const sending = status.state === 'sending';
  const socials = Object.entries(LINKS).filter(([, href]) => Boolean(href));

  const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());
    setStatus({ state: 'sending', message: '' });

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || String(result.success) !== 'true') {
        throw new Error(result.message || 'Request failed');
      }
      form.reset();
      setStatus({ state: 'success', message: 'Thanks! Your message is on its way.' });
      setTimeout(() => setStatus(IDLE), 4000);
    } catch (_) {
      setStatus({
        state: 'error',
        message: `Something went wrong. Please email me directly at ${CONTACT_EMAIL}.`,
      });
    }
  };

  const buttonLabel =
    status.state === 'sending' ? 'Sending\u2026' : status.state === 'success' ? 'Sent \u2713' : 'Send message';

  return (
    <section id="contact" className="section container">
      <div className="section-heading reveal">
        <span className="section-number">04</span>
        <h2>Contact</h2>
      </div>

      <div className="contact-grid">
        <div className="contact-info reveal">
          <p className="contact-lead">
            Have a project in mind, a question about ML, or just want to say hello?
            My inbox is always open.
          </p>
          <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <div className="contact-links">
            {socials.map(([key, href]) => (
              <Magnetic
                key={key}
                href={href}
                className="btn btn-ghost"
                target="_blank"
                rel="noopener noreferrer"
              >
                {LINK_LABELS[key] || key}
              </Magnetic>
            ))}
          </div>
        </div>

        <form
          className="contact-form reveal"
          action={`https://formsubmit.co/${CONTACT_EMAIL}`}
          method="POST"
          noValidate
          onSubmit={onSubmit}
        >
          <input type="hidden" name="_subject" value="New message from your portfolio" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="text" name="_honey" className="honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <div className="field">
            <input id="cf-name" name="name" type="text" placeholder=" " autoComplete="name" required />
            <label htmlFor="cf-name">Your name</label>
          </div>
          <div className="field">
            <input id="cf-email" name="email" type="email" placeholder=" " autoComplete="email" required />
            <label htmlFor="cf-email">Email address</label>
          </div>
          <div className="field">
            <textarea id="cf-message" name="message" rows={5} placeholder=" " required />
            <label htmlFor="cf-message">Message</label>
          </div>

          <Magnetic as="button" type="submit" className="btn btn-primary form-submit" disabled={sending}>
            <span className="btn-label">{buttonLabel}</span>
          </Magnetic>
          <p className={`form-status${status.state === 'success' || status.state === 'error' ? ` is-${status.state}` : ''}`} role="status" aria-live="polite">
            {status.message}
          </p>
        </form>
      </div>
    </section>
  );
}
