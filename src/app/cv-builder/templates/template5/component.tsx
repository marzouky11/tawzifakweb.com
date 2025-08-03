
import React from 'react';
import type { CVData } from '../../cv-form';

interface Props {
  data: CVData;
}

const Template5: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page professional" dir="rtl">
      <header className="header">
        <div className="name-title">
          <h1>{data.fullName}</h1>
          <p>{data.jobTitle}</p>
        </div>
        <div className="contact-details">
          <div>{data.email}</div>
          <div>{data.phone}</div>
          <div>{data.address}</div>
        </div>
      </header>

      <div className="content-wrapper">
        <div className="left-column">
          <section>
            <h2>ملخص احترافي</h2>
            <p>{data.summary}</p>
          </section>

          <section>
            <h2>الخبرة العملية</h2>
            {data.experiences.map((exp, index) => (
              <div key={index} className="item">
                <h3>{exp.title}</h3>
                <div className="sub-heading">
                  <span>{exp.company}</span>
                  <span>{exp.date}</span>
                </div>
                <p>{exp.description}</p>
              </div>
            ))}
          </section>
        </div>

        <div className="right-column">
          <section>
            <h2>التعليم</h2>
            {data.educations.map((edu, index) => (
              <div key={index} className="item">
                <h3>{edu.degree}</h3>
                <div className="sub-heading">
                  <span>{edu.school}</span>
                  <span>{edu.date}</span>
                </div>
              </div>
            ))}
          </section>
          
          <section>
            <h2>المهارات</h2>
            <ul>
              {data.skills.map((skill, index) => (
                <li key={index}>{skill.name}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Template5;
