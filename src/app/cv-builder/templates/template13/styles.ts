
const styles = `
  .a4-page.template13 {
    font-family: 'Helvetica', 'Arial', sans-serif;
    display: flex;
    width: 21cm;
    min-height: 29.7cm;
    background: #fff;
    color: #333;
    direction: rtl;
  }
  .sidebar {
    width: 35%;
    background-color: #eef2ff;
    padding: 1in;
  }
  .sidebar h1 {
    font-size: 22pt;
    color: #4338ca;
    margin: 0 0 5px 0;
  }
  .sidebar .job-title {
    font-size: 13pt;
    font-weight: bold;
    margin-bottom: 2rem;
  }
  .sidebar section {
    margin-bottom: 1.5rem;
  }
  .sidebar h3 {
    font-size: 12pt;
    font-weight: bold;
    text-transform: uppercase;
    color: #4f46e5;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
  }
  .sidebar p, .sidebar li {
    font-size: 10pt;
    margin-bottom: 4px;
  }
  .sidebar ul {
      padding-right: 1rem;
      list-style-type: disc;
  }
  .main-content {
    width: 65%;
    padding: 1in;
  }
  .main-content h2 {
    font-size: 16pt;
    font-weight: bold;
    color: #4338ca;
    border-bottom: 2px solid #c7d2fe;
    padding-bottom: 5px;
    margin: 0 0 1rem 0;
  }
  .main-content section:first-child h2 {
      margin-top: 0;
  }
  .main-content section {
      margin-bottom: 1.5rem;
  }
  .item {
    margin-bottom: 1rem;
  }
  .item h3 {
    font-size: 13pt;
    font-weight: bold;
    margin: 0;
  }
  .company {
    font-size: 11pt;
    color: #64748b;
    margin: 2px 0;
  }
  p {
      margin: 0;
      font-size: 11pt;
      line-height: 1.5;
  }
`;
export default styles;
