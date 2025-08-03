
const styles = `
  .a4-page.template7 {
    font-family: 'Tajawal', sans-serif;
    display: flex;
    direction: rtl;
    width: 21cm;
    min-height: 29.7cm;
    background: #fff;
  }
  .main-content {
    flex-grow: 1;
    padding: 1.5cm;
    border-left: 1px solid #e0e0e0;
  }
  .sidebar {
    width: 35%;
    padding: 1.5cm;
    background-color: #f8f9fa;
  }
  .header {
    text-align: center;
    margin-bottom: 30px;
  }
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 15px;
    border: 4px solid #10b981;
  }
  .header h1 {
    font-family: 'Cairo', sans-serif;
    font-size: 2.4em;
    color: #333;
    margin: 0;
  }
  .header p {
    font-size: 1.2em;
    color: #10b981;
  }
  .main-content h2 {
    font-family: 'Cairo', sans-serif;
    font-size: 1.5em;
    color: #10b981;
    border-bottom: 2px solid #10b981;
    padding-bottom: 8px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .item {
    margin-bottom: 20px;
  }
  .item h3 {
    font-size: 1.1em;
    font-weight: bold;
    margin-bottom: 2px;
  }
  .item .sub-heading {
    font-size: 0.95em;
    color: #666;
    margin-bottom: 5px;
  }
  .sidebar h3 {
    font-family: 'Cairo', sans-serif;
    font-size: 1.3em;
    color: #333;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sidebar p, .sidebar li {
    font-size: 0.95em;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sidebar ul {
    list-style-type: none;
    padding: 0;
  }
`;
export default styles;

    