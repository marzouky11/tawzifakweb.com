
const styles = `
  .a4-page.template8 {
    font-family: 'Cairo', sans-serif;
    background-color: #1a202c;
    color: #cbd5e0;
    width: 21cm;
    min-height: 29.7cm;
    padding: 1.5cm;
    direction: rtl;
  }
  .header {
    display: flex;
    align-items: center;
    gap: 20px;
    border-bottom: 2px solid #4a5568;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #a0aec0;
  }
  .header h1 {
    font-size: 2.5em;
    color: #fff;
    margin: 0;
  }
  .header p {
    font-size: 1.3em;
    color: #718096;
  }
  .content {
    display: flex;
    gap: 30px;
  }
  .main-column {
    flex: 2;
  }
  .sidebar-column {
    flex: 1;
  }
  .main-column h2 {
    font-size: 1.4em;
    color: #a0aec0;
    border-bottom: 1px solid #4a5568;
    padding-bottom: 5px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sidebar-column h3 {
    font-size: 1.2em;
    color: #a0aec0;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .item {
    margin-bottom: 15px;
  }
  .item h3, .item h4 {
    color: #e2e8f0;
    margin: 0;
  }
  .item .sub-heading {
    font-size: 0.9em;
    color: #718096;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .tag {
    background-color: #2d3748;
    color: #a0aec0;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.9em;
  }
  section { margin-bottom: 20px; }
  p { line-height: 1.6; }
`;
export default styles;

    