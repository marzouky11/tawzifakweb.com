
import React from 'react';
import type { CVData } from '../../cv-form';
import { Mail, Phone, MapPin, User, Briefcase, GraduationCap, Star } from 'lucide-react';


interface Props {
  data: CVData;
}

const Template6: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template6" dir="rtl">
      <div className="banner">
         {data.profilePicture && <img src={data.profilePicture} alt="Profile" className="avatar" />}
        <h1>{data.fullName}</h1>
        <p>{data.jobTitle}</p>
      </div>

      <div className="main-container">
        <div className="left-panel">
          <section className="contact">
            <h3><User size={18}/> التواصل</h3>
            <p><Mail size={14}/> {data.email}</p>
            <p><Phone size={14}/> {data.phone}</p>
            <p><MapPin size={14}/> {data.address}</p>
          </section>
          <section className="education">
            <h3><GraduationCap size={18}/> التعليم</h3>
            {data.educations.map((edu, index) => (
              <div key={index} className="item">
                <h4>{edu.degree}</h4>
                <p>{edu.school}</p>
                <p>{edu.date}</p>
              </div>
            ))}
          </section>
          <section className="skills">
            <h3><Star size={18}/> المهارات</h3>
            <ul>
              {data.skills.map((skill, index) => (
                <li key={index}>{skill.name}</li>
              ))}
            </ul>
          </section>
        </div>
        <div className="right-panel">
          <section className="summary">
            <h2>ملخص احترافي</h2>
            <p>{data.summary}</p>
          </section>
          <section className="experience">
            <h2><Briefcase size={20}/> الخبرة العملية</h2>
            {data.experiences.map((exp, index) => (
              <div key={index} className="item">
                <h3>{exp.title}</h3>
                <h4>{exp.company} | {exp.date}</h4>
                <p className="description">{exp.description}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Template6;
