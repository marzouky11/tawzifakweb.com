
import React from 'react';
import type { CVData } from '../../cv-form';
import { Mail, Phone, MapPin, User, Briefcase, GraduationCap, Star, Globe } from 'lucide-react';

interface Props {
  data: CVData;
}

const Template3: React.FC<Props> = ({ data }) => {
  return (
    <div className="a4-page template3" dir="rtl">
      <div className="container">
        <header className="header">
          {data.profilePicture && <img src={data.profilePicture} alt="Profile" className="avatar" />}
          <h1>{data.fullName}</h1>
          <p className="job-title">{data.jobTitle}</p>
        </header>

        <div className="contact-bar">
          <span><Mail size={14}/>{data.email}</span>
          <span><Phone size={14}/>{data.phone}</span>
          <span><MapPin size={14}/>{data.address}</span>
        </div>

        <section>
          <div className="section-title">
            <User size={18} />
            <span>ملخص احترافي</span>
          </div>
          <div className="section-content">
            <p>{data.summary}</p>
          </div>
        </section>

        <section>
          <div className="section-title">
            <Briefcase size={18} />
            <span>الخبرة العملية</span>
          </div>
          <div className="section-content">
            {data.experiences.map((exp, index) => (
              <div key={index} className="item">
                <h3>{exp.title}</h3>
                <p className="sub-heading">{exp.company} | {exp.date}</p>
                <p className="description">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="section-title">
            <GraduationCap size={18} />
            <span>التعليم</span>
          </div>
          <div className="section-content">
            {data.educations.map((edu, index) => (
              <div key={index} className="item">
                <h3>{edu.degree}</h3>
                <p className="sub-heading">{edu.school} | {edu.date}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid-section">
            <section>
                <div className="section-title">
                    <Star size={18} />
                    <span>المهارات</span>
                </div>
                <div className="section-content skills">
                    {data.skills?.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill.name}</span>
                    ))}
                </div>
            </section>
            <section>
                <div className="section-title">
                    <Globe size={18} />
                    <span>اللغات</span>
                </div>
                <div className="section-content skills">
                    {data.languages?.map((lang, index) => (
                    <span key={index} className="skill-tag">{lang.name}</span>
                    ))}
                </div>
            </section>
        </div>

      </div>
    </div>
  );
};

export default Template3;

    