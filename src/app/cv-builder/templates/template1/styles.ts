
const styles = `
  body {
    font-family: 'Almarai', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f9f9f9;
    direction: rtl;
  }
  .a4-page {
    width: 21cm;
    height: 29.7cm;
    margin: 0 auto;
    padding: 2cm;
    background: white;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  .header {
    text-align: center;
    border-bottom: 2px solid #007BFF;
    padding-bottom: 15px;
    margin-bottom: 20px;
  }
  .header-main h1 {
    font-size: 2.5em;
    margin: 0;
    color: #007BFF;
  }
  .header-main p {
    font-size: 1.2em;
    margin: 5px 0 0;
    color: #555;
  }
  .header-contact {
    margin-top: 15px;
    font-size: 0.9em;
  }
  .header-contact p {
    margin: 2px 0;
  }
  .main-content {
  }
  .section {
    margin-bottom: 20px;
  }
  .section-title {
    font-size: 1.5em;
    color: #007BFF;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    margin-bottom: 15px;
  }
  .item {
    margin-bottom: 15px;
  }
  .item h3 {
    font-size: 1.2em;
    margin: 0;
  }
  .item .company {
    font-size: 1em;
    color: #666;
    margin: 2px 0 5px;
  }
  .skills-list {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .skills-list li {
    background-color: #e9f5ff;
    color: #007BFF;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.9em;
  }
`;
export default styles;
