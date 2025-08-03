
const styles = `
  body {
    font-family: 'Cairo', sans-serif;
    color: #555;
    background: #f4f4f4;
    direction: rtl;
  }
  .a4-page.creative {
    width: 21cm;
    min-height: 29.7cm;
    margin: 0 auto;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  .banner {
    background-color: #2C3E50;
    color: white;
    padding: 30px 40px;
    text-align: right;
  }
  .banner h1 {
    font-size: 3em;
    margin: 0;
    font-weight: 700;
  }
  .banner p {
    font-size: 1.4em;
    margin: 5px 0 0;
    font-weight: 300;
  }
  .main-container {
    display: flex;
  }
  .left-panel {
    width: 38%;
    background-color: #f7f9fa;
    padding: 20px;
    border-left: 1px solid #e0e0e0;
  }
  .left-panel section {
    margin-bottom: 25px;
  }
  .left-panel h3 {
    font-size: 1.2em;
    color: #2C3E50;
    border-bottom: 2px solid #2C3E50;
    padding-bottom: 5px;
    margin-bottom: 10px;
  }
  .left-panel p, .left-panel li {
    font-size: 0.9em;
    line-height: 1.7;
  }
  .left-panel ul {
    list-style: none;
    padding: 0;
  }
  .left-panel li {
    margin-bottom: 5px;
  }
  .right-panel {
    width: 62%;
    padding: 30px;
  }
  .right-panel h2 {
    font-size: 1.6em;
    color: #2C3E50;
    margin: 0 0 15px;
    font-weight: 700;
  }
  .right-panel .item {
    margin-bottom: 20px;
    padding-right: 15px;
    border-right: 3px solid #3498DB;
  }
  .right-panel .item h3 {
    font-size: 1.2em;
    margin: 0;
  }
  .right-panel .item h4 {
    font-size: 1em;
    color: #777;
    margin: 2px 0 5px;
    font-weight: normal;
  }
`;
export default styles;
