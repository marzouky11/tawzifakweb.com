
const styles = `
  .a4-page.template1 {
    font-family: 'Tajawal', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #fff;
    width: 21cm;
    min-height: 29.7cm;
    margin: 0 auto;
    padding: 1.5cm;
    display: flex;
    flex-direction: column;
    direction: rtl;
  }
  .header {
    text-align: right;
    border-bottom: 2px solid #0056b3;
    padding-bottom: 15px;
    margin-bottom: 25px;
  }
  .header-content {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 15px;
  }
  .avatar-container {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #0056b3;
    flex-shrink: 0;
  }
  .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
  }
  .header-text h1 {
    font-family: 'Cairo', sans-serif;
    font-size: 2.2em;
    font-weight: 700;
    margin: 0;
    color: #0056b3;
  }
  .header-text .job-title {
    font-size: 1.2em;
    margin: 5px 0 0;
    color: #555;
  }
  .contact-info {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 15px;
    font-size: 0.9em;
    color: #444;
  }
  .contact-info span {
      display: flex;
      align-items: center;
      gap: 5px;
  }
  .section {
    margin-bottom: 20px;
  }
  .section-title {
    font-family: 'Cairo', sans-serif;
    font-size: 1.4em;
    font-weight: 700;
    color: #0056b3;
    border-bottom: 1px solid #ddd;
    padding-bottom: 8px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .section-title .icon {
      color: #007bff;
  }
  .item {
    margin-bottom: 15px;
  }
  .item h3 {
    font-size: 1.1em;
    font-weight: bold;
    margin: 0 0 2px;
  }
  .item .company {
    font-size: 0.95em;
    color: #666;
    margin: 2px 0 5px;
  }
   .item .description {
      font-size: 1em;
      color: #555;
  }
  .skills-list {
    list-style-type: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .skills-list li {
    background-color: #e9f5ff;
    color: #0056b3;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.9em;
    font-weight: 500;
  }
  .grid-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
`;
export default styles;

    