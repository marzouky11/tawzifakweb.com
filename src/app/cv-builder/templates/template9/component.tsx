
import React from 'react';
import type { CVData } from '../../cv-form';
import { Mail, Phone, MapPin, User, Briefcase, GraduationCap, Star, Globe } from 'lucide-react';

interface Props {
  data: CVData;
}

const Template9: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template9" dir="rtl">
      <div className="left-column">
        {data.profilePicture && (
          <img src={data.profilePicture} alt="Profile" className="avatar" />
        )}
        <section>
          <h2><User size={18} /> التواصل</h2>
          <p><Mail size={14} /> {data.email}</p>
          <p><Phone size={14} /> {data.phone}</p>
          <p><MapPin size={14} /> {data.address}</p>
        </section>
        <section>
          <h2><GraduationCap size={18} /> التعليم</h2>
          {data.educations.map((edu, index) => (
            <div key={index} className="item">
              <h3>{edu.degree}</h3>
              <p>{edu.school}</p>
              <p className="date">{edu.date}</p>
            </div>
          ))}
        </section>
        <section>
          <h2><Star size={18} /> المهارات</h2>
          <ul>{data.skills?.map((s, i) => <li key={i}>{s.name}</li>)}</ul>
        </section>
        <section>
          <h2><Globe size={18} /> اللغات</h2>
          <ul>{data.languages?.map((l, i) => <li key={i}>{l.name}</li>)}</ul>
        </section>
      </div>
      <div className="right-column">
        <header className="header">
          <h1>{data.fullName}</h1>
          <p>{data.jobTitle}</p>
        </header>
        <section>
          <h2>ملخص احترافي</h2>
          <p>{data.summary}</p>
        </section>
        <section>
          <h2><Briefcase size={20}/> الخبرة العملية</h2>
          {data.experiences.map((exp, index) => (
            <div key={index} className="item experience-item">
              <h3>{exp.title}</h3>
              <p className="company">{exp.company} | {exp.date}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Template9;

    