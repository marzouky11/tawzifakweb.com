
const styles = `
  .a4-page.template10 {
    font-family: 'Tajawal', sans-serif;
    padding: 1.5cm;
    width: 21cm;
    min-height: 29.7cm;
    background: #fff;
    color: #333;
    direction: rtl;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: right;
    border-bottom: 1px solid #ccc;
    padding-bottom: 15px;
    margin-bottom: 15px;
  }
  .header h1 {
    font-family: 'Cairo', sans-serif;
    font-size: 2.8em;
    margin: 0;
    line-height: 1.1;
  }
  .header .job-title {
    font-size: 1.2em;
    color: #555;
    margin-top: 5px;
  }
  .avatar {
    width: 90px;
    height: 90px;
    border-radius: 5px;
    object-fit: cover;
  }
  .contact-info {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
    margin-bottom: 25px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .contact-info span {
      display: flex;
      align-items: center;
      gap: 5px;
  }
  section {
    margin-bottom: 20px;
  }
  h2 {
    font-family: 'Cairo', sans-serif;
    font-size: 1.3em;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .item {
    margin-bottom: 15px;
  }
  .item h3 {
    font-size: 1.1em;
    font-weight: bold;
    margin: 0;
  }
  .item .sub-heading {
    font-size: 0.9em;
    color: #666;
    margin: 2px 0;
  }
  ul {
    list-style-position: inside;
    padding: 0;
    margin: 0;
  }
  li {
    margin-bottom: 5px;
  }
  .grid-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
`;
export default styles;

    