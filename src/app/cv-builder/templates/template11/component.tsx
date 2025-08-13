
import React from 'react';
import type { CVData } from '../../cv-form';

interface Props {
  data: CVData;
}

const Template11: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template11" dir="rtl">
      <header className="header">
        <h1>{data.fullName}</h1>
        <p className="job-title">{data.jobTitle}</p>
        <div className="contact-info">
          <span>{data.email}</span>
          {' | '}
          <span>{data.phone}</span>
          {' | '}
          <span>{data.address}</span>
        </div>
      </header>
      
      <main className="main-content">
        <section>
          <h2>ملخص احترافي</h2>
          <p>{data.summary}</p>
        </section>
        
        <section>
          <h2>الخبرة العملية</h2>
          {data.experiences.map((exp, index) => (
            <div key={index} className="item">
              <h3>{exp.title}</h3>
              <p className="sub-heading">{exp.company} | {exp.date}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
        
        <section>
          <h2>التعليم</h2>
          {data.educations.map((edu, index) => (
            <div key={index} className="item">
              <h3>{edu.degree}</h3>
              <p className="sub-heading">{edu.school} | {edu.date}</p>
            </div>
          ))}
        </section>
        
        <section>
          <h2>المهارات</h2>
          <p>{data.skills?.map(skill => skill.name).join('، ')}</p>
        </section>
        
        <section>
          <h2>اللغات</h2>
          <p>{data.languages?.map(lang => lang.name).join('، ')}</p>
        </section>
      </main>
    </div>
  );
};

export default Template11;
