
import React from 'react';
import type { CVData } from '../../cv-form';

interface Props {
  data: CVData;
}

const Template2: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page classic" dir="rtl">
      <aside className="sidebar">
        <div className="contact-info">
          <h2>معلومات التواصل</h2>
          <p><strong>الإيميل:</strong> {data.email}</p>
          <p><strong>الهاتف:</strong> {data.phone}</p>
          <p><strong>العنوان:</strong> {data.address}</p>
        </div>
        <div className="skills-info">
          <h2>المهارات</h2>
          <ul>
            {data.skills.map((skill, index) => (
              <li key={index}>{skill.name}</li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="main-panel">
        <header>
          <h1>{data.fullName}</h1>
          <p className="job-title">{data.jobTitle}</p>
        </header>

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
      </div>
    </div>
  );
};

export default Template2;
