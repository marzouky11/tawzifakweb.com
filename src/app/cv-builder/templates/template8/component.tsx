
import React from 'react';
import type { CVData } from '../../cv-form';
import { Mail, Phone, MapPin, User, Briefcase, GraduationCap, Star, Globe } from 'lucide-react';

interface Props {
  data: CVData;
}

const Template8: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template8" dir="rtl">
      <header className="header">
        {data.profilePicture && (
          <img src={data.profilePicture} alt="Profile" className="avatar" />
        )}
        <div className="header-text">
          <h1>{data.fullName}</h1>
          <p>{data.jobTitle}</p>
        </div>
      </header>

      <main className="content">
        <div className="main-column">
          <section>
            <h2><User size={20}/> ملخص احترافي</h2>
            <p>{data.summary}</p>
          </section>
          <section>
            <h2><Briefcase size={20}/> الخبرة العملية</h2>
            {data.experiences.map((exp, index) => (
              <div key={index} className="item">
                <h3>{exp.title}</h3>
                <p className="sub-heading">{exp.company} | {exp.date}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </section>
        </div>
        <div className="sidebar-column">
          <section>
            <h3>التواصل</h3>
            <p><Mail size={14} /> {data.email}</p>
            <p><Phone size={14} /> {data.phone}</p>
            <p><MapPin size={14} /> {data.address}</p>
          </section>
          <section>
            <h3><GraduationCap size={18}/> التعليم</h3>
            {data.educations.map((edu, index) => (
              <div key={index} className="item">
                <h4>{edu.degree}</h4>
                <p className="sub-heading">{edu.school} | {edu.date}</p>
              </div>
            ))}
          </section>
          <section>
            <h3><Star size={18}/> المهارات</h3>
            <div className="tags">
              {data.skills?.map((skill, index) => <span key={index} className="tag">{skill.name}</span>)}
            </div>
          </section>
          <section>
            <h3><Globe size={18}/> اللغات</h3>
            <div className="tags">
              {data.languages?.map((lang, index) => <span key={index} className="tag">{lang.name}</span>)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Template8;

    