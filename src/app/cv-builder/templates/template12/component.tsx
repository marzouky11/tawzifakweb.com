
import React from 'react';
import type { CVData } from '../../cv-form';

interface Props {
  data: CVData;
}

const Template12: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template12" dir="rtl">
        <header className="header">
            <h1>{data.fullName}</h1>
            <p className="job-title">{data.jobTitle}</p>
            <p className="contact-info">
            {data.phone} | {data.email} | {data.address}
            </p>
        </header>

        <section>
            <h2>ملخص</h2>
            <p>{data.summary}</p>
        </section>

        <section>
            <h2>الخبرة</h2>
            {data.experiences.map((exp, index) => (
            <div key={index} className="item">
                <div className="item-header">
                    <h3>{exp.title}</h3>
                    <span>{exp.date}</span>
                </div>
                <p className="company">{exp.company}</p>
                <p>{exp.description}</p>
            </div>
            ))}
        </section>

        <section>
            <h2>التعليم</h2>
            {data.educations.map((edu, index) => (
            <div key={index} className="item">
                <div className="item-header">
                    <h3>{edu.degree}</h3>
                    <span>{edu.date}</span>
                </div>
                <p className="company">{edu.school}</p>
            </div>
            ))}
        </section>

        <section>
            <h2>المهارات</h2>
            <p>{data.skills?.map(skill => skill.name).join(' | ')}</p>
        </section>

        <section>
            <h2>اللغات</h2>
            <p>{data.languages?.map(lang => lang.name).join(' | ')}</p>
        </section>
    </div>
  );
};

export default Template12;
