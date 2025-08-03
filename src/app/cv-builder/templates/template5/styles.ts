
const styles = `
  body {
    font-family: 'Open Sans', sans-serif;
    background: #fff;
    color: #4a4a4a;
    direction: rtl;
  }
  .a4-page.professional {
    width: 21cm;
    min-height: 29.7cm;
    margin: 0 auto;
    padding: 1.5cm;
    background: #fff;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  .name-title h1 {
    font-size: 2.2em;
    margin: 0;
    font-weight: 700;
  }
  .name-title p {
    font-size: 1.1em;
    margin: 2px 0 0;
    color: #666;
  }
  .contact-details {
    font-size: 0.9em;
    text-align: left;
  }
  .content-wrapper {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
  }
  .left-column h2, .right-column h2 {
    font-size: 1.2em;
    color: #333;
    font-weight: 600;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .item {
    margin-bottom: 15px;
  }
  .item h3 {
    font-size: 1.05em;
    margin: 0;
  }
  .item .sub-heading {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
    color: #777;
    margin-bottom: 5px;
  }
  .right-column ul {
    padding-right: 0;
    list-style-type: none;
  }
  .right-column li {
    margin-bottom: 5px;
    background: #f2f2f2;
    padding: 5px 10px;
    border-radius: 3px;
  }
`;
export default styles;
