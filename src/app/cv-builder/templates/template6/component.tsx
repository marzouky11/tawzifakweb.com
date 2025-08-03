
import React from 'react';
import type { CVData } from '../../cv-form';

interface Props {
  data: CVData;
}

const Template6: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page creative" dir="rtl">
      <div className="banner">
        <h1>{data.fullName}</h1>
        <p>{data.jobTitle}</p>
      </div>

      <div className="main-container">
        <div className="left-panel">
          <section className="contact">
            <h3>التواصل</h3>
            <p>{data.email}</p>
            <p>{data.phone}</p>
            <p>{data.address}</p>
          </section>
          <section className="education">
            <h3>التعليم</h3>
            {data.educations.map((edu, index) => (
              <div key={index} className="item">
                <h4>{edu.degree}</h4>
                <p>{edu.school}</p>
                <p>{edu.date}</p>
              </div>
            ))}
          </section>
          <section className="skills">
            <h3>المهارات</h3>
            <ul>
              {data.skills.map((skill, index) => (
                <li key={index}>{skill.name}</li>
              ))}
            </ul>
          </section>
        </div>
        <div className="right-panel">
          <section className="summary">
            <h2>ملخص احترافي</h2>
            <p>{data.summary}</p>
          </section>
          <section className="experience">
            <h2>الخبرة العملية</h2>
            {data.experiences.map((exp, index) => (
              <div key={index} className="item">
                <h3>{exp.title}</h3>
                <h4>{exp.company} | {exp.date}</h4>
                <p>{exp.description}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Template6;
