
const styles = `
  body {
    font-family: 'Roboto', sans-serif;
    background: #f5f5f5;
    color: #333;
    font-size: 16px;
    direction: rtl;
  }
  .a4-page.simple {
    width: 21cm;
    min-height: 29.7cm;
    margin: 0 auto;
    background: white;
    padding: 2.5cm;
  }
  .grid-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
  }
  header {
    margin-bottom: 30px;
  }
  header h1 {
    font-size: 2.6em;
    margin: 0;
    font-weight: 700;
  }
  header .job-title {
    font-size: 1.2em;
    color: #555;
    margin-top: 5px;
    font-weight: 300;
  }
  .section-title {
    font-size: 1.3em;
    font-weight: bold;
    color: #000;
    margin: 20px 0 10px;
    border-bottom: 1.5px solid #ccc;
    padding-bottom: 5px;
  }
  .item {
    margin-bottom: 15px;
  }
  .item h3 {
    font-size: 1.1em;
    margin: 0 0 2px 0;
  }
  .item .sub-heading {
    font-size: 0.9em;
    color: #777;
    margin-bottom: 5px;
  }
  .sidebar {
    border-right: 1px solid #eee;
    padding-right: 20px;
  }
  .sidebar h3 {
    font-size: 1.1em;
    color: #000;
    margin-bottom: 10px;
  }
  .sidebar p, .sidebar li {
    font-size: 0.95em;
    margin-bottom: 5px;
  }
  .sidebar ul {
    padding-right: 15px;
    list-style-type: disc;
  }
  .contact-section, .skills-section {
    margin-bottom: 25px;
  }
`;
export default styles;
