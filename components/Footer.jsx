export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>&copy; {year} Pratik Fuyal. Designed &amp; built with care.</p>
        <a href="#top" className="back-to-top">Back to top ↑</a>
      </div>
    </footer>
  );
}
