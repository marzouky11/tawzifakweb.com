
import React from 'react';
import type { CVData } from '../../cv-form';
import { Mail, Phone, MapPin, User, Briefcase, GraduationCap, Star, Globe } from 'lucide-react';

interface Props {
  data: CVData;
}

const Template10: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template10" dir="rtl">
      <header className="header">
        <div className="header-main">
            <h1>{data.fullName}</h1>
            <p className="job-title">{data.jobTitle}</p>
        </div>
         {data.profilePicture && (
          <img src={data.profilePicture} alt="Profile" className="avatar" />
        )}
      </header>
      
      <div className="contact-info">
          <span><Mail size={14} />{data.email}</span>
          <span><Phone size={14} />{data.phone}</span>
          <span><MapPin size={14} />{data.address}</span>
      </div>

      <section>
        <h2><User size={20} /> ملخص احترافي</h2>
        <p>{data.summary}</p>
      </section>

      <section>
        <h2><Briefcase size={20} /> الخبرة العملية</h2>
        {data.experiences.map((exp, index) => (
          <div key={index} className="item">
            <h3>{exp.title}</h3>
            <p className="sub-heading">{exp.company} | {exp.date}</p>
            <p>{exp.description}</p>
          </div>
        ))}
      </section>

      <section>
        <h2><GraduationCap size={20} /> التعليم</h2>
        {data.educations.map((edu, index) => (
          <div key={index} className="item">
            <h3>{edu.degree}</h3>
            <p className="sub-heading">{edu.school} | {edu.date}</p>
          </div>
        ))}
      </section>

      <div className="grid-section">
          <section>
            <h2><Star size={18} /> المهارات</h2>
            <ul>
              {data.skills?.map((s, i) => <li key={i}>{s.name}</li>)}
            </ul>
          </section>
          <section>
            <h2><Globe size={18} /> اللغات</h2>
            <ul>
              {data.languages?.map((l, i) => <li key={i}>{l.name}</li>)}
            </ul>
          </section>
      </div>

    </div>
  );
};

export default Template10;

    