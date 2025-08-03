
const styles = `
  body {
    direction: rtl;
  }
  .a4-page.template5 {
    font-family: 'Tajawal', sans-serif;
    width: 21cm;
    min-height: 29.7cm;
    margin: 0 auto;
    padding: 1.5cm;
    background: #fff;
    color: #4a4a4a;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
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
    font-family: 'Cairo', sans-serif;
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
  .contact-details div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    margin-bottom: 2px;
  }
  .content-wrapper {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 30px;
  }
  .left-column {
    order: 2;
  }
  .right-column {
    order: 1;
  }
  .left-column h2, .right-column h2 {
    font-family: 'Cairo', sans-serif;
    font-size: 1.2em;
    color: #333;
    font-weight: 600;
    margin-bottom: 15px;
    padding-bottom: 5px;
    border-bottom: 1px solid #eee;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .item {
    margin-bottom: 15px;
  }
  .item h3 {
    font-size: 1.05em;
    margin: 0;
    font-weight: bold;
  }
  .item .sub-heading {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
    color: #777;
    margin-bottom: 5px;
  }
  .item .description {
    font-size: 1em;
    color: #555;
  }
  .avatar-container {
    width: 140px;
    height: 140px;
    border-radius: 8px;
    overflow: hidden;
    margin: 0 auto 25px;
  }
  .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
  }
  .right-column ul {
    padding-right: 0;
    list-style-type: none;
  }
  .right-column li {
    margin-bottom: 8px;
    background: #f2f2f2;
    padding: 5px 10px;
    border-radius: 3px;
  }
`;
export default styles;
