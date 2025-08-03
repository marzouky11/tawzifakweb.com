
import React from 'react';
import type { CVData } from '../../cv-form';

interface Props {
  data: CVData;
}

const Template1: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page" dir="rtl">
      <header className="header">
        <div className="header-main">
          <h1>{data.fullName}</h1>
          <p>{data.jobTitle}</p>
        </div>
        <div className="header-contact">
          <p>{data.email}</p>
          <p>{data.phone}</p>
          <p>{data.address}</p>
        </div>
      </header>
      
      <main className="main-content">
        <section className="section">
          <h2 className="section-title">ملخص احترافي</h2>
          <p>{data.summary}</p>
        </section>
        
        <section className="section">
          <h2 className="section-title">الخبرة العملية</h2>
          {data.experiences.map((exp, index) => (
            <div key={index} className="item">
              <h3>{exp.title}</h3>
              <p className="company">{exp.company} | {exp.date}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
        
        <section className="section">
          <h2 className="section-title">التعليم</h2>
          {data.educations.map((edu, index) => (
            <div key={index} className="item">
              <h3>{edu.degree}</h3>
              <p className="company">{edu.school} | {edu.date}</p>
            </div>
          ))}
        </section>
        
        <section className="section">
          <h2 className="section-title">المهارات</h2>
          <ul className="skills-list">
            {data.skills.map((skill, index) => (
              <li key={index}>{skill.name}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Template1;
