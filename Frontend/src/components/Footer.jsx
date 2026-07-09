export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        © {new Date().getFullYear()} AI Patient Health Navigator. Built for better healthcare communication.
      </div>
    </footer>
  );
}