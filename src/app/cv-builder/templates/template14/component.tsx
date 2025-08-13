
import React from 'react';
import type { CVData } from '../../cv-form';

interface Props {
  data: CVData;
}

const Template14: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template14" dir="rtl">
        <header className="header">
            <h1>{data.fullName}</h1>
            <p className="contact-info">
            {data.address} | {data.phone} | {data.email}
            </p>
            <p className="job-title">{data.jobTitle}</p>
        </header>

        <section>
            <h2>الملخص المهني</h2>
            <p>{data.summary}</p>
        </section>

        <section>
            <h2>الخبرة العملية</h2>
            {data.experiences.map((exp, index) => (
            <div key={index} className="item">
                <h3>{exp.company}</h3>
                <div className="item-details">
                    <p>{exp.title}</p>
                    <p>{exp.date}</p>
                </div>
                <p className="description">{exp.description}</p>
            </div>
            ))}
        </section>

        <section>
            <h2>المؤهلات العلمية</h2>
            {data.educations.map((edu, index) => (
             <div key={index} className="item">
                <h3>{edu.school}</h3>
                <div className="item-details">
                    <p>{edu.degree}</p>
                    <p>{edu.date}</p>
                </div>
            </div>
            ))}
        </section>

        <section>
            <h2>المهارات واللغات</h2>
            <p>
                <strong>المهارات:</strong> {data.skills?.map(s => s.name).join(', ')}
                <br/>
                <strong>اللغات:</strong> {data.languages?.map(l => l.name).join(', ')}
            </p>
        </section>
    </div>
  );
};

export default Template14;
