
const styles = `
  .a4-page.template9 {
    font-family: 'Tajawal', sans-serif;
    display: flex;
    width: 21cm;
    min-height: 29.7cm;
    background: #fff;
    direction: rtl;
  }
  .left-column {
    width: 33%;
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 1.5cm;
  }
  .right-column {
    width: 67%;
    padding: 1.5cm;
  }
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto 20px;
    border: 4px solid #f1c40f;
  }
  .left-column h2 {
    font-family: 'Cairo', sans-serif;
    color: #f1c40f;
    font-size: 1.2em;
    border-bottom: 1px solid #f1c40f;
    padding-bottom: 5px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .left-column .item h3 { font-size: 1em; margin: 0; }
  .left-column .item p { font-size: 0.9em; margin: 2px 0 0; color: #bdc3c7; }
  .left-column .item .date { font-size: 0.8em; }
  .left-column ul { padding-right: 15px; list-style: circle; }
  .left-column li { margin-bottom: 5px; }

  .right-column .header {
    margin-bottom: 30px;
  }
  .right-column .header h1 {
    font-family: 'Cairo', sans-serif;
    font-size: 3em;
    color: #2c3e50;
    margin: 0;
  }
  .right-column .header p {
    font-size: 1.4em;
    color: #34495e;
    margin: 0;
  }
  .right-column h2 {
    font-family: 'Cairo', sans-serif;
    font-size: 1.6em;
    color: #2c3e50;
    border-right: 4px solid #f1c40f;
    padding-right: 10px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .right-column p { color: #34495e; line-height: 1.7; }
  .right-column .experience-item {
    margin-bottom: 20px;
  }
  .right-column .experience-item h3 {
    font-size: 1.2em;
    color: #2c3e50;
    font-weight: bold;
    margin: 0;
  }
  .right-column .experience-item .company {
    font-size: 1em;
    color: #7f8c8d;
    margin: 2px 0 5px;
  }
  section { margin-bottom: 25px; }
`;
export default styles;

    