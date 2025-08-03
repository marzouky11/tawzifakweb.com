
import React from 'react';
import type { CVData } from '../../cv-form';

interface Props {
  data: CVData;
}

const Template4: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page simple" dir="rtl">
      <div className="grid-container">
        <div className="main-content">
          <header>
            <h1>{data.fullName}</h1>
            <p className="job-title">{data.jobTitle}</p>
          </header>

          <section>
            <h2 className="section-title">ملخص احترافي</h2>
            <p>{data.summary}</p>
          </section>

          <section>
            <h2 className="section-title">الخبرة العملية</h2>
            {data.experiences.map((exp, index) => (
              <div key={index} className="item">
                <h3>{exp.title}</h3>
                <p className="sub-heading">{exp.company} | {exp.date}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="section-title">التعليم</h2>
            {data.educations.map((edu, index) => (
              <div key={index} className="item">
                <h3>{edu.degree}</h3>
                <p className="sub-heading">{edu.school} | {edu.date}</p>
              </div>
            ))}
          </section>
        </div>

        <aside className="sidebar">
          <div className="contact-section">
            <h3>التواصل</h3>
            <p>{data.email}</p>
            <p>{data.phone}</p>
            <p>{data.address}</p>
          </div>
          <div className="skills-section">
            <h3>المهارات</h3>
            <ul>
              {data.skills.map((skill, index) => (
                <li key={index}>{skill.name}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Template4;
