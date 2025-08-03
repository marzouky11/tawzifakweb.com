
const styles = `
  body {
    font-family: 'Lato', sans-serif;
    background-color: #e8e8e8;
    color: #444;
    direction: rtl;
  }
  .a4-page.elegant {
    width: 21cm;
    min-height: 29.7cm;
    margin: 0 auto;
    background: #fff;
    border-top: 10px solid #C0392B;
  }
  .container {
    padding: 40px;
  }
  .header {
    text-align: center;
    margin-bottom: 20px;
  }
  .header h1 {
    font-size: 2.8em;
    margin: 0;
    font-weight: 900;
    color: #2c3e50;
  }
  .header .job-title {
    font-size: 1.3em;
    color: #C0392B;
    margin: 5px 0;
    font-weight: 300;
  }
  .contact-bar {
    text-align: center;
    font-size: 0.9em;
    padding: 10px 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-bottom: 30px;
    color: #7f8c8d;
  }
  .section {
    margin-bottom: 25px;
  }
  .section-title {
    font-size: 1.4em;
    color: #C0392B;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #C0392B;
    font-weight: bold;
  }
  .item {
    margin-bottom: 15px;
  }
  .item h3 {
    font-size: 1.1em;
    font-weight: bold;
    margin: 0 0 2px 0;
  }
  .item .sub-heading {
    font-style: italic;
    color: #555;
    margin-bottom: 5px;
    font-size: 0.9em;
  }
  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .skill-tag {
    background: #ecf0f1;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 0.9em;
  }
`;
export default styles;
