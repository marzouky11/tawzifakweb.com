
const styles = `
  .a4-page.template3 {
    font-family: 'Cairo', sans-serif;
    width: 21cm;
    min-height: 29.7cm;
    margin: 0 auto;
    background: #fff;
    border-top: 10px solid #C0392B;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    box-sizing: border-box;
    direction: rtl;
  }
  .a4-page.template3 .container {
    padding: 30px 40px;
  }
  .a4-page.template3 .header {
    text-align: center;
    margin-bottom: 20px;
  }
  .a4-page.template3 .avatar {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 15px;
      border: 4px solid #C0392B;
  }
  .a4-page.template3 .header h1 {
    font-size: 2.6em;
    margin: 0;
    font-weight: 700;
    color: #2c3e50;
  }
  .a4-page.template3 .header .job-title {
    font-size: 1.2em;
    color: #C0392B;
    margin: 5px 0;
    font-weight: 400;
  }
  .a4-page.template3 .contact-bar {
    text-align: center;
    font-size: 0.9em;
    padding: 10px 0;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-bottom: 30px;
    color: #7f8c8d;
    display: flex;
    justify-content: center;
    gap: 15px;
    flex-wrap: wrap;
  }
   .a4-page.template3 .contact-bar span {
      display: flex;
      align-items: center;
      gap: 5px;
  }
  .a4-page.template3 .section {
    margin-bottom: 25px;
  }
  .a4-page.template3 .section-title {
    font-size: 1.3em;
    color: #C0392B;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 2px solid #C0392B;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .a4-page.template3 .item {
    margin-bottom: 15px;
  }
  .a4-page.template3 .item h3 {
    font-size: 1.1em;
    font-weight: bold;
    margin: 0 0 2px 0;
  }
  .a4-page.template3 .item .sub-heading {
    font-style: italic;
    color: #555;
    margin-bottom: 5px;
    font-size: 0.9em;
  }
  .a4-page.template3 .item .description {
    font-size: 1em;
    color: #555;
  }
  .a4-page.template3 .skills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .a4-page.template3 .skill-tag {
    background: #ecf0f1;
    color: #34495e;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 0.9em;
  }
  .a4-page.template3 .grid-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
`;
export default styles;
