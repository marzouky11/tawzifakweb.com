
const styles = `
  body {
    direction: rtl;
  }
  .a4-page.template6 {
    font-family: 'Cairo', sans-serif;
    width: 21cm;
    min-height: 29.7cm;
    margin: 0 auto;
    background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    color: #555;
  }
  .banner {
    background-color: #3498DB;
    color: white;
    padding: 30px 40px;
    text-align: center;
    position: relative;
  }
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid white;
    object-fit: cover;
    margin: 0 auto 15px;
  }
  .banner h1 {
    font-size: 2.8em;
    margin: 0;
    font-weight: 700;
  }
  .banner p {
    font-size: 1.3em;
    margin: 5px 0 0;
    font-weight: 300;
  }
  .main-container {
    display: flex;
  }
  .left-panel {
    width: 38%;
    background-color: #f7f9fa;
    padding: 25px;
    border-left: 1px solid #e0e0e0;
  }
  .left-panel section {
    margin-bottom: 25px;
  }
  .left-panel h3 {
    font-size: 1.2em;
    color: #3498DB;
    border-bottom: 2px solid #3498DB;
    padding-bottom: 5px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .left-panel p, .left-panel li, .left-panel h4 {
    font-size: 0.9em;
    line-height: 1.7;
    margin: 0;
  }
   .left-panel .item {
      margin-bottom: 15px;
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
    font-size: 1.5em;
    color: #2C3E50;
    margin: 0 0 15px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .right-panel .item {
    margin-bottom: 20px;
    padding-right: 15px;
    border-right: 3px solid #3498DB;
    position: relative;
  }
   .right-panel .item::before {
    content: '';
    position: absolute;
    top: 5px;
    right: -6px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #3498DB;
    border: 2px solid white;
  }
  .right-panel .item h3 {
    font-size: 1.15em;
    font-weight: bold;
    margin: 0;
  }
  .right-panel .item h4 {
    font-size: 1em;
    color: #777;
    margin: 2px 0 5px;
    font-weight: normal;
  }
  .right-panel .item .description {
    font-size: 1em;
    line-height: 1.6;
  }
`;
export default styles;
