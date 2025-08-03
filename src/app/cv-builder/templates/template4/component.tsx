
import React from 'react';
import type { CVData } from '../../cv-form';
import { Mail, Phone, MapPin, User, Briefcase, GraduationCap, Star } from 'lucide-react';

interface Props {
  data: CVData;
}

const Template4: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template4" dir="rtl">
      <div className="grid-container">
        <aside className="sidebar">
          {data.profilePicture && (
            <div className="avatar-container">
                <img src={data.profilePicture} alt="Profile" className="avatar" />
            </div>
          )}
          <header>
            <h1>{data.fullName}</h1>
            <p className="job-title">{data.jobTitle}</p>
          </header>
          <div className="contact-section">
            <h3><User size={16} /> التواصل</h3>
            <p><Mail size={14} /> {data.email}</p>
            <p><Phone size={14} /> {data.phone}</p>
            <p><MapPin size={14} /> {data.address}</p>
          </div>
          <div className="skills-section">
            <h3><Star size={16} /> المهارات</h3>
            <ul>
              {data.skills.map((skill, index) => (
                <li key={index}>{skill.name}</li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="main-content">
          <section>
            <h2 className="section-title">ملخص احترافي</h2>
            <p>{data.summary}</p>
          </section>

          <section>
            <h2 className="section-title"><Briefcase size={18} /> الخبرة العملية</h2>
            {data.experiences.map((exp, index) => (
              <div key={index} className="item">
                <h3>{exp.title}</h3>
                <p className="sub-heading">{exp.company} | {exp.date}</p>
                <p className="description">{exp.description}</p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="section-title"><GraduationCap size={18} /> التعليم</h2>
            {data.educations.map((edu, index) => (
              <div key={index} className="item">
                <h3>{edu.degree}</h3>
                <p className="sub-heading">{edu.school} | {edu.date}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Template4;
