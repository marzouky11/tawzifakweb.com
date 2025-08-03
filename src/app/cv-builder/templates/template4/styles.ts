
const styles = `
  body {
    direction: rtl;
  }
  .a4-page.template4 {
    font-family: 'Tajawal', sans-serif;
    width: 21cm;
    min-height: 29.7cm;
    margin: 0 auto;
    background: white;
    color: #444;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }
  .grid-container {
    display: flex;
    flex-direction: row;
  }
  .sidebar {
    width: 35%;
    background-color: #f8f9fa;
    padding: 30px;
    border-left: 1px solid #e9ecef;
  }
  .avatar-container {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 20px;
    border: 3px solid #dee2e6;
  }
  .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
  }
  .sidebar header {
    text-align: center;
    margin-bottom: 30px;
  }
  .sidebar header h1 {
    font-family: 'Cairo', sans-serif;
    font-size: 2em;
    margin: 0;
    font-weight: 700;
  }
  .sidebar header .job-title {
    font-size: 1.1em;
    color: #007bff;
    margin-top: 5px;
  }
  .sidebar h3 {
    font-family: 'Cairo', sans-serif;
    font-size: 1.1em;
    font-weight: bold;
    color: #343a40;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sidebar p, .sidebar li {
    font-size: 0.9em;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sidebar ul {
    padding-right: 15px;
    list-style-type: none;
    padding: 0;
  }
  .contact-section, .skills-section {
    margin-bottom: 25px;
  }
  .main-content {
    width: 65%;
    padding: 40px;
  }
  .main-content .section-title {
    font-family: 'Cairo', sans-serif;
    font-size: 1.3em;
    font-weight: bold;
    color: #007bff;
    margin: 20px 0 15px;
    border-bottom: 1.5px solid #007bff;
    padding-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
   .main-content section:first-child .section-title {
    margin-top: 0;
  }
  .item {
    margin-bottom: 15px;
  }
  .item h3 {
    font-size: 1.1em;
    margin: 0 0 2px 0;
    font-weight: bold;
  }
  .item .sub-heading {
    font-size: 0.9em;
    color: #6c757d;
    margin-bottom: 5px;
  }
  .item .description {
    font-size: 1em;
    line-height: 1.6;
  }
`;
export default styles;
