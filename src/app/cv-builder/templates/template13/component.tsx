
import React from 'react';
import type { CVData } from '../../cv-form';

interface Props {
  data: CVData;
}

const Template13: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template13" dir="rtl">
      <aside className="sidebar">
        <h1>{data.fullName}</h1>
        <p className="job-title">{data.jobTitle}</p>
        <section>
          <h3>التواصل</h3>
          <p>{data.email}</p>
          <p>{data.phone}</p>
          <p>{data.address}</p>
        </section>
        <section>
          <h3>المهارات</h3>
          <ul>
            {data.skills?.map((skill, index) => <li key={index}>{skill.name}</li>)}
          </ul>
        </section>
        <section>
          <h3>اللغات</h3>
          <ul>
            {data.languages?.map((lang, index) => <li key={index}>{lang.name}</li>)}
          </ul>
        </section>
      </aside>
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
              <p className="company">{exp.company} | {exp.date}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
        <section>
          <h2>التعليم</h2>
          {data.educations.map((edu, index) => (
            <div key={index} className="item">
              <h3>{edu.degree}</h3>
              <p className="company">{edu.school} | {edu.date}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Template13;
