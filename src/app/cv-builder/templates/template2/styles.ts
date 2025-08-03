
const styles = `
  body {
    direction: rtl;
  }
  .a4-page.template2 {
    font-family: 'Tajawal', sans-serif;
    width: 21cm;
    min-height: 29.7cm;
    margin: 0 auto;
    background: white;
    display: flex;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  .sidebar {
    width: 38%;
    background-color: #2c3e50;
    color: white;
    padding: 30px 20px;
    text-align: right;
  }
  .avatar-container {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid #1abc9c;
      margin: 0 auto 20px;
  }
  .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
  }
  .header-main {
      text-align: center;
      margin-bottom: 30px;
  }
  .header-main h1 {
    font-family: 'Cairo', sans-serif;
    font-size: 2em;
    font-weight: 700;
    margin: 0;
    color: #fff;
  }
  .header-main .job-title {
    font-size: 1.1em;
    color: #1abc9c;
    margin-top: 5px;
  }
  .sidebar h2 {
    font-family: 'Cairo', sans-serif;
    font-size: 1.2em;
    color: #1abc9c;
    border-bottom: 1px solid #1abc9c;
    padding-bottom: 8px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sidebar p, .sidebar li {
    font-size: 0.9em;
    line-height: 1.8;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sidebar ul {
    padding-right: 0;
    list-style-type: none;
  }
  .sidebar .contact-info, .sidebar .skills-info {
    margin-bottom: 25px;
  }
  .main-panel {
    width: 62%;
    padding: 30px;
  }
  .main-panel h2 {
    font-family: 'Cairo', sans-serif;
    font-size: 1.4em;
    font-weight: 700;
    color: #2c3e50;
    border-bottom: 2px solid #2c3e50;
    padding-bottom: 5px;
    margin: 25px 0 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .main-panel h2:first-child {
      margin-top: 0;
  }
  .item {
    margin-bottom: 20px;
  }
  .item h3 {
    font-size: 1.1em;
    font-weight: bold;
    margin: 0;
  }
  .item .sub-heading {
    font-size: 0.9em;
    color: #7f8c8d;
    margin-top: 2px;
    margin-bottom: 5px;
  }
  .item .description {
    font-size: 1em;
    line-height: 1.6;
    color: #555;
  }
`;
export default styles;
