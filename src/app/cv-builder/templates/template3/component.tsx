
import React from 'react';
import type { CVData } from '../../cv-form';

interface Props {
  data: CVData;
}

const Template3: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page elegant" dir="rtl">
      <div className="container">
        <header className="header">
          <h1>{data.fullName}</h1>
          <p className="job-title">{data.jobTitle}</p>
        </header>

        <div className="contact-bar">
          <span>{data.email}</span> | <span>{data.phone}</span> | <span>{data.address}</span>
        </div>

        <section>
          <div className="section-title">ملخص احترافي</div>
          <div className="section-content">
            <p>{data.summary}</p>
          </div>
        </section>

        <section>
          <div className="section-title">الخبرة العملية</div>
          <div className="section-content">
            {data.experiences.map((exp, index) => (
              <div key={index} className="item">
                <h3>{exp.title}</h3>
                <p className="sub-heading">{exp.company} | {exp.date}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="section-title">التعليم</div>
          <div className="section-content">
            {data.educations.map((edu, index) => (
              <div key={index} className="item">
                <h3>{edu.degree}</h3>
                <p className="sub-heading">{edu.school} | {edu.date}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="section-title">المهارات</div>
          <div className="section-content skills">
            {data.skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill.name}</span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Template3;
