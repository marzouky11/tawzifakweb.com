
import React from 'react';
import type { CVData } from '../../cv-form';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Star, User } from 'lucide-react';

interface Props {
  data: CVData;
}

const Template1: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template1" dir="rtl">
      <header className="header">
        <div className="header-content">
            {data.profilePicture && (
            <div className="avatar-container">
                <img src={data.profilePicture} alt="Profile" className="avatar" />
            </div>
            )}
            <div className="header-text">
                <h1>{data.fullName}</h1>
                <p className="job-title">{data.jobTitle}</p>
            </div>
        </div>
        <div className="contact-info">
          <span><Mail size={14} />{data.email}</span>
          <span><Phone size={14} />{data.phone}</span>
          <span><MapPin size={14} />{data.address}</span>
        </div>
      </header>
      
      <main className="main-content">
        <section className="section">
          <h2 className="section-title"><User size={20} className="icon" /> ملخص احترافي</h2>
          <p>{data.summary}</p>
        </section>
        
        <section className="section">
          <h2 className="section-title"><Briefcase size={20} className="icon" /> الخبرة العملية</h2>
          {data.experiences.map((exp, index) => (
            <div key={index} className="item">
              <h3>{exp.title}</h3>
              <p className="company">{exp.company} | {exp.date}</p>
              <p className="description">{exp.description}</p>
            </div>
          ))}
        </section>
        
        <section className="section">
          <h2 className="section-title"><GraduationCap size={20} className="icon" /> التعليم</h2>
          {data.educations.map((edu, index) => (
            <div key={index} className="item">
              <h3>{edu.degree}</h3>
              <p className="company">{edu.school} | {edu.date}</p>
            </div>
          ))}
        </section>
        
        <section className="section">
          <h2 className="section-title"><Star size={20} className="icon" /> المهارات</h2>
          <ul className="skills-list">
            {data.skills.map((skill, index) => (
              <li key={index}>{skill.name}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Template1;
