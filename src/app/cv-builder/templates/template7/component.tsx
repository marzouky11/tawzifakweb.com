
import React from 'react';
import type { CVData } from '../../cv-form';
import { Mail, Phone, MapPin, User, Briefcase, GraduationCap, Star, Globe } from 'lucide-react';

interface Props {
  data: CVData;
}

const Template7: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template7" dir="rtl">
      <div className="main-content">
        <header className="header">
          {data.profilePicture && (
            <img src={data.profilePicture} alt="Profile" className="avatar" />
          )}
          <div className="header-text">
            <h1>{data.fullName}</h1>
            <p>{data.jobTitle}</p>
          </div>
        </header>
        
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
      </div>

      <aside className="sidebar">
        <div className="contact-info">
          <h3>معلومات التواصل</h3>
          <p><Mail size={14} /> {data.email}</p>
          <p><Phone size={14} /> {data.phone}</p>
          <p><MapPin size={14} /> {data.address}</p>
        </div>
        <div className="skills">
          <h3><Star size={18}/> المهارات</h3>
          <ul>
            {data.skills?.map((skill, index) => <li key={index}>{skill.name}</li>)}
          </ul>
        </div>
        <div className="skills">
          <h3><Globe size={18}/> اللغات</h3>
          <ul>
            {data.languages?.map((lang, index) => <li key={index}>{lang.name}</li>)}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Template7;

    