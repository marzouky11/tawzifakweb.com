
const styles = `
  body {
    font-family: 'Tajawal', sans-serif;
    background-color: #f0f0f0;
    direction: rtl;
  }
  .a4-page.classic {
    width: 21cm;
    min-height: 29.7cm;
    margin: 0 auto;
    background: white;
    display: flex;
  }
  .sidebar {
    width: 35%;
    background-color: #34495E;
    color: white;
    padding: 20px;
  }
  .sidebar h2 {
    font-size: 1.3em;
    color: #1ABC9C;
    border-bottom: 1px solid #1ABC9C;
    padding-bottom: 8px;
    margin-bottom: 15px;
  }
  .sidebar p, .sidebar li {
    font-size: 0.9em;
    line-height: 1.8;
  }
  .sidebar ul {
    padding-right: 20px;
  }
  .main-panel {
    width: 65%;
    padding: 30px;
  }
  .main-panel header {
    text-align: right;
    margin-bottom: 30px;
  }
  .main-panel header h1 {
    font-size: 2.8em;
    margin: 0;
    color: #2C3E50;
  }
  .main-panel header .job-title {
    font-size: 1.3em;
    color: #7f8c8d;
    margin-top: 5px;
  }
  .main-panel section h2 {
    font-size: 1.5em;
    color: #34495E;
    border-bottom: 2px solid #34495E;
    padding-bottom: 5px;
    margin: 25px 0 15px;
  }
  .item {
    margin-bottom: 20px;
  }
  .item h3 {
    font-size: 1.1em;
    margin: 0;
  }
  .item .sub-heading {
    font-size: 0.9em;
    color: #7f8c8d;
    margin-top: 2px;
  }
  .item p {
    font-size: 1em;
    line-height: 1.6;
  }
`;
export default styles;
