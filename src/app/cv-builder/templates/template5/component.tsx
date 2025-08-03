
import React from 'react';
import type { CVData } from '../../cv-form';
import { Mail, Phone, MapPin, User, Briefcase, GraduationCap, Star } from 'lucide-react';

interface Props {
  data: CVData;
}

const Template5: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template5" dir="rtl">
      <header className="header">
        <div className="name-title">
          <h1>{data.fullName}</h1>
          <p>{data.jobTitle}</p>
        </div>
        <div className="contact-details">
          <div><Mail size={14}/> {data.email}</div>
          <div><Phone size={14}/> {data.phone}</div>
          <div><MapPin size={14}/> {data.address}</div>
        </div>
      </header>

      <div className="content-wrapper">
        <div className="left-column">
          <section>
            <h2><User size={18} /> ملخص احترافي</h2>
            <p>{data.summary}</p>
          </section>

          <section>
            <h2><Briefcase size={18} /> الخبرة العملية</h2>
            {data.experiences.map((exp, index) => (
              <div key={index} className="item">
                <h3>{exp.title}</h3>
                <div className="sub-heading">
                  <span>{exp.company}</span>
                  <span>{exp.date}</span>
                </div>
                <p className="description">{exp.description}</p>
              </div>
            ))}
          </section>
        </div>

        <div className="right-column">
          {data.profilePicture && (
            <div className="avatar-container">
              <img src={data.profilePicture} alt="Profile" className="avatar" />
            </div>
          )}
          <section>
            <h2><GraduationCap size={18} /> التعليم</h2>
            {data.educations.map((edu, index) => (
              <div key={index} className="item">
                <h3>{edu.degree}</h3>
                <div className="sub-heading">
                  <span>{edu.school}</span>
                  <span>{edu.date}</span>
                </div>
              </div>
            ))}
          </section>
          
          <section>
            <h2><Star size={18} /> المهارات</h2>
            <ul>
              {data.skills.map((skill, index) => (
                <li key={index}>{skill.name}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Template5;
