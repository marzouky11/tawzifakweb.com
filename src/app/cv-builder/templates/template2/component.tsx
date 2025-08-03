
import React from 'react';
import type { CVData } from '../../cv-form';
import { Mail, Phone, MapPin, User, Briefcase, GraduationCap, Star, Linkedin } from 'lucide-react';

interface Props {
  data: CVData;
}

const Template2: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template2" dir="rtl">
      <aside className="sidebar">
        {data.profilePicture && (
          <div className="avatar-container">
            <img src={data.profilePicture} alt="Profile" className="avatar" />
          </div>
        )}
        <div className="header-main">
          <h1>{data.fullName}</h1>
          <p className="job-title">{data.jobTitle}</p>
        </div>
        <div className="contact-info">
          <h2><User size={18} /> معلومات التواصل</h2>
          <p><Mail size={14} /> {data.email}</p>
          <p><Phone size={14} /> {data.phone}</p>
          <p><MapPin size={14} /> {data.address}</p>
        </div>
        <div className="skills-info">
          <h2><Star size={18} /> المهارات</h2>
          <ul>
            {data.skills.map((skill, index) => (
              <li key={index}>{skill.name}</li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="main-panel">
        <section>
          <h2>ملخص احترافي</h2>
          <p>{data.summary}</p>
        </section>

        <section>
          <h2><Briefcase size={20} /> الخبرة العملية</h2>
          {data.experiences.map((exp, index) => (
            <div key={index} className="item">
              <h3>{exp.title}</h3>
              <p className="sub-heading">{exp.company} | {exp.date}</p>
              <p className="description">{exp.description}</p>
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
    </div>
  );
};

export default Template2;
